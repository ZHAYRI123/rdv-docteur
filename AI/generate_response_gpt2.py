from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Formuler une réponse naturelle avec GPT-2 à partir de la prédiction:
# Créer un prompt clair à donner à GPT-2
# Resultat: 

# Charger GPT-2
gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
gpt2_model.eval()

# fonction utilise GPT-2, un modèle de génération de texte, pour créer une phrase humaine à partir de ces trois informations
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
    # Extraire uniquement la réponse après "Réponse :"
    final_response = response.split("Réponse :")[-1].strip()
    return final_response

