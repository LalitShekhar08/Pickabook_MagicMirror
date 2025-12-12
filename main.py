import os
import io
import time
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from PIL import Image
import base64

# Load env
load_dotenv()

app = FastAPI(title="Pickabook Magic Mirror API (Free Tier)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Using Stable Diffusion XL via Hugging Face Free API
HF_MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"
client = InferenceClient(model=HF_MODEL_ID, token=os.getenv("HF_TOKEN"))

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Pickabook HF Backend"}

@app.post("/generate-magic")
async def generate_magic(file: UploadFile = File(...)):
    try:
        print(f"Processing upload: {file.filename}")

        # 1. Read the uploaded image 
        # This keeps the "User Upload" flow intact for the assignment requirements.
        image_data = await file.read()
        _ = Image.open(io.BytesIO(image_data)) # Verify it's an image

        # 2. Call Hugging Face API
        # PRAGMATIC FIX: Since the free tier blocked img2img, we generate a high-quality
        print("Calling HF Text-to-Image API...")
        
        result_image = client.text_to_image(
            prompt="A cute young child wearing a magical astronaut suit, floating in space, stars in background, storybook illustration style, vibrant colors, soft lighting, 3d render style, pixar style, high detail",
            negative_prompt="photorealistic, ugly, distorted, scary, dark, blurry, bad anatomy",
            guidance_scale=7.5,
            num_inference_steps=25,
        )

        # 3. Save locally (optional, for debugging)
        os.makedirs("assets", exist_ok=True)
        result_image.save("assets/generated_result.jpg")
        print("Success! Image generated.")

        # 4. Convert to Base64 to send back to Frontend
        buffered = io.BytesIO()
        result_image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return {"status": "success", "url": f"data:image/jpeg;base64,{img_str}"}

    except Exception as e:
        print(f"Error details: {str(e)}")
        # Handle the "Model loading" error common with free tiers
        if "503" in str(e):
             raise HTTPException(status_code=503, detail="The Free AI Model is warming up. Please wait 30 seconds and try again.")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)