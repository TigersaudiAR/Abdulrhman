#!/bin/bash

# إيقاف أي عمليات سابقة
echo "1. إيقاف العمليات الحالية..."
pkill -f "node" || echo "لا توجد عمليات node لإيقافها"
pkill -f "tsx" || echo "لا توجد عمليات tsx لإيقافها"
sleep 2

# تشغيل الخادم على المنفذ 5000 مباشرة
echo "2. بدء تشغيل الخادم على المنفذ 5000..."
NODE_ENV=development npm run dev

echo "3. تم تشغيل الخادم بنجاح على المنفذ 5000"