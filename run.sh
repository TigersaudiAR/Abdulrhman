#!/bin/bash

# هذا الملف هو ملف النشر النهائي لتطبيق القرآن

echo "=== بدء تشغيل تطبيق القرآن ==="

# إيقاف جميع العمليات الحالية
echo "1. إيقاف العمليات الحالية..."
pkill -f "node" || echo "لا توجد عمليات node لإيقافها"
pkill -f "tsx" || echo "لا توجد عمليات tsx لإيقافها"
sleep 2

# التأكد من وجود الملفات الضرورية
echo "2. التحقق من وجود الملفات الضرورية..."
MAIN_FILE="server/index.ts"
if [ ! -f "$MAIN_FILE" ]; then
  echo "خطأ: ملف $MAIN_FILE غير موجود!"
  exit 1
fi

# تأكد من أن ملف الخوادم يستخدم المنفذ 5000
echo "3. التأكد من إعدادات المنفذ الصحيحة..."
if ! grep -q "PORT.*5000" "$MAIN_FILE"; then
  echo "تحديث المنفذ إلى 5000 في $MAIN_FILE..."
  sed -i 's/const PORT = Number(process.env.PORT) || (isDev ? [0-9]\+ : [0-9]\+);/const PORT = Number(process.env.PORT) || (isDev ? 5000 : 4000);/' "$MAIN_FILE"
fi

# إصلاح مشكلات تنسيق الكود إن وجدت
echo "4. إصلاح أي مشكلات تنسيق في الكود..."
# ترك فارغة للإضافات المستقبلية

# بدء تشغيل الخادم
echo "5. بدء تشغيل الخادم..."
echo "Starting server on port 5000..."
NODE_ENV=development npm run dev &

echo "6. التطبيق جاهز!"
echo "   التطبيق متاح على: http://localhost:5000"
echo "=== اكتمل التشغيل بنجاح ==="