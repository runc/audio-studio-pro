import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { VideoPreview } from "@/components/VideoPreview";
import { SubtitleEditor, type Subtitle } from "@/components/SubtitleEditor";
import { Timeline } from "@/components/Timeline";
import { ToolPanel } from "@/components/ToolPanel";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [videoUrl, setVideoUrl] = useState<string>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // Default 3 min for demo
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    { id: "1", startTime: 0, endTime: 3, text: "欢迎使用音视频工作台" },
    { id: "2", startTime: 3.5, endTime: 7, text: "您可以在这里编辑字幕" },
    { id: "3", startTime: 8, endTime: 12, text: "支持语音识别和语音合成功能" },
  ]);

  // Simulate playback
  useEffect(() => {
    let interval: number;
    if (isPlaying && currentTime < duration) {
      interval = window.setInterval(() => {
        setCurrentTime((t) => Math.min(t + 0.1, duration));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, currentTime]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    toast({
      title: "文件上传成功",
      description: `已导入: ${file.name}`,
    });
    setActiveTab("subtitle");
  }, [toast]);

  const handleURLImport = useCallback((url: string) => {
    setVideoUrl(url);
    toast({
      title: "URL 导入成功",
      description: "已从 URL 导入媒体",
    });
    setActiveTab("subtitle");
  }, [toast]);

  const handleASRStart = useCallback(() => {
    setIsProcessing(true);
    toast({
      title: "开始语音识别",
      description: "正在处理音频，请稍候...",
    });
    
    // Simulate ASR processing
    setTimeout(() => {
      setSubtitles([
        { id: "asr-1", startTime: 0, endTime: 4, text: "这是通过语音识别生成的字幕" },
        { id: "asr-2", startTime: 4.5, endTime: 9, text: "系统会自动识别音频中的语音内容" },
        { id: "asr-3", startTime: 10, endTime: 15, text: "并生成带有时间轴的字幕文本" },
        { id: "asr-4", startTime: 16, endTime: 20, text: "您可以对生成的字幕进行编辑" },
      ]);
      setIsProcessing(false);
      toast({
        title: "识别完成",
        description: "已生成 4 条字幕",
      });
      setActiveTab("subtitle");
    }, 2000);
  }, [toast]);

  const handleTTSGenerate = useCallback((text: string) => {
    setIsProcessing(true);
    toast({
      title: "开始生成语音",
      description: "正在合成语音，请稍候...",
    });
    
    // Simulate TTS processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "语音生成完成",
        description: "已生成语音文件",
      });
    }, 2000);
  }, [toast]);

  const getCurrentSubtitle = () => {
    return subtitles.find(
      (s) => currentTime >= s.startTime && currentTime <= s.endTime
    )?.text;
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex min-h-0">
          {/* Video Preview */}
          <VideoPreview
            videoUrl={videoUrl}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            currentSubtitle={getCurrentSubtitle()}
          />
          
          {/* Right Panel - Tool or Subtitle Editor */}
          <div className="w-80 bg-card border-l border-border flex flex-col">
            {activeTab === "subtitle" ? (
              <SubtitleEditor
                subtitles={subtitles}
                currentTime={currentTime}
                onSubtitleChange={setSubtitles}
                onSeek={handleSeek}
              />
            ) : (
              <ToolPanel
                activeTab={activeTab}
                onFileUpload={handleFileUpload}
                onURLImport={handleURLImport}
                onASRStart={handleASRStart}
                onTTSGenerate={handleTTSGenerate}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
        
        {/* Timeline */}
        <Timeline
          duration={duration}
          currentTime={currentTime}
          subtitles={subtitles}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
};

export default Index;
