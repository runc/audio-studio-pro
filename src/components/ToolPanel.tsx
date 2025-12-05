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
  Languages,
  Link,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface ToolPanelProps {
  activeTab: string;
  onFileUpload: (file: File) => void;
  onURLImport?: (url: string) => void;
  onASRStart: () => void;
  onTTSGenerate: (text: string) => void;
  isProcessing: boolean;
}

export function ToolPanel({ 
  activeTab, 
  onFileUpload, 
  onURLImport,
  onASRStart,
  onTTSGenerate,
  isProcessing 
}: ToolPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ttsText, setTtsText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("female-1");
  const [isUploadExpanded, setIsUploadExpanded] = useState(true);
  const [importUrl, setImportUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const voices = [
    { id: "female-1", name: "晓晓", gender: "女", lang: "中文" },
    { id: "female-2", name: "云希", gender: "女", lang: "中文" },
    { id: "male-1", name: "云扬", gender: "男", lang: "中文" },
    { id: "male-2", name: "云健", gender: "男", lang: "中文" },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleURLImport = () => {
    if (importUrl.trim() && onURLImport) {
      onURLImport(importUrl.trim());
      setImportUrl("");
    }
  };

  const renderUploadPanel = () => (
    <div className="p-4 h-full flex flex-col">
      <button
        onClick={() => setIsUploadExpanded(!isUploadExpanded)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <h3 className="font-semibold text-foreground">导入媒体</h3>
        <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
          {isUploadExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isUploadExpanded ? (
        <div className="flex-1 flex flex-col gap-4">
          {/* 拖拽上传区域 */}
          <div
            className={cn(
              "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer min-h-[180px]",
              isDragging 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
              isDragging ? "bg-primary/20" : "bg-muted"
            )}>
              <Upload className={cn(
                "w-7 h-7 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">
                {isDragging ? "释放以上传" : "拖放文件到这里"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">或点击选择文件</p>
            </div>
            <div className="flex gap-2">
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
          
          {/* URL 导入 */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5" />
              从 URL 导入
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="输入媒体文件 URL..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleURLImport()}
                className="flex-1"
              />
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleURLImport}
                disabled={!importUrl.trim()}
              >
                导入
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">点击展开导入区域</p>
        </div>
      )}
      
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
