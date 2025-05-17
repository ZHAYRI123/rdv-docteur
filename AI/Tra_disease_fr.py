import pandas as pd
from transformers import MarianMTModel, MarianTokenizer

# Charger le fichier
df = pd.read_csv("./dataset_with_specialty.csv")

# Traduire les maladies en français
unique_diseases = df["Disease"].unique()

# Setup de la traduction
tokenizer = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-en-fr")
model = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-en-fr")

def translate_en_to_fr(text):
    batch = tokenizer([text], return_tensors="pt", padding=True)
    gen = model.generate(**batch)
    return tokenizer.decode(gen[0], skip_special_tokens=True)

# Dictionnaire de traduction
disease_translations = {
    disease: translate_en_to_fr(disease) for disease in unique_diseases
}

# Sauvegarde du dictionnaire
import json
with open("disease_translations.json", "w", encoding="utf-8") as f:
    json.dump(disease_translations, f, ensure_ascii=False, indent=2)

