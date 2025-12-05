import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  currentTime: number;
  onSubtitleChange: (subtitles: Subtitle[]) => void;
  onSeek: (time: number) => void;
}

export function SubtitleEditor({ 
  subtitles, 
  currentTime, 
  onSubtitleChange,
  onSeek 
}: SubtitleEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const isActive = (subtitle: Subtitle) => {
    return currentTime >= subtitle.startTime && currentTime <= subtitle.endTime;
  };

  const handleEdit = (subtitle: Subtitle) => {
    setEditingId(subtitle.id);
    setEditText(subtitle.text);
  };

  const handleSave = (id: string) => {
    onSubtitleChange(
      subtitles.map(s => s.id === id ? { ...s, text: editText } : s)
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onSubtitleChange(subtitles.filter(s => s.id !== id));
  };

  const handleAdd = () => {
    const newSubtitle: Subtitle = {
      id: Date.now().toString(),
      startTime: currentTime,
      endTime: currentTime + 3,
      text: "新字幕"
    };
    onSubtitleChange([...subtitles, newSubtitle]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">字幕列表</h3>
        <Button variant="default" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" />
          添加字幕
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {subtitles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileTextIcon className="w-12 h-12 mb-3 opacity-50" />
            <p>暂无字幕</p>
            <p className="text-sm mt-1">点击上方按钮添加字幕，或使用语音识别生成</p>
          </div>
        ) : (
          subtitles.map((subtitle) => (
            <div
              key={subtitle.id}
              className={cn("subtitle-row", isActive(subtitle) && "active")}
              onClick={() => onSeek(subtitle.startTime)}
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                    {formatTime(subtitle.startTime)}
                  </span>
                  <span>→</span>
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                    {formatTime(subtitle.endTime)}
                  </span>
                </div>
                
                {editingId === subtitle.id ? (
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(subtitle.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                ) : (
                  <p className="text-sm text-foreground truncate">{subtitle.text}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {editingId === subtitle.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(subtitle.id);
                      }}
                      className="text-success"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(subtitle);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(subtitle.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
