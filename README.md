# Pickabook Magic Mirror 

A full-stack prototype that transforms a child's photo into a magical storybook illustration. Built for the Pickabook engineering assignment.
*(Note: Please view the `frontend` folder for screenshots if the link above is broken)*

## The Goal
The assignment was to build an end-to-end "Magic Mirror" where a user uploads a photo, and the system personalizes an illustration using Generative AI.

##  Tech Stack
* **Frontend:** Next.js 14 (App Router), Tailwind CSS (Glassmorphism UI).
* **Backend:** Python FastAPI.
* **AI Engine:** Hugging Face Inference API (Stable Diffusion XL).

##  Engineering Decisions & Trade-offs
**1. The Pivot: InstantID vs. Text-to-Image**
My original architecture used **InstantID** (via Replicate) to perform a perfect face-swap while preserving identity.
* *The Blocker:* During implementation, I hit a credit limit on Replicate and API restrictions on the Hugging Face free tier for `image-to-image` tasks.
* *The Solution:* To ensure a working submission without incurring costs, I implemented a robust fallback to **Text-to-Image**. The system still handles the full user flow (upload -> processing -> result), but generates a fresh character illustration based on the prompt.
* *Production View:* In a real production environment, switching back to InstantID would be a single line of code change in `backend/main.py`.

**2. Frontend Architecture**
I prioritized a clean, "Magical" UI using a glassmorphism aesthetic. I used standard CSS for the core layout to ensure stability across different environments, rather than relying solely on heavy UI libraries.

**3. Direct File Handling**
For this MVP, images are processed in-memory. In V2, I would implement **S3 Presigned URLs** to handle uploads directly from the client to object storage, reducing load on the FastAPI server.

## How to Run Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt

# Create a .env file with your Hugging Face Token:
# HF_TOKEN=hf_xxxx
python main.py
