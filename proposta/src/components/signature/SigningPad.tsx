
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SigningPadProps {
  onChange: (dataUrl: string | null) => void;
}

export default function SigningPad({ onChange }: SigningPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas style
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000';
    
    // Clear canvas initially
    context.fillStyle = '#f9f9f9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a line at the bottom as a guide
    context.beginPath();
    context.moveTo(20, canvas.height - 20);
    context.lineTo(canvas.width - 20, canvas.height - 20);
    context.strokeStyle = '#ccc';
    context.stroke();
    
    // Reset stroke style for drawing
    context.strokeStyle = '#000';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    
    // Get correct coordinates
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (e.type === 'touchstart') {
      // It's a touch event
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>;
      x = touchEvent.touches[0].clientX - rect.left;
      y = touchEvent.touches[0].clientY - rect.top;
    } else {
      // It's a mouse event
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      x = mouseEvent.clientX - rect.left;
      y = mouseEvent.clientY - rect.top;
    }
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get correct coordinates
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (e.type === 'touchmove') {
      // It's a touch event
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>;
      x = touchEvent.touches[0].clientX - rect.left;
      y = touchEvent.touches[0].clientY - rect.top;
    } else {
      // It's a mouse event
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      x = mouseEvent.clientX - rect.left;
      y = mouseEvent.clientY - rect.top;
    }
    
    context.lineTo(x, y);
    context.stroke();
    
    setHasSignature(true);
  };

  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      
      // Get the signature as a data URL and send to parent
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const dataUrl = canvas.toDataURL('image/png');
        onChange(dataUrl);
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear the canvas
    context.fillStyle = '#f9f9f9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the guide line
    context.beginPath();
    context.moveTo(20, canvas.height - 20);
    context.lineTo(canvas.width - 20, canvas.height - 20);
    context.strokeStyle = '#ccc';
    context.stroke();
    
    // Reset stroke style for drawing
    context.strokeStyle = '#000';
    
    setHasSignature(false);
    onChange(null);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while drawing
    startDrawing(e);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while drawing
    draw(e);
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="touch-none w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={endDrawing}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Assine no campo acima</div>
        <Button 
          type="button"
          variant="outline" 
          size="sm" 
          onClick={clearSignature}
          disabled={!hasSignature}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Limpar
        </Button>
      </div>
    </div>
  );
}
