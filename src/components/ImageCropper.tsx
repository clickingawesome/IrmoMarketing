import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onConfirm: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onConfirm, onCancel }: ImageCropperProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerSize = 300;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      let initialScale = 1;

      if (imgAspect > 1) {
        initialScale = containerSize / img.naturalHeight;
      } else {
        initialScale = containerSize / img.naturalWidth;
      }

      setScale(initialScale);
    }
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleConfirm = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const img = imageRef.current;
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const centerX = size / 2;
    const centerY = size / 2;

    ctx.drawImage(
      img,
      centerX - scaledWidth / 2 + position.x,
      centerY - scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        onConfirm(blob);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6">
      <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-lg w-full border border-gray-800">
        <h3 className="text-2xl font-semibold text-white mb-6">Adjust Avatar</h3>

        <div
          ref={containerRef}
          className="relative w-[300px] h-[300px] mx-auto mb-6 bg-[#0f0f0f] rounded-lg overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
              transformOrigin: 'center',
            }}
            draggable={false}
          />

          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <mask id="circle-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <circle cx="150" cy="150" r="140" fill="black" />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="black"
                opacity="0.5"
                mask="url(#circle-mask)"
              />
              <circle
                cx="150"
                cy="150"
                r="140"
                fill="none"
                stroke="#F4B400"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-3 text-sm">Zoom</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleZoomOut}
              className="bg-[#0f0f0f] border border-gray-700 hover:border-[#F4B400] text-white p-2 rounded-lg transition-colors"
            >
              <ZoomOut size={20} />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-[#F4B400]"
            />
            <button
              type="button"
              onClick={handleZoomIn}
              className="bg-[#0f0f0f] border border-gray-700 hover:border-[#F4B400] text-white p-2 rounded-lg transition-colors"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Drag to reposition • Scroll or use buttons to zoom
        </p>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#0f0f0f] border border-gray-700 hover:border-gray-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-[#F4B400] hover:bg-[#ff8c00] text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Confirm
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
