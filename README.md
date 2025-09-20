# Pathway Hackathon: Adaptive RAG Template

This repository provides a ready-to-use Adaptive Retrieval-Augmented G```bash
# Linux/Mac
curl --location 'http://localhost:8008/v2/answer' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": "What is the average package for cse in IIT Bombay?"
}'

# Windows CMD
curl --location "http://localhost:8008/v2/answer" --header "accept: */*" --header "Content-Type: application/json" --data "{\"prompt\": \"What is the average package for cse in IIT Bombay?\"}"

# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:8008/v2/answer" -Method POST -ContentType "application/json" -Body '{"prompt": "What is the average package for cse in IIT Bombay?"}'
```n (RAG) template using [Pathway](https://pathway.com/). It enables you to build, configure, and run a document-based question-answering system with support for both Gemini and OpenAI models.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Linux](#linux)
  - [Windows](#windows)
- [Environment Variables (`.env`)](#environment-variables-env)
- [YAML Configuration](#yaml-configuration)
- [Running the Application](#running-the-application)
- [Making Requests (cURL Example)](#making-requests-curl-example)
- [References](#references)

---

## Features

- **Document Ingestion:** Reads and indexes documents from the `data/` folder.
- **Flexible LLM Support:** Works with Gemini and OpenAI models.
- **Configurable via YAML:** Easily adjust data sources, models, embedders, and more.
- **REST API:** Exposes endpoints for question answering.
- **Caching:** Supports disk and memory caching for efficiency.

---

## Installation

**For detailed step-by-step instructions, refer to the "Day 1 GenAI Hackathon IIT Jodhpur.pdf.pdf" in this repository.**

### Linux

```bash
# 1. Clone the repository
git clone https://github.com/AISocietyIITJ/pathway_hackathon.git
cd pathway_hackathon

# 2. Create a virtual environment using uv (recommended for speed and reproducibility)
uv venv venv --python 3.10
source venv/bin/activate

# 3. Install all dependencies (including Pathway and extras)
uv pip install "pathway[all]"
```

### Windows

```powershell
# 1. Clone the repository
git clone https://github.com/AISocietyIITJ/pathway_hackathon.git
cd pathway_hackathon

# 2. Build the Docker image
docker build -t my-pathway-app .

# 3. Run the container (maps your current directory to /app in the container)
docker run -it --rm -v %cd%:/app -p 8008:8000 my-pathway-app
```

---

## Environment Variables (`.env`)

Create a `.env` file in the root directory with the following structure:

```env
# For Gemini (Google) API
GEMINI_API_KEY="your-gemini-api-key"

# For OpenAI API (if using OpenAI models)
OPENAI_API_KEY="your-openai-api-key"
```

- Get your Gemini API key from [Google Cloud Console](https://console.cloud.google.com/).
- Get your OpenAI API key from [OpenAI](https://platform.openai.com/account/api-keys).

---

## YAML Configuration

The application is configured using YAML files (`app.yaml` or `app_hydrid_retriever.yaml`). These files define:

- **Data Sources:** Where your documents are loaded from (e.g., local `data/` folder).
- **LLM Model:** Which language model to use (Gemini, OpenAI, etc.).
- **Embedder:** For text embeddings (GeminiEmbedder, OpenAIEmbedder).
- **Splitter & Parser:** How documents are chunked and parsed.
- **Retriever:** How documents are indexed and retrieved (BruteForce, Hybrid, etc.).
- **Server Settings:** Host, port, caching, and error handling.

**To modify the pipeline, edit the relevant YAML file.**  
For more details, see comments in `app.yaml` and [Pathway YAML documentation](https://pathway.com/developers/templates/configure-yaml).

---

## Running the Application

This project has two main components: the Pathway backend and the LearnPro UI frontend (which includes an integrated document management API).

### 1. Running the Backend (Pathway API)

The backend processes documents and answers questions. The recommended way to run it is with Docker.

**Prerequisites:**
- Docker Desktop installed and running.
- A configured `.env` file with your API keys.

**Run Command:**
```powershell
# Make sure you are in the root directory of the project
docker run -it --rm -v %cd%:/app -p 8008:8000 my-pathway-app
```
The API will be available at `http://localhost:8008`.

### 2. Running the Frontend (LearnPro UI)

The frontend is a React application with an integrated document management API that automatically starts together.

**Prerequisites:**
- Node.js (v18 or newer) and npm.

**Run Commands:**
```powershell
# 1. Navigate to the UI directory
cd ui

# 2. Install all dependencies (includes both frontend and backend dependencies)
npm install

# 3. Start both the document API server and the UI development server
npm run dev
```

This single command will start:
- Document Management API on `http://localhost:3001`
- React UI on `http://localhost:3000` (with API proxy)

The UI will automatically connect to both the Pathway API (port 8008) and the integrated document API (port 3001 via proxy).

---

## Making Requests (cURL Example)

To query the API, use the following cURL command:

```bash
curl --location 'http://localhost:8008/v2/answer' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": "What is the average package for cse in IIT Bombay?"
}'
```

- Add your query in `'prompt'` field
- The server will return a JSON response with the answer.

---

## References

- [Pathway Documentation](https://pathway.com/developers/)
- [YAML Configuration Guide](https://pathway.com/developers/templates/configure-yaml)
- [Day 1 GenAI Hackathon IIT Jodhpur.pdf.pdf](./Day%201%20GenAI%20Hackathon%20IIT%20Jodhpur.pdf.pdf) (for detailed setup)

---

**Happy Hacking!**

---
