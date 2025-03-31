
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
import json
import os

app = FastAPI()

# تحميل التفسير (مثال: السعدي)
with open("tafsir_json/sa3dy.json", "r", encoding="utf-8") as f:
    tafsir_data = json.load(f)

# تحميل الترجمة (مثال: hamidullah الفرنسية)
with open("translations_json/fr_hamidullah.json", "r", encoding="utf-8") as f:
    translation_data = json.load(f)

@app.get("/tafsir/{sura}/{ayah}")
def get_tafsir(sura: int, ayah: int):
    try:
        return {"sura": sura, "ayah": ayah, "text": tafsir_data[str(sura)][str(ayah)]}
    except:
        raise HTTPException(status_code=404, detail="Tafsir not found")

@app.get("/translation/{sura}/{ayah}")
def get_translation(sura: int, ayah: int):
    try:
        return {"sura": sura, "ayah": ayah, "text": translation_data[str(sura)][str(ayah)]}
    except:
        raise HTTPException(status_code=404, detail="Translation not found")

@app.get("/image/{type}/{filename}")
def get_image(type: str, filename: str):
    image_path = f"images_all/{type}_{filename}"
    if os.path.exists(image_path):
        return FileResponse(image_path)
    raise HTTPException(status_code=404, detail="Image not found")
