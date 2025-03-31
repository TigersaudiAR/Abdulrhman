import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقائق
      refetchOnWindowFocus: false,
    },
  },
});

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, any>;
  headers?: Record<string, string>;
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(endpoint, requestOptions);
  
  if (!response.ok) {
    // محاولة قراءة رسالة الخطأ من الاستجابة
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `خطأ ${response.status}: ${response.statusText}`;
    } catch (e) {
      errorMessage = `خطأ ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  // بعض النقاط النهائية قد تعيد استجابة فارغة (مثل عمليات الحذف)
  if (response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  // للنقاط النهائية التي تعيد قيمًا غير JSON
  const contentType = response.headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    const text = await response.text();
    return text as unknown as T;
  }
  
  return response.json();
}