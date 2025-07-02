import torch
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer, AutoModelForCausalLM, AutoModelForSeq2SeqLM
import sys
import re

def clean_text(text):
    # Remove unwanted tokens and clean up text
    text = re.sub(r'\s+', ' ', text)
    text = text.replace(' .', '.').replace(' ,', ',')
    return text.strip()

# Sentiment label to story tone mapping
SENTIMENT_TO_TONE = {
    'positive': 'happy',
    'negative': 'fearful',
    'neutral': 'calm'
}

# Fallback responses for generation failures
FALLBACKS = {
    'happy': "The castle seems a bit less scary as you move forward.",
    'fearful': "A chill runs down your spine. The darkness grows deeper.",
    'calm': "You steady your breath and continue through the silent halls."
}

# Initial story prompt
INITIAL_PROMPT = (
    "You stand before the gates of a haunted castle on a stormy night. "
    "Lightning flashes, illuminating the ancient stones. What do you do?"
)

# Story state
class StoryState:
    def __init__(self):
        self.turns = []
        self.story = [INITIAL_PROMPT]
        self.tones = []
        self.sentiments = []
        self.confidences = []

    def add_turn(self, user_input, sentiment, confidence, tone, story_cont):
        self.turns.append(user_input)
        self.sentiments.append(sentiment)
        self.confidences.append(confidence)
        self.tones.append(tone)
        self.story.append(story_cont)

    def display(self):
        print("\n--- Story So Far ---")
        for part in self.story:
            print(clean_text(part))
        print("--------------------\n")

    def display_final(self):
        print("\n=== Complete Haunted Castle Story ===")
        for part in self.story:
            print(clean_text(part))
        print("===============================\n")

# Input validation
def valid_input(text):
    return len(text.strip().split()) >= 2

def main():
    print("\n--- Interactive Story Generator: Haunted Castle ---\n")
    device = 0 if torch.cuda.is_available() else -1

    # Load sentiment analysis pipeline
    print("Loading sentiment analysis model...")
    sentiment_pipe = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest", device=device)

    # Load text generation pipeline
    print("Loading story generation model...")
    gen_pipe = pipeline("text-generation", model="gpt2", device=device)

    state = StoryState()
    print(clean_text(INITIAL_PROMPT))

    for turn in range(3):
        while True:
            user_input = input(f"\nTurn {turn+1} - Your action: ").strip()
            if user_input.lower() == 'exit':
                print("Exiting game.")
                sys.exit(0)
            if valid_input(user_input):
                break
            print("Please enter at least 2 words.")

        # Sentiment analysis
        try:
            sentiment_result = sentiment_pipe(user_input)[0]
            label = sentiment_result['label'].lower()
            score = float(sentiment_result['score'])
            if label not in SENTIMENT_TO_TONE:
                label = 'neutral'
            tone = SENTIMENT_TO_TONE[label]
            print(f"Sentiment: {label} (confidence: {score:.2f}) → Story tone: {tone}")
        except Exception as e:
            print(f"[Error] Sentiment analysis failed: {e}")
            label = 'neutral'
            score = 0.0
            tone = SENTIMENT_TO_TONE[label]

        # Story continuation
        prompt = f"{state.story[-1]}\nYou: {user_input}\n({tone.capitalize()} tone) Storyteller:"
        try:
            gen = gen_pipe(prompt, max_new_tokens=60, do_sample=True, temperature=0.8, top_p=0.95)
            story_cont = gen[0]['generated_text'][len(prompt):]
            story_cont = clean_text(story_cont)
            if not story_cont:
                raise ValueError("Empty generation")
        except Exception as e:
            print(f"[Error] Story generation failed: {e}")
            story_cont = FALLBACKS[tone]

        state.add_turn(user_input, label, score, tone, story_cont)
        state.display()

    state.display_final()
    print("Sentiment analysis results:")
    for i, (sent, conf) in enumerate(zip(state.sentiments, state.confidences), 1):
        print(f"Turn {i}: {sent} (confidence: {conf:.2f})")
    print("\nThank you for playing!")

if __name__ == "__main__":
    main() 