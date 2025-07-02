import sys
import torch
from transformers import pipeline
import re

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def valid_paragraph(text):
    words = text.strip().split()
    return len(words) >= 10 and len(text) <= 1000

def valid_question(text):
    return len(text.strip().split()) >= 2

def main():
    print("\n--- Q&A Summarizer ---\n")
    device = 0 if torch.cuda.is_available() else -1

    # Load models
    print("Loading summarization model...")
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=device)
    print("Loading question answering model...")
    qa = pipeline("question-answering", model="distilbert-base-cased-distilled-squad", device=device)

    while True:
        # Get paragraph
        while True:
            print("\nEnter a paragraph (10+ words, under 1000 characters) or type 'exit' to quit:")
            paragraph = input().strip()
            if paragraph.lower() == 'exit':
                print("Exiting.")
                sys.exit(0)
            if valid_paragraph(paragraph):
                break
            print("Invalid input. Please enter at least 10 words and under 1000 characters.")

        # Summarize
        try:
            summary = summarizer(paragraph, max_length=100, min_length=50, do_sample=False)[0]['summary_text']
            summary = clean_text(summary)
            print(f"\nSummary (50-100 words):\n{summary}")
        except Exception as e:
            print(f"[Error] Summarization failed: {e}")
            continue

        # Q&A loop
        while True:
            print("\nAsk a question about the paragraph (or type 'new' for a new paragraph, 'exit' to quit):")
            question = input().strip()
            if question.lower() == 'exit':
                print("Exiting.")
                sys.exit(0)
            if question.lower() == 'new':
                break
            if not valid_question(question):
                print("Please enter a valid question (at least 2 words).")
                continue
            try:
                answer = qa(question=question, context=paragraph)
                print(f"Answer: {answer['answer']} (score: {answer['score']:.2f})")
            except Exception as e:
                print(f"[Error] Question answering failed: {e}")

if __name__ == "__main__":
    main() 