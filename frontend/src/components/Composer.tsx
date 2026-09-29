import { useRef, useEffect, type FC, type KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface ComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  memoryOn: boolean;
  setMemoryOn: (val: boolean) => void;
  disabled?: boolean;
}

export const Composer: FC<ComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  memoryOn,
  setMemoryOn,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 pb-4 select-none">
      <div className="bg-white dark:bg-[#1f1f1f] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[8px] p-3 transition-colors focus-within:border-[#6C3BFF] shadow-xs">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or log a reel result..."
          rows={2}
          disabled={disabled || isLoading}
          className="w-full resize-none border-0 bg-transparent text-[14px] text-[var(--ink-color)] placeholder-[#6B675F]/60 focus:outline-none focus:ring-0 leading-relaxed max-h-[180px] overflow-y-auto"
        />

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#D8D4CA]/60 dark:border-[#3a3a3a]/60">
          {/* Memory toggle switch */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={memoryOn}
              onClick={() => setMemoryOn(!memoryOn)}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-[#D8D4CA] dark:border-[#3a3a3a] transition-colors duration-200 ease-in-out focus:outline-none ${
                memoryOn ? 'bg-[#6C3BFF]' : 'bg-[#D8D4CA] dark:bg-[#3a3a3a]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out mt-[0.5px] ml-[1px] ${
                  memoryOn ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-[12px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
              {memoryOn ? 'Memory on' : 'Memory off'}
            </span>
          </div>

          {/* Send button: purple accent #6C3BFF */}
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading || disabled}
            aria-label="Send message"
            className="w-7 h-7 rounded-[6px] bg-[#6C3BFF] hover:bg-[#582cd6] disabled:opacity-40 disabled:hover:bg-[#6C3BFF] text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
