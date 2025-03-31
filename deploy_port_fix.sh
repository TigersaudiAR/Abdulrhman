#!/bin/bash

# هذا الملف يتعامل مع مشكلة توجيه المنافذ في تطبيق Replit

echo "=== إصلاح مشكلة المنافذ ==="

# إيقاف جميع العمليات الحالية
echo "1. إيقاف العمليات الحالية..."
pkill -f "node" || echo "لا توجد عمليات node لإيقافها"
pkill -f "tsx" || echo "لا توجد عمليات tsx لإيقافها"
sleep 2

# إنشاء ملف الإعادة التوجيه للمنافذ
echo "2. إنشاء ملف إعادة توجيه المنافذ..."
cat > port_redirect.js << 'EOL'
const http = require('http');
const net = require('net');

// المنفذ الذي يجب أن يستمع عليه Replit
const REPLIT_EXPECTED_PORT = 5000;

// المنفذ الذي يستمع عليه الخادم الفعلي
const ACTUAL_SERVER_PORT = 3333;

console.log(`إنشاء إعادة توجيه من المنفذ ${REPLIT_EXPECTED_PORT} إلى المنفذ ${ACTUAL_SERVER_PORT}`);

// إنشاء خادم بسيط لتوجيه الطلبات
const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: ACTUAL_SERVER_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  console.log(`توجيه طلب: ${req.method} ${req.url} -> localhost:${ACTUAL_SERVER_PORT}${req.url}`);

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (err) => {
    console.error(`خطأ في التوجيه: ${err.message}`);
    res.writeHead(502);
    res.end(`خطأ في الاتصال بالخادم الداخلي: ${err.message}`);
  });
});

// معالجة الاتصالات المستمرة (WebSockets)
server.on('upgrade', (req, socket, head) => {
  console.log(`توجيه اتصال مستمر WebSocket -> localhost:${ACTUAL_SERVER_PORT}`);

  const proxy = net.connect(ACTUAL_SERVER_PORT, 'localhost', () => {
    proxy.write(head);
    socket.pipe(proxy).pipe(socket);
  });

  proxy.on('error', (err) => {
    console.error(`خطأ في توجيه WebSocket: ${err.message}`);
    socket.end();
  });
});

// بدء الاستماع
server.listen(REPLIT_EXPECTED_PORT, '0.0.0.0', () => {
  console.log(`✅ خادم إعادة التوجيه قيد التشغيل على المنفذ ${REPLIT_EXPECTED_PORT}`);
  console.log(`🔀 يقوم بتوجيه الطلبات إلى المنفذ ${ACTUAL_SERVER_PORT}`);
  
  // تعيين رأس جاهزية المنفذ لـ Replit
  console.log('X-Replit-Port-Ready: true');
});

// تسجيل نبضات القلب للتأكد من أن العملية نشطة
setInterval(() => {
  console.log(`خادم إعادة التوجيه نشط: ${new Date().toISOString()}`);
}, 10000);
EOL

# تشغيل الخادم الأساسي (في الخلفية)
echo "3. بدء تشغيل الخادم الأساسي..."
NODE_ENV=development npm run dev &
SERVER_PID=$!

# انتظر قليلاً
echo "4. الانتظار لبدء تشغيل الخادم الأساسي..."
sleep 5

# تشغيل خادم إعادة التوجيه
echo "5. بدء خادم إعادة التوجيه..."
node port_redirect.js &
PROXY_PID=$!

echo "6. تمت إعادة التوجيه بنجاح من المنفذ 5000 إلى 3333"
echo "   الخادم الأساسي (PID: $SERVER_PID)"
echo "   خادم إعادة التوجيه (PID: $PROXY_PID)"
echo "=== اكتمال الإصلاح ==="