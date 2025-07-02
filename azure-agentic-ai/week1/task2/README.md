# Interactive Story Generator (Haunted Castle)

## Overview
This project is a turn-based interactive text adventure game set in a haunted castle. The story adapts dynamically based on the sentiment of the user's input, using Hugging Face Transformers for both sentiment analysis and story generation.

## Features
- 3-turn interactive story game
- Real-time sentiment analysis of user input (positive, negative, neutral)
- Dynamic story continuation based on detected tone
- Haunted castle theme
- Input validation (minimum 2 words per turn)
- Graceful error handling and turn management
- Story state tracking and display
- Fallback responses for generation failures

## Requirements
- Python 3.8+
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [Torch](https://pytorch.org/)
- [tqdm](https://tqdm.github.io/)

## Setup
1. Place all files in the `task2/` directory.
2. Install dependencies:
   ```bash
   pip install transformers torch tqdm
   ```
3. Run the main application:
   ```bash
   python main.py
   ```

## Usage
- The game will prompt you for input each turn.
- Your input's sentiment will influence the story's tone (happy, fearful, calm).
- At the end of 3 turns, the complete story will be displayed.

## Notes
- Requires internet connection for model downloads on first run.
- Sentiment analysis and text generation are powered by Hugging Face models. 