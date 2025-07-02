import os
import sys
import glob
from PIL import Image
from tqdm import tqdm
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from sentence_transformers import SentenceTransformer, util

# Supported image formats
IMAGE_FORMATS = ("*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif", "*.tiff", "*.webp")
ASSETS_DIR = "assets"
SIMILARITY_THRESHOLD = 0.3  # Default threshold, can be changed by user

def get_image_paths(folder):
    paths = []
    for ext in IMAGE_FORMATS:
        paths.extend(glob.glob(os.path.join(folder, ext)))
    return paths

def describe_image(image_path, processor, model, device):
    try:
        raw_image = Image.open(image_path).convert('RGB')
        inputs = processor(raw_image, return_tensors="pt").to(device)
        out = model.generate(**inputs)
        description = processor.decode(out[0], skip_special_tokens=True)
        return description
    except Exception as e:
        print(f"[Error] Failed to process {image_path}: {e}")
        return None

def process_images(image_paths, processor, model, device):
    descriptions = []
    valid_paths = []
    for path in tqdm(image_paths, desc="Describing images"):
        desc = describe_image(path, processor, model, device)
        if desc:
            descriptions.append(desc)
            valid_paths.append(path)
    return descriptions, valid_paths

def main():
    print("\n--- Image Search System using Hugging Face Transformers ---\n")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    # Load models
    print("Loading BLIP VQA model for image description...")
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(device)

    print("Loading sentence transformer for semantic similarity...")
    sent_model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

    # Get image paths
    image_paths = get_image_paths(ASSETS_DIR)
    if not image_paths:
        print(f"No images found in '{ASSETS_DIR}' folder.")
        sys.exit(1)

    # Generate descriptions
    descriptions, valid_paths = process_images(image_paths, processor, blip_model, device)
    print(f"\nProcessed {len(valid_paths)} images.")

    # Encode descriptions
    print("Encoding image descriptions...")
    desc_embeddings = sent_model.encode(descriptions, convert_to_tensor=True)

    # Interactive search
    global SIMILARITY_THRESHOLD
    while True:
        print("\nEnter your search query (or type 'exit' to quit):")
        query = input().strip()
        if query.lower() == 'exit':
            break
        print(f"Current similarity threshold: {SIMILARITY_THRESHOLD}")
        print("Type a new threshold (0-1) or press Enter to keep:")
        threshold_input = input().strip()
        if threshold_input:
            try:
                SIMILARITY_THRESHOLD = float(threshold_input)
            except ValueError:
                print("Invalid threshold. Using previous value.")
        # Encode query
        query_emb = sent_model.encode(query, convert_to_tensor=True)
        # Compute cosine similarities
        cos_scores = util.cos_sim(query_emb, desc_embeddings)[0]
        # Rank results
        results = [(score.item(), desc, path) for score, desc, path in zip(cos_scores, descriptions, valid_paths) if score.item() >= SIMILARITY_THRESHOLD]
        results.sort(reverse=True, key=lambda x: x[0])
        # Display results
        if not results:
            print("No images found matching your query.")
        else:
            print(f"\nTop results (threshold={SIMILARITY_THRESHOLD}):")
            for score, desc, path in results:
                print(f"Score: {score:.3f} | {os.path.basename(path)}\n  Description: {desc}\n  Path: {path}\n")

if __name__ == "__main__":
    main() 