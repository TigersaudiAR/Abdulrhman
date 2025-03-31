
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  isPlaying?: boolean;
  progress?: number;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}

export default function AudioPlayer({
  isPlaying: externalIsPlaying,
  progress: externalProgress,
  duration: externalDuration,
  onPlay,
  onPause,
  onStop
}: AudioPlayerProps = {}) {
  // استخدام القيم الداخلية أو الخارجية حسب توفرها
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [internalCurrentTime, setInternalCurrentTime] = useState(0);
  const [internalDuration, setInternalDuration] = useState(0);
  
  // استخدام Props إذا كانت متوفرة، أو القيم الداخلية إذا لم تكن
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const currentTime = externalProgress !== undefined ? externalProgress : internalCurrentTime;
  const duration = externalDuration !== undefined ? externalDuration : internalDuration;
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [reciter, setReciter] = useState('mishari_rashid_alafasy');
  const [surah, setSurah] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const reciters = [
    { id: 'mishari_rashid_alafasy', name: 'مشاري راشد العفاسي' },
    { id: 'abdul_basit_abdus_samad', name: 'عبد الباسط عبد الصمد' },
    { id: 'mahmoud_khalil_al_husary', name: 'محمود خليل الحصري' },
    { id: 'muhammad_siddiq_al_minshawi', name: 'محمد صديق المنشاوي' },
    { id: 'abu_bakr_al_shatri', name: 'أبو بكر الشاطري' }
  ];
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setInternalCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setInternalDuration(audioRef.current.duration);
    }
  };
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setInternalIsPlaying(false);
        if (onPause) onPause();
      } else {
        audioRef.current.play();
        setInternalIsPlaying(true);
        if (onPlay) onPlay();
      }
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setInternalCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };
  
  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReciter(e.target.value);
  };
  
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSurah(parseInt(e.target.value));
  };
  
  useEffect(() => {
    // عند تغيير السورة أو القارئ
    if (audioRef.current) {
      const audioSrc = `https://server.mp3quran.net//${reciter}/${surah.toString().padStart(3, '0')}.mp3`;
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [reciter, surah]);
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setInternalIsPlaying(false);
          if (onStop) onStop();
        }}
      />
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          
          <div className="text-sm">
            <span>{formatTime(currentTime)}</span>
            <span> / </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex-grow mx-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-primary-600"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'} text-gray-600 dark:text-gray-300`}></i>
          </button>
          
          {showVolumeControl && (
            <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg z-10">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-primary-600"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="reciter" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">القارئ:</label>
          <select
            id="reciter"
            value={reciter}
            onChange={handleReciterChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            {reciters.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="surah" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">السورة:</label>
          <select
            id="surah"
            value={surah}
            onChange={handleSurahChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            {Array.from({ length: 114 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num}. {getSurahName(num)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// أسماء السور
function getSurahName(number: number): string {
  const names = [
    'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
    'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
    'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
    'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
    'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
    'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
    'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
    'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
    'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
    'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
    'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
    'المسد', 'الإخلاص', 'الفلق', 'الناس'
  ];
  
  return names[number - 1] || '';
}
import React from 'react';
import { IoPlayCircle, IoPauseCircle, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  togglePlay: () => void;
  currentVerse: number;
  totalVerses: number;
  onVerseChange: (verse: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  isPlaying,
  togglePlay,
  currentVerse,
  totalVerses,
  onVerseChange
}) => {
  const handlePrevVerse = () => {
    if (currentVerse > 1) {
      onVerseChange(currentVerse - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerse < totalVerses) {
      onVerseChange(currentVerse + 1);
    }
  };

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400"
        >
          {isPlaying ? (
            <IoPauseCircle size={40} />
          ) : (
            <IoPlayCircle size={40} />
          )}
        </button>
        <div className="text-sm">
          الآية {currentVerse} من {totalVerses}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevVerse}
          disabled={currentVerse <= 1}
          className={`p-2 rounded-full ${
            currentVerse <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400'
          }`}
        >
          <IoPlaySkipBack size={24} />
        </button>
        <button
          onClick={handleNextVerse}
          disabled={currentVerse >= totalVerses}
          className={`p-2 rounded-full ${
            currentVerse >= totalVerses
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400'
          }`}
        >
          <IoPlaySkipForward size={24} />
        </button>
      </div>
      
      <audio src={audioUrl} id="quran-audio" className="hidden" />
    </div>
  );
};

export default AudioPlayer;
