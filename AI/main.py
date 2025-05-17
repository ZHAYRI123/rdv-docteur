from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import BertTokenizer, BertModel, GPT2LMHeadModel, GPT2Tokenizer
import torch
import torch.nn as nn
import joblib

# Déclaration API
app = FastAPI()

# 🔹 Données en entrée
class SymptomInput(BaseModel):
    symptoms: str

# 🔹 Modèle multi-tâche (BioBERT)
class BioBERTMultiTask(nn.Module):
    def __init__(self, num_diseases, num_specialties):
        super(BioBERTMultiTask, self).__init__()
        self.bert = BertModel.from_pretrained("monologg/biobert_v1.1_pubmed")
        self.dropout = nn.Dropout(0.3)
        self.disease_classifier = nn.Linear(self.bert.config.hidden_size, num_diseases)
        self.specialty_classifier = nn.Linear(self.bert.config.hidden_size, num_specialties)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = self.dropout(outputs.pooler_output)
        disease_logits = self.disease_classifier(pooled_output)
        specialty_logits = self.specialty_classifier(pooled_output)
        return disease_logits, specialty_logits

# 🔹 Chargement des composants
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

disease_encoder = joblib.load("disease_encoder.pkl")
specialty_encoder = joblib.load("specialty_encoder.pkl")
tokenizer = BertTokenizer.from_pretrained("biobert_tokenizer")

model = BioBERTMultiTask(len(disease_encoder.classes_), len(specialty_encoder.classes_))
model.load_state_dict(torch.load("biobert_multitask_model.pth", map_location=device))
model.to(device)
model.eval()

# GPT-2 pour réponse naturelle
gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
gpt2_model.eval()

# 🔹 Fonction de réponse naturelle
def generate_response(symptoms_text, disease_name, specialty_name):
    prompt = (
        f"Le patient présente les symptômes suivants : {symptoms_text}.\n"
        f"D’après l’analyse, il pourrait s’agir de : {disease_name}.\n"
        f"La spécialité médicale recommandée est : {specialty_name}.\n"
        f"Réponds au patient de manière naturelle en français :\n"
        f"Réponse :"
    )

    inputs = gpt2_tokenizer.encode(prompt, return_tensors="pt", max_length=512, truncation=True)
    outputs = gpt2_model.generate(
        inputs,
        max_length=250,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        top_k=50,
        top_p=0.95,
        temperature=0.7,
        do_sample=True,
        pad_token_id=gpt2_tokenizer.eos_token_id
    )
    response = gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.split("Réponse :")[-1].strip()

# 🔹 Endpoint API : /predict
@app.post("/predict")
def predict(input_data: SymptomInput):
    try:
        encoding = tokenizer.encode_plus(
            input_data.symptoms,
            add_special_tokens=True,
            max_length=128,
            padding="max_length",
            truncation=True,
            return_attention_mask=True,
            return_tensors="pt"
        )
        input_ids = encoding['input_ids'].to(device)
        attention_mask = encoding['attention_mask'].to(device)

        with torch.no_grad():
            disease_logits, specialty_logits = model(input_ids, attention_mask)
            disease_idx = torch.argmax(disease_logits, dim=1).item()
            specialty_idx = torch.argmax(specialty_logits, dim=1).item()

        disease = disease_encoder.inverse_transform([disease_idx])[0]
        specialty = specialty_encoder.inverse_transform([specialty_idx])[0]
        response_text = generate_response(input_data.symptoms, disease, specialty)

        return {
            "disease": disease,
            "specialty": specialty,
            "response": response_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# exécute : uvicorn main:app --reload
