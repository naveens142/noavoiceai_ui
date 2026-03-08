import { useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Code, Strikethrough } from "lucide-react";
import type { Agent } from "../types"

interface Props {
  agent: Agent;
  formData: {
    system_prompt: string
    first_message: string
    end_call_message: string
  }
  onFormChange: (data: any) => void
}

export default function PromptTab({ agent, formData, onFormChange }: Props) {

  const defaultFirstMessage = `Hello, this is ${agent.name} from NoaVoice Health Centre. How may I assist you today?`;

  const defaultEndCall =
    "Thank you for contacting us. If you need anything else, feel free to reach out anytime. Have a great day!";

const defaultSystemPrompt = `
You are an AI voice assistant for **NoaVoice Health Centre**.

Your responsibilities include:

• Greeting the caller politely  
• Understanding the caller's request  
• Providing helpful responses  

Guidelines:

- Always speak in a **professional and friendly tone**
- Keep responses **short and clear**
- If the caller asks something outside your knowledge, politely inform them

Important:

*Do not provide medical diagnosis.*

If the user wants to end the call, respond politely and use the end call message.
`;
  const systemPromptRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (prefix: string, suffix: string = "") => {
    if (!systemPromptRef.current) return;

    const textarea = systemPromptRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.system_prompt.substring(start, end) || "text";

    const beforeText = formData.system_prompt.substring(0, start);
    const afterText = formData.system_prompt.substring(end);
    const formattedText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;

    onFormChange({ ...formData, system_prompt: formattedText });

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    }, 0);
  };

  return (
    <div className="space-y-6">

      {/* First Message */}

      <div>
        <label className="block text-sm font-medium mb-2">
          First Message
        </label>

        <textarea
          className="w-full rounded-lg border border-cyan-500/20 bg-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
          rows={2}
          value={formData.first_message || defaultFirstMessage}
          onChange={(e) => onFormChange({ ...formData, first_message: e.target.value })}
        />
      </div>

      {/* System Prompt */}

      <div>
        <label className="block text-sm font-medium mb-2">
          System Prompt
        </label>

        {/* Formatting Toolbar */}
        <div className="flex gap-1 mb-2 p-2 rounded-t-lg border border-b-0 border-cyan-500/20 bg-white/5 flex-wrap">
          <button
            onClick={() => applyFormatting("**", "**")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => applyFormatting("*", "*")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => applyFormatting("<u>", "</u>")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Underline"
          >
            <Underline size={18} />
          </button>
          <button
            onClick={() => applyFormatting("`", "`")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Code"
          >
            <Code size={18} />
          </button>
          <button
            onClick={() => applyFormatting("~~", "~~")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>
          <div className="w-px bg-cyan-500/20 mx-1"></div>
          <button
            onClick={() => applyFormatting("\n• ")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => applyFormatting("\n1. ")}
            className="p-2 rounded hover:bg-white/10 transition-colors text-white"
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <textarea
          ref={systemPromptRef}
          className="w-full rounded-b-lg border border-cyan-500/20 bg-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
          rows={10}
          value={formData.system_prompt || defaultSystemPrompt}
          onChange={(e) => onFormChange({ ...formData, system_prompt: e.target.value })}
        />
      </div>

      {/* End Call Message */}

      <div>
        <label className="block text-sm font-medium mb-2">
          End Call Message
        </label>

        <textarea
          className="w-full rounded-lg border border-cyan-500/20 bg-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
          rows={2}
          value={formData.end_call_message || defaultEndCall}
          onChange={(e) => onFormChange({ ...formData, end_call_message: e.target.value })}
        />
      </div>

    </div>
  );
}