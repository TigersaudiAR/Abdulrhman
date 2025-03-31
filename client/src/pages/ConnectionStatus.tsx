import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, ArrowLeft, CheckCircle, Globe, RefreshCcw, Server, Terminal } from 'lucide-react';

type ConnectionStatus = {
  api: 'loading' | 'success' | 'error';
  connectionTest: 'loading' | 'success' | 'error';
  serverInfo?: {
    nodeVersion: string;
    environment: string;
    port?: string;
  };
  health: 'loading' | 'success' | 'error';
  timestamp?: string;
  errorMessage?: string;
};

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    api: 'loading',
    connectionTest: 'loading',
    health: 'loading'
  });
  const [serverLogs, setServerLogs] = useState<string[]>([]);
  const [, navigate] = useLocation();

  const checkApiStatus = async () => {
    setStatus(prev => ({ ...prev, api: 'loading' }));
    try {
      const response = await fetch('/api');
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ ...prev, api: 'success' }));
        addLog(`API status check: OK - ${JSON.stringify(data)}`);
      } else {
        setStatus(prev => ({ 
          ...prev, 
          api: 'error', 
          errorMessage: `Failed to connect to API. Status: ${response.status} ${response.statusText}` 
        }));
        addLog(`API status check: Error - ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        api: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error connecting to API'
      }));
      addLog(`API status check: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkConnectionTest = async () => {
    setStatus(prev => ({ ...prev, connectionTest: 'loading' }));
    try {
      const response = await fetch('/api/connection-test');
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ 
          ...prev, 
          connectionTest: 'success',
          serverInfo: data.serverInfo,
          timestamp: data.timestamp
        }));
        addLog(`Connection test: OK - ${JSON.stringify(data)}`);
      } else {
        setStatus(prev => ({ 
          ...prev, 
          connectionTest: 'error', 
          errorMessage: `Failed connection test. Status: ${response.status} ${response.statusText}` 
        }));
        addLog(`Connection test: Error - ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        connectionTest: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error in connection test'
      }));
      addLog(`Connection test: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkHealthStatus = async () => {
    setStatus(prev => ({ ...prev, health: 'loading' }));
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ 
          ...prev, 
          health: 'success',
          timestamp: data.timestamp 
        }));
        addLog(`Health check: OK - ${JSON.stringify(data)}`);
      } else {
        setStatus(prev => ({ 
          ...prev, 
          health: 'error', 
          errorMessage: `Failed health check. Status: ${response.status} ${response.statusText}` 
        }));
        addLog(`Health check: Error - ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        health: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error in health check'
      }));
      addLog(`Health check: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addLog = (log: string) => {
    setServerLogs(prev => [...prev, `[${new Date().toISOString()}] ${log}`]);
  };

  const runAllChecks = () => {
    addLog('Running all connection checks...');
    checkApiStatus();
    checkConnectionTest();
    checkHealthStatus();
  };

  useEffect(() => {
    runAllChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStatusBadge = (status: 'loading' | 'success' | 'error') => {
    if (status === 'loading') {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">جارٍ التحميل...</span>;
    } else if (status === 'success') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">متصل</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">فشل الاتصال</span>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/server-status')}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة إلى حالة الخادم
          </Button>
          <h1 className="text-2xl font-bold font-heading-arabic">فحص حالة الاتصال بالخادم</h1>
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">حالة الاتصال</TabsTrigger>
            <TabsTrigger value="server-info">معلومات الخادم</TabsTrigger>
            <TabsTrigger value="logs">سجلات الفحص</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>نتائج الفحص</span>
                  <Button variant="outline" size="sm" onClick={runAllChecks}>
                    <RefreshCcw className="ml-2 h-4 w-4" />
                    إعادة الفحص
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <Globe className="ml-2 h-5 w-5" />
                          API الرئيسية
                        </span>
                        {renderStatusBadge(status.api)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">التحقق من نقطة نهاية API الرئيسية</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <Server className="ml-2 h-5 w-5" />
                          فحص الاتصال
                        </span>
                        {renderStatusBadge(status.connectionTest)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">التحقق من اتصال الخادم وتفاصيله</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <CheckCircle className="ml-2 h-5 w-5" />
                          فحص الصحة
                        </span>
                        {renderStatusBadge(status.health)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">التحقق من حالة تشغيل الخادم</p>
                    </CardContent>
                  </Card>
                </div>
                
                {(status.api === 'error' || status.connectionTest === 'error' || status.health === 'error') && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>خطأ في الاتصال</AlertTitle>
                    <AlertDescription>{status.errorMessage || 'هناك مشكلة في الاتصال بالخادم'}</AlertDescription>
                  </Alert>
                )}
                
                {status.api === 'success' && status.connectionTest === 'success' && status.health === 'success' && (
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">جميع الفحوصات ناجحة</AlertTitle>
                    <AlertDescription className="text-green-700">
                      تم الاتصال بالخادم بنجاح. يمكنك الآن استخدام التطبيق.
                      {status.timestamp && (
                        <div className="mt-2 text-xs">
                          آخر تحديث: {new Date(status.timestamp).toLocaleString('ar-SA')}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {status.api === 'success' && status.connectionTest === 'success' && status.health === 'success' ? (
                    <p>كل شيء يعمل بشكل صحيح. يمكنك الآن الاستفادة من جميع ميزات التطبيق.</p>
                  ) : (
                    <p>يرجى إصلاح مشاكل الاتصال قبل استخدام التطبيق.</p>
                  )}
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex justify-center space-x-2">
              <Button 
                variant="default" 
                onClick={() => navigate('/quran')}
                disabled={status.api !== 'success' || status.connectionTest !== 'success' || status.health !== 'success'}
              >
                بدء قراءة القرآن الكريم
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                الرجوع للصفحة الرئيسية
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="server-info">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الخادم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {status.serverInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="font-bold mb-2 flex items-center">
                        <Server className="ml-2 h-5 w-5" />
                        بيئة التشغيل
                      </h3>
                      <p>{status.serverInfo.environment}</p>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="font-bold mb-2 flex items-center">
                        <Terminal className="ml-2 h-5 w-5" />
                        إصدار Node.js
                      </h3>
                      <p>{status.serverInfo.nodeVersion}</p>
                    </div>
                    
                    {status.serverInfo.port && (
                      <div className="border p-4 rounded-md md:col-span-2">
                        <h3 className="font-bold mb-2">منفذ الخادم</h3>
                        <p>{status.serverInfo.port}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>لم يتم العثور على معلومات الخادم. يرجى تشغيل فحص الاتصال أولاً.</p>
                    <Button className="mt-4" variant="outline" onClick={checkConnectionTest}>
                      <RefreshCcw className="ml-2 h-4 w-4" />
                      تشغيل فحص الاتصال
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>سجلات الفحص</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setServerLogs([])}>
                  مسح السجلات
                </Button>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="logs">
                    <AccordionTrigger>سجلات فحص الاتصال ({serverLogs.length})</AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-black text-green-400 p-4 rounded-md h-80 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-xs">
                          {serverLogs.length > 0 ? serverLogs.join('\n') : 'لا توجد سجلات حتى الآن.'}
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">سجلات الفحص تساعد في تشخيص مشاكل الاتصال.</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}