import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RECITERS, LANGUAGES } from '../lib/constants';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">الإعدادات</h1>
        </div>

        <div className="space-y-8 max-w-lg">
          {/* إعدادات المظهر */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">المظهر</h2>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">الوضع المظلم</Label>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <Switch 
                  id="theme" 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme} 
                />
                <Moon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="fontSize">حجم الخط</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">صغير</span>
                <Slider
                  id="fontSize"
                  value={[settings.fontSize]}
                  min={16}
                  max={30}
                  step={2}
                  onValueChange={(value) => {
                    updateSettings({ fontSize: value[0] });
                  }}
                  className="flex-1"
                />
                <span className="text-sm">كبير</span>
              </div>
            </div>
          </div>

          {/* إعدادات القرآن */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">القرآن</h2>
            
            <div className="space-y-2">
              <Label htmlFor="reciter">القارئ</Label>
              <Select
                value={settings.reciter}
                onValueChange={(value) => {
                  updateSettings({ reciter: value });
                }}
              >
                <SelectTrigger id="reciter" className="w-full">
                  <SelectValue placeholder="اختر القارئ" />
                </SelectTrigger>
                <SelectContent>
                  {RECITERS.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="translation">الترجمة</Label>
              <Select
                value={settings.translation}
                onValueChange={(value) => {
                  updateSettings({ translation: value });
                }}
              >
                <SelectTrigger id="translation" className="w-full">
                  <SelectValue placeholder="اختر لغة الترجمة" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name} - {lang.english_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="show-translation">إظهار الترجمة</Label>
                <div className="text-sm text-muted-foreground">
                  إظهار ترجمة معاني الآيات
                </div>
              </div>
              <Switch 
                id="show-translation" 
                checked={settings.showTranslation} 
                onCheckedChange={(checked) => {
                  updateSettings({ showTranslation: checked });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="auto-play">تشغيل تلقائي للصوت</Label>
                <div className="text-sm text-muted-foreground">
                  تشغيل الصوت تلقائيًا عند النقر على الآية
                </div>
              </div>
              <Switch 
                id="auto-play" 
                checked={settings.autoPlayAudio} 
                onCheckedChange={(checked) => {
                  updateSettings({ autoPlayAudio: checked });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="highlight-verse">تمييز الآية الحالية</Label>
                <div className="text-sm text-muted-foreground">
                  تمييز الآية الحالية أثناء القراءة أو الاستماع
                </div>
              </div>
              <Switch 
                id="highlight-verse" 
                checked={settings.highlightCurrentVerse} 
                onCheckedChange={(checked) => {
                  updateSettings({ highlightCurrentVerse: checked });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="save-last-read">حفظ آخر قراءة</Label>
                <div className="text-sm text-muted-foreground">
                  حفظ موضع آخر قراءة تلقائيًا
                </div>
              </div>
              <Switch 
                id="save-last-read" 
                checked={settings.autoSaveLastRead} 
                onCheckedChange={(checked) => {
                  updateSettings({ autoSaveLastRead: checked });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}