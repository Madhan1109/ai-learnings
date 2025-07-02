# Q&A Summarizer

## Overview
This project is an interactive console tool that allows users to input a paragraph, receive a concise summary, and ask multiple questions about the content. It uses Hugging Face Transformers for both summarization and question answering.

## Features
- Accepts paragraphs (10+ words, under 1000 characters)
- Generates concise summaries (50-100 words)
- Allows multiple questions about the same paragraph
- Interactive input/output loop
- Input validation and error handling
- Clean exit functionality

## Requirements
- Python 3.8+
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [Torch](https://pytorch.org/)

## Setup
1. Place all files in the `task3/` directory.
2. Install dependencies:
   ```bash
   pip install transformers torch
   ```
3. Run the main application:
   ```bash
   python main.py
   ```

## Usage
- Enter a paragraph (10+ words, under 1000 characters) when prompted.
- The tool will generate a summary (50-100 words).
- You can then ask multiple questions about the paragraph.
- Type `exit` at any prompt to quit.

## Notes
- Requires internet connection for model downloads on first run.
- Summarization and question answering are powered by Hugging Face models. 