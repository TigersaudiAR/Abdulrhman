#!/bin/bash

echo "=== بدء إصلاح مشاكل المنفذ ==="

# تحديد المنفذ المستهدف
PORT=5000

echo "1. محاولة إيقاف العمليات على المنفذ $PORT..."
# محاولة إيقاف جميع العمليات التي تستخدم المنفذ
npx kill-port $PORT || echo "فشل في استخدام kill-port"

# محاولة باستخدام ps وgrep و pkill
echo "2. البحث عن العمليات التي تستخدم Node.js..."
ps aux | grep node | grep -v grep
ps aux | grep tsx | grep -v grep

echo "3. إيقاف جميع عمليات Node..."
pkill -f "node" || echo "لا توجد عمليات node لإيقافها"
pkill -f "tsx" || echo "لا توجد عمليات tsx لإيقافها"
pkill -f "npm run dev" || echo "لا توجد عمليات npm run dev لإيقافها"

echo "4. التحقق من أي عمليات متبقية على المنفذ $PORT..."
netstat -tulpn 2>/dev/null | grep -w $PORT || echo "المنفذ $PORT متاح الآن"

# انتظر قليلاً
echo "5. انتظار 5 ثوانٍ للتأكد من إغلاق جميع العمليات..."
sleep 5

echo "6. بدء تشغيل الخادم..."
NODE_ENV=development npm run dev &

echo "7. انتظار 5 ثوانٍ للتأكد من بدء الخادم..."
sleep 5

echo "8. التحقق من حالة الخادم..."
curl -s http://localhost:$PORT/api/health || echo "الخادم لا يستجيب على المنفذ $PORT"

echo "=== انتهى إصلاح مشاكل المنفذ ==="