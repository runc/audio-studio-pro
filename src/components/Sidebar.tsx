import { 
  Upload, 
  FileText, 
  Mic, 
  Volume2, 
  Download, 
  Settings,
  Layers,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tools = [
  { id: "upload", icon: Upload, label: "导入" },
  { id: "subtitle", icon: FileText, label: "字幕" },
  { id: "asr", icon: Mic, label: "语音识别" },
  { id: "tts", icon: Volume2, label: "语音合成" },
  { id: "effects", icon: Wand2, label: "效果" },
  { id: "layers", icon: Layers, label: "轨道" },
  { id: "export", icon: Download, label: "导出" },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-4 gap-1">
      <div className="mb-4 p-2">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">AV</span>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onTabChange(tool.id)}
            className={cn(
              "tool-button w-16",
              activeTab === tool.id && "active"
            )}
          >
            <tool.icon className="w-5 h-5" />
            <span className="text-xs">{tool.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="flex flex-col gap-2 mt-auto">
        <ThemeToggle />
        <button className="tool-button w-16">
          <Settings className="w-5 h-5" />
          <span className="text-xs">设置</span>
        </button>
      </div>
    </aside>
  );
}
