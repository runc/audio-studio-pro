import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Subtitle } from "./SubtitleEditor";

interface TimelineProps {
  duration: number;
  currentTime: number;
  subtitles: Subtitle[];
  onSeek: (time: number) => void;
}

export function Timeline({ duration, currentTime, subtitles, onSeek }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  const formatTimeMarker = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSubtitlePosition = (subtitle: Subtitle) => {
    if (!duration) return { left: 0, width: 0 };
    const left = (subtitle.startTime / duration) * 100;
    const width = ((subtitle.endTime - subtitle.startTime) / duration) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const playheadPosition = duration ? (currentTime / duration) * 100 : 0;

  // Generate time markers
  const markers = [];
  const markerCount = 10;
  for (let i = 0; i <= markerCount; i++) {
    markers.push((duration / markerCount) * i);
  }

  return (
    <div className="bg-card border-t border-border">
      {/* Time markers */}
      <div className="h-6 border-b border-border flex items-end relative px-4">
        {markers.map((time, i) => (
          <div
            key={i}
            className="absolute text-xs text-muted-foreground"
            style={{ left: `calc(${(i / markerCount) * 100}% + 16px - ${i === 0 ? 0 : 12}px)` }}
          >
            {formatTimeMarker(time)}
          </div>
        ))}
      </div>

      {/* Waveform Track */}
      <div className="h-16 relative mx-4 my-2 bg-muted/30 rounded-lg overflow-hidden">
        {/* Fake waveform visualization */}
        <div className="absolute inset-0 flex items-center gap-px px-2">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/40 rounded-full"
              style={{
                height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
              }}
            />
          ))}
        </div>
        
        {/* Played overlay */}
        <div
          className="absolute inset-y-0 left-0 bg-primary/20"
          style={{ width: `${playheadPosition}%` }}
        />
      </div>

      {/* Timeline Track */}
      <div
        ref={timelineRef}
        className="h-12 relative mx-4 mb-4 bg-muted/30 rounded-lg cursor-pointer timeline-grid"
        onClick={handleTimelineClick}
      >
        {/* Subtitle blocks */}
        {subtitles.map((subtitle) => {
          const position = getSubtitlePosition(subtitle);
          const isActive = currentTime >= subtitle.startTime && currentTime <= subtitle.endTime;
          return (
            <div
              key={subtitle.id}
              className={cn(
                "absolute top-1 bottom-1 rounded-md transition-all duration-150",
                isActive 
                  ? "bg-primary/80 shadow-glow-sm" 
                  : "bg-secondary/60 hover:bg-secondary/80"
              )}
              style={{ left: position.left, width: position.width }}
            >
              <span className="text-xs text-foreground px-2 truncate block leading-10">
                {subtitle.text}
              </span>
            </div>
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
          style={{ left: `${playheadPosition}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-glow-sm" />
        </div>
      </div>
    </div>
  );
}
