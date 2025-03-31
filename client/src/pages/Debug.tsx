import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function Debug() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [healthStatus, setHealthStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [connectionResponse, setConnectionResponse] = useState<any>(null);
  const [healthResponse, setHealthResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const checkApi = async () => {
    try {
      addLog('Checking API status...');
      setApiStatus('loading');
      const response = await fetch('/api');
      const data = await response.json();
      setApiResponse(data);
      setApiStatus('success');
      addLog('API check succeeded: ' + JSON.stringify(data));
    } catch (error) {
      setApiStatus('error');
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(message);
      addLog('API check failed: ' + message);
    }
  };

  const checkConnection = async () => {
    try {
      addLog('Checking connection status...');
      setConnectionStatus('loading');
      const response = await fetch('/api/connection-test');
      const data = await response.json();
      setConnectionResponse(data);
      setConnectionStatus('success');
      addLog('Connection check succeeded: ' + JSON.stringify(data).substring(0, 100) + '...');
    } catch (error) {
      setConnectionStatus('error');
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(message);
      addLog('Connection check failed: ' + message);
    }
  };

  const checkHealth = async () => {
    try {
      addLog('Checking health status...');
      setHealthStatus('loading');
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthResponse(data);
      setHealthStatus('success');
      addLog('Health check succeeded: ' + JSON.stringify(data));
    } catch (error) {
      setHealthStatus('error');
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(message);
      addLog('Health check failed: ' + message);
    }
  };

  const runAllChecks = () => {
    checkApi();
    checkConnection();
    checkHealth();
  };

  useEffect(() => {
    runAllChecks();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">صفحة تصحيح الأخطاء</h1>
        
        {(apiStatus === 'error' || connectionStatus === 'error' || healthStatus === 'error') && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage || 'حدث خطأ أثناء الاتصال بالخادم'}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">حالة API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full mr-2 ${apiStatus === 'success' ? 'bg-green-500' : apiStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span>{apiStatus === 'success' ? 'متصل' : apiStatus === 'loading' ? 'جارٍ التحميل...' : 'فشل الاتصال'}</span>
                </div>
                <Button variant="outline" size="sm" onClick={checkApi}>إعادة الاختبار</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فحص الاتصال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full mr-2 ${connectionStatus === 'success' ? 'bg-green-500' : connectionStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span>{connectionStatus === 'success' ? 'متصل' : connectionStatus === 'loading' ? 'جارٍ التحميل...' : 'فشل الاتصال'}</span>
                </div>
                <Button variant="outline" size="sm" onClick={checkConnection}>إعادة الاختبار</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فحص الصحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full mr-2 ${healthStatus === 'success' ? 'bg-green-500' : healthStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span>{healthStatus === 'success' ? 'متصل' : healthStatus === 'loading' ? 'جارٍ التحميل...' : 'فشل الاتصال'}</span>
                </div>
                <Button variant="outline" size="sm" onClick={checkHealth}>إعادة الاختبار</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button onClick={runAllChecks}>تشغيل جميع الاختبارات</Button>
        
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-bold">نتائج الاختبارات</h2>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="api">
              <AccordionTrigger>نتيجة اختبار API</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
                  {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'لا توجد بيانات'}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="connection">
              <AccordionTrigger>نتيجة اختبار الاتصال</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
                  {connectionResponse ? JSON.stringify(connectionResponse, null, 2) : 'لا توجد بيانات'}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="health">
              <AccordionTrigger>نتيجة اختبار الصحة</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
                  {healthResponse ? JSON.stringify(healthResponse, null, 2) : 'لا توجد بيانات'}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="logs">
              <AccordionTrigger>سجلات التصحيح</AccordionTrigger>
              <AccordionContent>
                <div className="bg-black text-green-400 p-4 rounded-md h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs">
                    {logs.join('\n')}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
}