#!/bin/bash

# قم بتثبيت المتطلبات أولا
pip install fastapi uvicorn python-multipart

# قم بتشغيل خادم FastAPI 
cd quran_api
uvicorn quran_api_main:app --host 0.0.0.0 --port 8000 --reload