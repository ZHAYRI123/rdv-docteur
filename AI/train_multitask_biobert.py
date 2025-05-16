import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertModel, AdamW
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import torch.nn as nn
import joblib
import os

# Load dataset
df = pd.read_csv("./dataset_with_specialty.csv")
df['symptoms'] = df.iloc[:, 1:18].apply(lambda x: ' '.join(x.dropna().astype(str)), axis=1)

# Encode labels
disease_encoder = LabelEncoder()
specialty_encoder = LabelEncoder()
df['disease_label'] = disease_encoder.fit_transform(df['Disease'])
df['specialty_label'] = specialty_encoder.fit_transform(df['Specialty'])

# Save encoders
joblib.dump(disease_encoder, "disease_encoder.pkl")
joblib.dump(specialty_encoder, "specialty_encoder.pkl")

# Tokenizer
tokenizer = BertTokenizer.from_pretrained("monologg/biobert_v1.1_pubmed")

# Dataset
class SymptomDataset(Dataset):
    def __init__(self, texts, disease_labels, specialty_labels, tokenizer, max_len=128):
        self.texts = texts
        self.disease_labels = disease_labels
        self.specialty_labels = specialty_labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        disease_label = self.disease_labels[idx]
        specialty_label = self.specialty_labels[idx]
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            padding="max_length",
            truncation=True,
            return_attention_mask=True,
            return_tensors="pt"
        )
        return {
            'input_ids': encoding['input_ids'].squeeze(),
            'attention_mask': encoding['attention_mask'].squeeze(),
            'disease_label': torch.tensor(disease_label, dtype=torch.long),
            'specialty_label': torch.tensor(specialty_label, dtype=torch.long)
        }

# Split dataset
train_texts, val_texts, train_disease, val_disease, train_spec, val_spec = train_test_split(
    df['symptoms'], df['disease_label'], df['specialty_label'], test_size=0.2, random_state=42
)

train_dataset = SymptomDataset(train_texts.tolist(), train_disease.tolist(), train_spec.tolist(), tokenizer)
val_dataset = SymptomDataset(val_texts.tolist(), val_disease.tolist(), val_spec.tolist(), tokenizer)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=16)

# Model multitâche
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

# Init model
num_diseases = len(disease_encoder.classes_)
num_specialties = len(specialty_encoder.classes_)
model = BioBERTMultiTask(num_diseases, num_specialties)

# Train settings
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
optimizer = AdamW(model.parameters(), lr=2e-5)
loss_fn = nn.CrossEntropyLoss()

# Training loop
epochs = 3
for epoch in range(epochs):
    model.train()
    total_loss = 0
    for batch in train_loader:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        disease_labels = batch['disease_label'].to(device)
        specialty_labels = batch['specialty_label'].to(device)

        optimizer.zero_grad()
        disease_logits, specialty_logits = model(input_ids, attention_mask)
        loss1 = loss_fn(disease_logits, disease_labels)
        loss2 = loss_fn(specialty_logits, specialty_labels)
        loss = loss1 + loss2
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    avg_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}")

# Save model and tokenizer
torch.save(model.state_dict(), "biobert_multitask_model.pth")
tokenizer.save_pretrained("biobert_tokenizer")

print("Modèle entraîné et sauvegardé avec succès.")
