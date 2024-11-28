import { useEffect, useRef } from 'react';
import { theme } from '../../theme';

interface TaskOutputProps {
  messages: string[];
}

export function TaskOutput({ messages }: TaskOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const containerElement = containerRef.current;
    const resizeElement = resizeRef.current;
    if (!containerElement || !resizeElement) return;

    let startY = 0;
    let startHeight = 0;

    function handleMouseMove(e: MouseEvent) {
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(100, Math.min(600, startHeight + deltaY));
      containerElement.style.height = `${newHeight}px`;
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      resizeElement.classList.remove('active');
    }

    function handleMouseDown(e: MouseEvent) {
      e.preventDefault();
      startY = e.clientY;
      startHeight = containerElement.offsetHeight;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      resizeElement.classList.add('active');
    }

    resizeElement.addEventListener('mousedown', handleMouseDown);

    return () => {
      resizeElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-[300px]">
      <div
        ref={resizeRef}
        className="h-1 -mt-[2px] bg-transparent hover:bg-blue-500/20 cursor-row-resize transition-colors duration-200 ease-in-out -mb-1 group"
      >
        <div className="h-4 -mt-2 group-hover:bg-blue-500/10" />
      </div>
      <div 
        ref={scrollRef}
        className={`h-full overflow-y-auto font-mono text-sm p-4 ${theme.surface('secondary')} rounded-lg border ${theme.border()}`}
      >
        {messages.map((message, index) => (
          <div key={index} className={`${theme.text()} whitespace-pre-wrap leading-relaxed`}>
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}