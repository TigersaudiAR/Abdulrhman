
#!/bin/bash

echo "بدء عملية تنظيف المشروع..."

# إيقاف العمليات الجارية
echo "إيقاف أي عمليات جارية على المنافذ المستخدمة..."
RUNNING_PROCS=$(lsof -i :5000 -t)
if [ ! -z "$RUNNING_PROCS" ]; then
  echo "إيقاف العمليات على المنفذ 5000..."
  kill -9 $RUNNING_PROCS
  sleep 1
fi

# العثور على الملفات المكررة في مجلد extracted
echo "البحث عن الملفات المكررة..."
find ./extracted -type f -name "*.php" -o -name "*.js" | sort > all_files.txt
cat all_files.txt | xargs md5sum | sort | uniq -w32 -d > duplicate_list.txt

if [ -s duplicate_list.txt ]; then
  echo "تم العثور على ملفات مكررة:"
  cat duplicate_list.txt
  
  # حفظ قائمة الملفات المكررة
  echo "حفظ قائمة الملفات المكررة في duplicate_files.txt"
  cat duplicate_list.txt > duplicate_files.txt
fi

# إزالة ملفات الخادم غير المستخدمة
echo "إزالة ملفات الخادم المكررة أو غير المستخدمة..."
UNUSED_SERVER_FILES=(
  "micro-server.js"
  "http-server.js"
  "direct-server.js"
  "server-direct.js"
  "replit-server.js"
  "simple-server.js"
  "basic-server.mjs"
  "start-server.js"
)

for file in "${UNUSED_SERVER_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "إزالة $file..."
    mv "$file" "_backup_$file"
  fi
done

# إزالة مجلدات الملفات المكررة
if [ -d "quran_api_extracted" ]; then
  echo "إزالة مجلد quran_api_extracted المكرر..."
  mv quran_api_extracted _backup_quran_api_extracted
fi

# تنظيف المخرجات المؤقتة
rm -f all_files.txt
echo "اكتمال عملية التنظيف."
