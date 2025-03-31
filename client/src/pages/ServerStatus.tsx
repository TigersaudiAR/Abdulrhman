import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle, 
  Cpu, 
  Database, 
  Globe, 
  HardDrive, 
  Network, 
  RefreshCcw, 
  Server, 
  Terminal
} from 'lucide-react';

interface ServerInfo {
  nodeVersion: string;
  environment: string;
  port?: string;
  platform?: string;
  hostname?: string;
  arch?: string;
  memory?: {
    total: string;
    free: string;
    usage: string;
  };
  uptime?: string;
  cpu?: {
    model: string;
    speed: string;
  };
  network?: {
    interfaces: Record<string, Array<{
      address: string;
      family: string;
      netmask: string;
    }>>;
  };
}

interface StatusData {
  status: 'loading' | 'connected' | 'error';
  timestamp?: string;
  serverInfo?: ServerInfo;
  errorMessage?: string;
}

export default function ServerStatus() {
  const [statusData, setStatusData] = useState<StatusData>({
    status: 'loading'
  });
  const [, navigate] = useLocation();

  const checkServerStatus = async () => {
    setStatusData({
      status: 'loading'
    });
    
    try {
      // محاولة الاتصال بنقطة نهاية الاتصال المُحسّنة
      const response = await fetch('/api/connection-test');
      
      if (response.ok) {
        const data = await response.json();
        setStatusData({
          status: 'connected',
          timestamp: data.timestamp,
          serverInfo: data.serverInfo
        });
      } else {
        setStatusData({
          status: 'error',
          errorMessage: `فشل الاتصال بالخادم. الحالة: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      setStatusData({
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'خطأ غير معروف في الاتصال بالخادم'
      });
    }
  };

  useEffect(() => {
    checkServerStatus();

    // إعادة المحاولة كل 5 ثوانٍ في حالة الفشل
    const intervalId = setInterval(() => {
      if (statusData.status === 'error') {
        checkServerStatus();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [statusData.status]);

  const memoryUsagePercentage = statusData.serverInfo?.memory?.usage
    ? parseInt(statusData.serverInfo.memory.usage.replace('%', ''))
    : 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-warmth p-4">
      <Card className="w-full max-w-4xl shadow-decorative">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold font-heading-arabic">لوحة مراقبة حالة الخادم</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="status">الحالة العامة</TabsTrigger>
              <TabsTrigger value="system">معلومات النظام</TabsTrigger>
              <TabsTrigger value="network">شبكة الاتصال</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="p-6 space-y-6">
              {statusData.status === 'loading' && (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              )}
              
              {statusData.status === 'connected' && (
                <>
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">متصل بالخادم</AlertTitle>
                    <AlertDescription className="text-green-700">
                      تم الاتصال بالخادم بنجاح. يمكنك الآن استخدام التطبيق.
                      {statusData.timestamp && (
                        <div className="mt-2 text-xs">
                          آخر تحديث: {new Date(statusData.timestamp).toLocaleString('ar-SA')}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Server className="ml-2 h-5 w-5" />
                          حالة الخادم
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">البيئة:</span>
                          <span className="font-medium">{statusData.serverInfo?.environment || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">إصدار Node.js:</span>
                          <span className="font-medium">{statusData.serverInfo?.nodeVersion || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">المنفذ:</span>
                          <span className="font-medium">{statusData.serverInfo?.port || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">وقت التشغيل:</span>
                          <span className="font-medium">{statusData.serverInfo?.uptime || 'N/A'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <HardDrive className="ml-2 h-5 w-5" />
                          موارد النظام
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">استخدام الذاكرة:</span>
                            <span className="font-medium">{statusData.serverInfo?.memory?.usage || 'N/A'}</span>
                          </div>
                          <Progress value={memoryUsagePercentage} className="h-2" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">إجمالي الذاكرة:</span>
                          <span className="font-medium">{statusData.serverInfo?.memory?.total || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">الذاكرة المتاحة:</span>
                          <span className="font-medium">{statusData.serverInfo?.memory?.free || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">معالج:</span>
                          <span className="font-medium truncate max-w-[200px]">{statusData.serverInfo?.cpu?.model || 'N/A'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
              
              {statusData.status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>خطأ في الاتصال</AlertTitle>
                  <AlertDescription>
                    {statusData.errorMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="text-center space-y-2">
                <p className="font-bold text-lg font-arabic">أهلاً بك في تطبيق القرآن الكريم التعليمي</p>
                <p className="text-sm text-muted-foreground font-arabic">
                  يمكنك الآن استعراض القرآن الكريم والاستفادة من الميزات التعليمية المختلفة.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="system" className="p-6 space-y-6">
              {statusData.status === 'loading' ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : statusData.status === 'connected' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Terminal className="ml-2 h-5 w-5" />
                        معلومات النظام
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">نظام التشغيل:</span>
                          <span className="font-medium">{statusData.serverInfo?.platform || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">المعمارية:</span>
                          <span className="font-medium">{statusData.serverInfo?.arch || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">اسم المضيف:</span>
                          <span className="font-medium">{statusData.serverInfo?.hostname || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">وقت التشغيل:</span>
                          <span className="font-medium">{statusData.serverInfo?.uptime || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Cpu className="ml-2 h-5 w-5" />
                        معلومات المعالج
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statusData.serverInfo?.cpu ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">طراز المعالج:</span>
                            <span className="font-medium">{statusData.serverInfo.cpu.model}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">سرعة المعالج:</span>
                            <span className="font-medium">{statusData.serverInfo.cpu.speed}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center">معلومات المعالج غير متوفرة</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <HardDrive className="ml-2 h-5 w-5" />
                        معلومات الذاكرة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statusData.serverInfo?.memory ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">استخدام الذاكرة:</span>
                              <span className="font-medium">{statusData.serverInfo.memory.usage}</span>
                            </div>
                            <Progress value={memoryUsagePercentage} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">إجمالي الذاكرة:</span>
                            <span className="font-medium">{statusData.serverInfo.memory.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">الذاكرة المتاحة:</span>
                            <span className="font-medium">{statusData.serverInfo.memory.free}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center">معلومات الذاكرة غير متوفرة</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>خطأ في الاتصال</AlertTitle>
                  <AlertDescription>
                    تعذر الحصول على معلومات النظام. يرجى التحقق من اتصالك بالخادم.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="network" className="p-6 space-y-6">
              {statusData.status === 'loading' ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : statusData.status === 'connected' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Network className="ml-2 h-5 w-5" />
                        معلومات الشبكة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statusData.serverInfo?.network?.interfaces ? (
                        Object.keys(statusData.serverInfo.network.interfaces).length > 0 ? (
                          <div className="space-y-6">
                            {Object.entries(statusData.serverInfo.network.interfaces).map(([name, ifaces], index) => (
                              ifaces.length > 0 && (
                                <div key={index} className="border p-4 rounded-md">
                                  <h3 className="font-bold mb-2">{name}</h3>
                                  <div className="space-y-4">
                                    {ifaces.map((iface, ifaceIndex) => (
                                      <div key={ifaceIndex} className="pl-4 border-l">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-muted-foreground">العنوان:</span>
                                          <span className="font-medium">{iface.address}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-muted-foreground">العائلة:</span>
                                          <span className="font-medium">{iface.family}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-muted-foreground">قناع الشبكة:</span>
                                          <span className="font-medium">{iface.netmask}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center">لا توجد واجهات شبكة متاحة</p>
                        )
                      ) : (
                        <p className="text-muted-foreground text-center">معلومات الشبكة غير متوفرة</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Database className="ml-2 h-5 w-5" />
                        معلومات قاعدة البيانات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-32">
                        <p className="text-muted-foreground">
                          للاطلاع على معلومات قاعدة البيانات، يرجى زيارة صفحة تفاصيل الاتصال
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Globe className="ml-2 h-5 w-5" />
                        الاتصال الخارجي
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-32">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/connection')}
                        >
                          فحص الاتصال بخدمات API الخارجية
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>خطأ في الاتصال</AlertTitle>
                  <AlertDescription>
                    تعذر الحصول على معلومات الشبكة. يرجى التحقق من اتصالك بالخادم.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 border-t p-4">
          <div className="flex w-full justify-between space-x-2">
            <Button 
              className="flex-1"
              variant="default" 
              disabled={statusData.status === 'loading' || statusData.status === 'error'}
              onClick={() => navigate('/quran')}
            >
              بدء قراءة القرآن الكريم
            </Button>
            
            <Button 
              className="flex-1"
              variant="outline" 
              onClick={checkServerStatus}
            >
              <RefreshCcw className="ml-2 h-4 w-4" />
              تحديث المعلومات
            </Button>
          </div>
          
          <div className="flex w-full justify-between space-x-2">
            <Button 
              className="flex-1"
              variant="link" 
              onClick={() => navigate('/connection')}
            >
              تفاصيل حالة الاتصال
            </Button>
            
            <Button 
              className="flex-1"
              variant="link" 
              onClick={() => navigate('/')}
            >
              الرجوع للصفحة الرئيسية
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}