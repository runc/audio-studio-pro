import { useState, useRef } from "react";
import { 
  Upload, 
  FileAudio, 
  FileVideo, 
  Mic, 
  Loader2, 
  Volume2,
  Download,
  Sparkles,
  Languages
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface ToolPanelProps {
  activeTab: string;
  onFileUpload: (file: File) => void;
  onASRStart: () => void;
  onTTSGenerate: (text: string) => void;
  isProcessing: boolean;
}

export function ToolPanel({ 
  activeTab, 
  onFileUpload, 
  onASRStart,
  onTTSGenerate,
  isProcessing 
}: ToolPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ttsText, setTtsText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("female-1");

  const voices = [
    { id: "female-1", name: "晓晓", gender: "女", lang: "中文" },
    { id: "female-2", name: "云希", gender: "女", lang: "中文" },
    { id: "male-1", name: "云扬", gender: "男", lang: "中文" },
    { id: "male-2", name: "云健", gender: "男", lang: "中文" },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const renderUploadPanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-4">导入媒体</h3>
      
      <div
        className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Upload className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">拖放文件到这里</p>
          <p className="text-sm text-muted-foreground mt-1">或点击选择文件</p>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            <FileVideo className="w-3 h-3" />
            MP4, MOV
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            <FileAudio className="w-3 h-3" />
            MP3, WAV
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileUpload(file);
        }}
      />
    </div>
  );

  const renderASRPanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-4">语音识别 (ASR)</h3>
      
      <div className="flex-1 flex flex-col">
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">自动语音识别</p>
              <p className="text-sm text-muted-foreground">将音频转换为字幕文本</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span>支持中文、英文、日文等多语言</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>智能断句，自动生成时间轴</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="gradient" 
          className="w-full h-12"
          onClick={onASRStart}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              识别中...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              开始识别
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderTTSPanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-4">语音合成 (TTS)</h3>
      
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">选择音色</label>
          <div className="grid grid-cols-2 gap-2">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  selectedVoice === voice.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <p className="font-medium text-foreground">{voice.name}</p>
                <p className="text-xs text-muted-foreground">{voice.gender} · {voice.lang}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-muted-foreground mb-2 block">输入文本</label>
          <Textarea
            placeholder="请输入要转换为语音的文本..."
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            className="flex-1 min-h-[120px] resize-none"
          />
        </div>
        
        <Button 
          variant="gradient" 
          className="w-full h-12"
          onClick={() => onTTSGenerate(ttsText)}
          disabled={isProcessing || !ttsText.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              生成语音
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderExportPanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-4">导出</h3>
      
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start h-12">
          <Download className="w-5 h-5 mr-3" />
          <div className="text-left">
            <p className="font-medium">导出 SRT 字幕</p>
            <p className="text-xs text-muted-foreground">标准字幕格式</p>
          </div>
        </Button>
        
        <Button variant="outline" className="w-full justify-start h-12">
          <Download className="w-5 h-5 mr-3" />
          <div className="text-left">
            <p className="font-medium">导出 VTT 字幕</p>
            <p className="text-xs text-muted-foreground">Web 视频字幕格式</p>
          </div>
        </Button>
        
        <Button variant="outline" className="w-full justify-start h-12">
          <Download className="w-5 h-5 mr-3" />
          <div className="text-left">
            <p className="font-medium">导出纯文本</p>
            <p className="text-xs text-muted-foreground">仅导出字幕文本</p>
          </div>
        </Button>
      </div>
    </div>
  );

  const panels: Record<string, () => JSX.Element> = {
    upload: renderUploadPanel,
    asr: renderASRPanel,
    tts: renderTTSPanel,
    export: renderExportPanel,
  };

  const PanelComponent = panels[activeTab];

  if (!PanelComponent) {
    return (
      <div className="p-4 h-full flex items-center justify-center text-muted-foreground">
        <p>选择左侧工具开始使用</p>
      </div>
    );
  }

  return PanelComponent();
}
