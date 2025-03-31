
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import os
import glob

app = FastAPI(
    title="Quran API",
    description="API for Quran, Tafsir, and Translations",
    version="1.0.0"
)

# إضافة CORS لسماح الوصول من الواجهة الأمامية
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5000", "http://localhost:3000", "http://localhost:8000", "http://0.0.0.0:5000"],  # يسمح بالوصول من المصادر المحددة
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تحميل جميع ملفات التفسير
tafsir_data = {}
script_dir = os.path.dirname(os.path.abspath(__file__))
tafsir_files = glob.glob(os.path.join(script_dir, "tafsir_json/*.json"))
for file_path in tafsir_files:
    file_name = os.path.basename(file_path).split('.')[0]
    with open(file_path, "r", encoding="utf-8") as f:
        tafsir_data[file_name] = json.load(f)

# تحميل جميع ملفات الترجمة
translation_data = {}
translation_files = glob.glob(os.path.join(script_dir, "translations_json/*.json"))
for file_path in translation_files:
    file_name = os.path.basename(file_path).split('.')[0]
    with open(file_path, "r", encoding="utf-8") as f:
        translation_data[file_name] = json.load(f)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Quran API",
        "available_tafsirs": list(tafsir_data.keys()),
        "available_translations": list(translation_data.keys())
    }

@app.get("/tafsir/{tafsir_id}/{sura}/{ayah}")
def get_tafsir(tafsir_id: str, sura: int, ayah: int):
    if tafsir_id not in tafsir_data:
        available_tafsirs = list(tafsir_data.keys())
        raise HTTPException(status_code=404, detail=f"Tafsir ID not found. Available tafsirs: {available_tafsirs}")
    
    try:
        return {
            "sura": sura,
            "ayah": ayah,
            "tafsir_id": tafsir_id,
            "text": tafsir_data[tafsir_id][str(sura)][str(ayah)]
        }
    except:
        raise HTTPException(status_code=404, detail=f"Tafsir not found for sura {sura}, ayah {ayah}")

@app.get("/translation/{translation_id}/{sura}/{ayah}")
def get_translation(translation_id: str, sura: int, ayah: int):
    if translation_id not in translation_data:
        available_translations = list(translation_data.keys())
        raise HTTPException(status_code=404, detail=f"Translation ID not found. Available translations: {available_translations}")
    
    try:
        return {
            "sura": sura,
            "ayah": ayah,
            "translation_id": translation_id,
            "text": translation_data[translation_id][str(sura)][str(ayah)]
        }
    except:
        raise HTTPException(status_code=404, detail=f"Translation not found for sura {sura}, ayah {ayah}")

@app.get("/image/{type}/{filename}")
def get_image(type: str, filename: str):
    # مسار الصورة في مجلد images_all
    image_path = os.path.join(script_dir, f"images_all/{type}/{filename}")
    
    if os.path.exists(image_path):
        return FileResponse(image_path)
    
    raise HTTPException(status_code=404, detail=f"Image not found: {type}/{filename}")

@app.get("/page/{page_number}")
def get_quran_page(page_number: int):
    """
    الحصول على صفحة من المصحف الشريف
    """
    image_path = os.path.join(script_dir, f"images_all/page/page_{page_number}.png")
    
    if os.path.exists(image_path):
        return FileResponse(image_path)
    
    raise HTTPException(status_code=404, detail=f"Page {page_number} not found")

@app.get("/available")
def get_available_resources():
    """
    الحصول على قائمة بجميع الموارد المتاحة
    """
    return {
        "tafsirs": list(tafsir_data.keys()),
        "translations": list(translation_data.keys()),
        "pages": len(glob.glob(os.path.join(script_dir, "images_all/page/page_*.png")))
    }

@app.get("/index.html", response_class=HTMLResponse)
def get_index():
    """
    صفحة البداية للتطبيق
    """
    with open(os.path.join(script_dir, "index.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/index_mobile.html", response_class=HTMLResponse)
def get_mobile_index():
    """
    صفحة البداية للتطبيق (النسخة المحمولة)
    """
    with open(os.path.join(script_dir, "index_mobile.html"), "r", encoding="utf-8") as f:
        return f.read()

# تكوين الوصول للملفات الثابتة (الصور والملفات الأخرى)
app.mount("/static", StaticFiles(directory=os.path.join(script_dir, "images_all")), name="static")
