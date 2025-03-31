import { Route, Switch } from 'wouter';
import Quran from './pages/Quran';
import Home from './pages/Home';
import Prayer from './pages/Prayer';
import Settings from './pages/Settings';
import NotFound from './pages/not-found';
import DebugPage from './pages/DebugPage';
import FontsTest from './pages/FontsTest';
import ConnectionStatus from './pages/ConnectionStatus';
import ServerStatus from './pages/ServerStatus';
import Debug from './pages/Debug';
import { ThemeProvider } from './components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import { AppProvider } from './context/AppContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="quran-app-theme">
        <CustomThemeProvider>
          <AppProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Switch>
                {/* الصفحة الرئيسية */}
                <Route path="/" component={Home} />
                
                {/* مسارات القرآن الكريم */}
                <Route path="/quran" component={Quran} />
                <Route path="/quran/:pageNumber" component={Quran} />
                <Route path="/surah/:surahNumber" component={Quran} />
                <Route path="/juz/:juzNumber" component={Quran} />
                
                {/* الصفحات التي تمت إضافتها */}
                <Route path="/prayer" component={Prayer} />
                <Route path="/settings" component={Settings} />
                <Route path="/debug" component={Debug} />
                <Route path="/debug-page" component={DebugPage} />
                <Route path="/fonts" component={FontsTest} />
                <Route path="/connection" component={ConnectionStatus} />
                <Route path="/server-status" component={ServerStatus} />
                
                {/* مسارات أخرى في المستقبل */}
                {/* <Route path="/hadith" component={Hadith} /> */}
                {/* <Route path="/tafsir" component={Tafsir} /> */}
                {/* <Route path="/search" component={Search} /> */}
                {/* <Route path="/qibla" component={Qibla} /> */}
                {/* <Route path="/duas" component={Duas} /> */}
                {/* <Route path="/memorization" component={Memorization} /> */}
                {/* <Route path="/hajj" component={Hajj} /> */}
                
                {/* صفحة غير موجودة */}
                <Route component={NotFound} />
              </Switch>
              
              <Toaster />
            </div>
          </AppProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;