import { useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Maximize2,
  VolumeX
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  videoUrl?: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  currentSubtitle?: string;
}

export function VideoPreview({
  videoUrl,
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  currentSubtitle
}: VideoPreviewProps) {
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Video Container */}
      <div className="flex-1 relative flex items-center justify-center bg-card/50 rounded-lg m-4 overflow-hidden">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            className="max-w-full max-h-full rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-24 h-24 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Play className="w-10 h-10" />
            </div>
            <p className="text-lg font-medium">导入音视频文件开始编辑</p>
            <p className="text-sm mt-1">支持 MP4, MP3, WAV, MOV 等格式</p>
          </div>
        )}
        
        {/* Subtitle Overlay */}
        {currentSubtitle && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg">
            <p className="text-lg text-foreground">{currentSubtitle}</p>
          </div>
        )}
        
        {/* Fullscreen Button */}
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Controls */}
      <div className="px-4 pb-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={([value]) => onSeek(value)}
            className="cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" className="media-control">
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon-lg" 
            className="media-control primary"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="media-control">
            <SkipForward className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 ml-4">
            <Button 
              variant="ghost" 
              size="icon-sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={([value]) => {
                setVolume(value);
                setIsMuted(false);
              }}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
