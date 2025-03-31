import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { 
  PlayCircle, 
  PauseCircle, 
  StopCircle, 
  Settings,
  Volume2,
  Volume1,
  VolumeX
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useTextToSpeech, QuranTTSOptions } from '../../hooks/useTextToSpeech';
import { useToast } from '../../hooks/use-toast';

interface TajweedSpeechControlsProps {
  text?: string;
  verses?: string[];
  className?: string;
  showSettings?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export default function TajweedSpeechControls({
  text,
  verses,
  className = '',
  showSettings = true,
  size = 'default',
  variant = 'outline'
}: TajweedSpeechControlsProps) {
  const { 
    speak, 
    speakVerses,
    pause, 
    resume, 
    stop, 
    updateOptions,
    voices, 
    options, 
    isAvailable, 
    isPlaying, 
    isPaused 
  } = useTextToSpeech();
  
  const { toast } = useToast();
  
  // تحديد حجم الأيقونة بناءً على حجم المكون
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 18;
      case 'lg': return 28;
      case 'icon': return 16;
      default: return 22;
    }
  };
  
  // الضغط على زر التشغيل
  const handlePlay = () => {
    if (!isAvailable) {
      toast({
        title: "تنبيه",
        description: "ميزة تحويل النص إلى صوت غير متاحة في متصفحك",
        variant: "destructive"
      });
      return;
    }
    
    if (isPlaying && isPaused) {
      resume();
    } else if (!isPlaying) {
      if (verses && verses.length > 0) {
        speakVerses(verses);
      } else if (text) {
        speak(text);
      } else {
        toast({
          title: "تنبيه",
          description: "لا يوجد نص للقراءة",
          variant: "destructive"
        });
      }
    } else {
      pause();
    }
  };
  
  // الضغط على زر الإيقاف
  const handleStop = () => {
    stop();
  };
  
  // تحديث الإعدادات
  const handleOptionsChange = (newOptions: Partial<QuranTTSOptions>) => {
    updateOptions(newOptions);
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        onClick={handlePlay} 
        variant={variant} 
        size={size}
        disabled={!isAvailable}
        title={
          !isAvailable ? "ميزة غير متاحة" :
          isPlaying && !isPaused ? "إيقاف مؤقت" : 
          isPlaying && isPaused ? "استئناف" : 
          "تشغيل"
        }
      >
        {isPlaying && !isPaused ? (
          <PauseCircle size={getIconSize()} />
        ) : isPlaying && isPaused ? (
          <PlayCircle size={getIconSize()} />
        ) : (
          <PlayCircle size={getIconSize()} />
        )}
      </Button>
      
      {isPlaying && (
        <Button 
          onClick={handleStop} 
          variant={variant} 
          size={size}
        >
          <StopCircle size={getIconSize()} />
        </Button>
      )}
      
      {showSettings && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant={variant} 
              size={size}
              disabled={!isAvailable}
            >
              <Settings size={getIconSize()-2} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">إعدادات نطق النص القرآني</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* اختيار الصوت */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="voice" className="text-right">القارئ</Label>
                <div className="col-span-3">
                  <Select
                    value={options.voice}
                    onValueChange={(value) => handleOptionsChange({ voice: value })}
                  >
                    <SelectTrigger id="voice">
                      <SelectValue placeholder="اختر الصوت" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem
                          key={voice.id}
                          value={voice.id}
                        >
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* وضع التجويد */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tajweed-mode" className="text-right">وضع التجويد</Label>
                <div className="col-span-3">
                  <Select
                    value={options.tajweedMode}
                    onValueChange={(value) => handleOptionsChange({ 
                      tajweedMode: value as 'normal' | 'enhanced' | 'professional' 
                    })}
                  >
                    <SelectTrigger id="tajweed-mode">
                      <SelectValue placeholder="وضع التجويد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="enhanced">محسّن</SelectItem>
                      <SelectItem value="professional">احترافي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* سرعة القراءة */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">السرعة</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xs">0.5</span>
                  <Slider
                    id="rate"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[options.rate]}
                    onValueChange={(values) => handleOptionsChange({ rate: values[0] })}
                    className="flex-1"
                  />
                  <span className="text-xs">2.0</span>
                  <span className="text-sm ml-2">{options.rate.toFixed(1)}</span>
                </div>
              </div>
              
              {/* طبقة الصوت */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pitch" className="text-right">طبقة الصوت</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xs">0.5</span>
                  <Slider
                    id="pitch"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[options.pitch]}
                    onValueChange={(values) => handleOptionsChange({ pitch: values[0] })}
                    className="flex-1"
                  />
                  <span className="text-xs">2.0</span>
                  <span className="text-sm ml-2">{options.pitch.toFixed(1)}</span>
                </div>
              </div>
              
              {/* الوقفة بين الآيات */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pause" className="text-right">الوقفة</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xs">0</span>
                  <Slider
                    id="pause"
                    min={0}
                    max={3000}
                    step={100}
                    value={[options.pauseBetweenAyahs]}
                    onValueChange={(values) => handleOptionsChange({ pauseBetweenAyahs: values[0] })}
                    className="flex-1"
                  />
                  <span className="text-xs">3s</span>
                  <span className="text-sm ml-2">{(options.pauseBetweenAyahs / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="default">حفظ الإعدادات</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}