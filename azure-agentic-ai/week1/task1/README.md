# Image Search System using Hugging Face Transformers

## Overview
This project is a console-based intelligent image search system that:
- Generates detailed descriptions for images using Visual Question Answering (VQA)
- Allows users to search for images using natural language queries
- Uses sentence transformers for semantic similarity matching
- Supports multiple image formats (jpg, jpeg, png, bmp, gif, tiff, webp)
- Ranks and displays search results with similarity scores

## Features
- Processes all images in the `assets/` folder
- Stores image descriptions and file paths
- Interactive console search interface
- Configurable cosine similarity threshold
- Error handling for image processing failures

## Requirements
- Python 3.8+
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [Sentence Transformers](https://www.sbert.net/)
- [Torch](https://pytorch.org/)
- [Pillow](https://python-pillow.org/)
- [tqdm](https://tqdm.github.io/)

## Setup
1. Clone this repository or copy the project files.
2. Install dependencies:
   ```bash
   pip install transformers sentence-transformers torch pillow tqdm
   ```
3. Place your images in the `assets/` folder.
4. Run the main application:
   ```bash
   python main.py
   ```

## Project Structure
```
Azure Agentic AI/
│
├── assets/                # Folder containing images to be processed
├── main.py                # Main application script
├── README.md              # Project documentation
└── ...                    # Other supporting files
```

## Usage
- The application will process all images in the `assets/` folder, generate descriptions, and allow you to search using natural language queries.
- Results will be ranked by semantic similarity and displayed with scores and file paths.

## Notes
- Make sure you have a stable internet connection for downloading models the first time you run the application.
- You can adjust the similarity threshold in the application settings. 