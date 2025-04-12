#!/bin/bash

# تأكد من عدم تشغيل خادم FastAPI حاليًا
pkill -f "uvicorn quran_api_main:app" || true

# قم بتثبيت المتطلبات أولا
pip install -q fastapi uvicorn python-multipart

# قم بإنشاء ملف السجل إذا لم يكن موجودًا
mkdir -p logs
touch logs/quran_api.log

echo "Starting Quran API FastAPI server on port 8000..."

# قم بتشغيل خادم FastAPI في الخلفية
cd quran_api
nohup uvicorn quran_api_main:app --host 0.0.0.0 --port 8000 > ../logs/quran_api.log 2>&1 &

# احصل على رقم العملية
QURAN_API_PID=$!
echo "Quran API FastAPI server started with PID: $QURAN_API_PID"
echo $QURAN_API_PID > ../quran_api.pid

# انتظر للتأكد من بدء التشغيل
sleep 2
echo "Checking if Quran API is running..."

# التحقق من الاتصال
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ || echo "Failed")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "404" ]; then
    echo "✅ Quran API server is running successfully on port 8000"
else
    echo "❌ Quran API server failed to start properly. HTTP response: $RESPONSE"
    echo "Check the logs at logs/quran_api.log for details"
    cat ../logs/quran_api.log
fi

echo "You can now access the Quran API at http://localhost:8000"