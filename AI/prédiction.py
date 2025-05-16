import torch
from transformers import BertTokenizer, BertModel
from torch import nn
import joblib
import sys

# ======= Modèle multitâche =======
# Ce modèle a appris à reconnaître la maladie et la spécialité en lisant des symptômes:
# demande d’écrire les symptômes.
# Charge le modèle que entraîné.
# donne la maladie et la spécialité médicale prédites.

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

# ======= Chargement des ressources =======
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
disease_encoder = joblib.load("disease_encoder.pkl")
specialty_encoder = joblib.load("specialty_encoder.pkl")
tokenizer = BertTokenizer.from_pretrained("biobert_tokenizer")

num_diseases = len(disease_encoder.classes_)
num_specialties = len(specialty_encoder.classes_)

model = BioBERTMultiTask(num_diseases, num_specialties)
model.load_state_dict(torch.load("biobert_multitask_model.pth", map_location=device))
model = model.to(device)
model.eval()

# ======= Fonction de prédiction =======
def predict(symptoms_text):
    encoding = tokenizer.encode_plus(
        symptoms_text,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors="pt"
    )
    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)

    with torch.no_grad():
        disease_logits, specialty_logits = model(input_ids, attention_mask)
        disease_pred = torch.argmax(disease_logits, dim=1).cpu().item()
        specialty_pred = torch.argmax(specialty_logits, dim=1).cpu().item()

    disease_name = disease_encoder.inverse_transform([disease_pred])[0]
    specialty_name = specialty_encoder.inverse_transform([specialty_pred])[0]

    return disease_name, specialty_name

# ======= Interface terminal simple =======
if __name__ == "__main__":
    print("Entrez vos symptômes (ex: fièvre, toux, fatigue) :")
    user_input = input(">> ")

    disease, specialty = predict(user_input)
    print("\nRésultat de l'IA :")
    print(f"Pathologie prédite : {disease}")
    print(f"Spécialité suggérée : {specialty}")

