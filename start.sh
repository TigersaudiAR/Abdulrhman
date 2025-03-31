
#!/bin/bash

# سكريبت لبدء تشغيل التطبيق
echo "بدء تشغيل تطبيق القرآن الكريم..."

# التحقق من عمليات تشغيل سابقة وإيقافها
echo "التحقق من العمليات الجارية..."
RUNNING_PROCS=$(lsof -i :5000 -t)
if [ ! -z "$RUNNING_PROCS" ]; then
  echo "إيقاف العمليات الجارية على المنفذ 5000..."
  kill -9 $RUNNING_PROCS
  # انتظار لحظة للتأكد من إغلاق المنفذ
  sleep 2
fi

# تأكد من إغلاق المنفذ قبل المتابعة
if lsof -i :5000 -t; then
  echo "لا يزال المنفذ 5000 مستخدمًا. محاولة إغلاق مرة أخرى..."
  kill -9 $(lsof -i :5000 -t)
  sleep 3
fi

# تثبيت أو تحديث الحزم إذا لزم الأمر
if [ ! -d "node_modules" ]; then
  echo "تثبيت حزم Node.js..."
  npm install
fi

# تشغيل التطبيق
echo "بدء تشغيل الخادم..."
NODE_ENV=development npm run dev
