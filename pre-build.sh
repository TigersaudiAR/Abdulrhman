
#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

echo "Starting pre-build preparation..."

# Create necessary directories
mkdir -p public/fonts
mkdir -p public/assets
mkdir -p public/images
mkdir -p dist

echo "Created directories structure"

# Copy font files to public directory if they exist in root
if [ -f "UthmanicHafs.woff" ]; then
  cp UthmanicHafs.woff public/fonts/
  echo "Copied UthmanicHafs.woff to public/fonts/"
fi

if [ -f "UthmanicHafs.woff2" ]; then
  cp UthmanicHafs.woff2 public/fonts/
  echo "Copied UthmanicHafs.woff2 to public/fonts/"
fi

# Create font CSS file if it doesn't exist
if [ ! -f "public/fonts/UthmanicHafs.css" ]; then
  cat > public/fonts/UthmanicHafs.css << 'EOL'
@font-face {
  font-family: 'UthmanicHafs';
  src: url('UthmanicHafs.woff2') format('woff2'),
       url('UthmanicHafs.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
EOL
  echo "Created UthmanicHafs.css"
fi

# Ensure client directory exists
if [ ! -d "client" ]; then
  echo "ERROR: client directory not found!"
  exit 1
fi

# إضافة صفحة الاختبار
cp deploy_solution.sh dist/
chmod +x dist/deploy_solution.sh
echo "تم نسخ ملف الحل للتوزيع"

# Verify client/src/main.tsx exists
if [ ! -f "client/src/main.tsx" ]; then
  echo "ERROR: client/src/main.tsx not found!"
  exit 1
fi

# إضافة صفحة الاختبار
cp deploy_solution.sh dist/
chmod +x dist/deploy_solution.sh
echo "تم نسخ ملف الحل للتوزيع"

# Verify client/index.html exists
if [ ! -f "client/index.html" ]; then
  echo "ERROR: client/index.html not found!"
  exit 1
fi

echo "Verified critical files exist"
echo "Pre-build preparation complete!"
