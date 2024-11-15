import { useCallback, useEffect, useRef } from 'react';
import { DitherProcessor } from './DitherProcessor';
import { DitherSettings } from './dithering';

interface DitherCanvasProps {
  settings: DitherSettings;
  aspectRatio?: number;
}

export const DitherCanvas: React.FC<DitherCanvasProps> = ({ settings }) => {
  const aspectRatio = 6 / 3;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processorRef = useRef<DitherProcessor | null>(null);

  // Memoize drawBlockGrid
  const drawBlockGrid = useCallback(
    (canvas: HTMLCanvasElement, logicalWidth: number, logicalHeight: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!settings.showBlocks) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.lineWidth = 1 * dpr;

      // Draw vertical lines every 8 logical pixels
      for (let x = 0; x <= logicalWidth; x += 8) {
        const canvasX = x * dpr;
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines every 8 logical pixels
      for (let y = 0; y <= logicalHeight; y += 8) {
        const canvasY = y * dpr;
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(canvas.width, canvasY);
        ctx.stroke();
      }
    },
    [settings.showBlocks]
  );

  // Memoize render function
  const render = useCallback(
    (logicalWidth: number, logicalHeight: number) => {
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      const processor = processorRef.current;
      if (!canvas || !overlay || !processor) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Process the image at logical resolution
      const imageData = ctx.createImageData(logicalWidth, logicalHeight);
      imageData.data.set(processor.process(settings.mode, settings.levels, settings.noiseAmount));

      // Scale up to device resolution
      const dpr = window.devicePixelRatio || 1;
      ctx.putImageData(imageData, 0, 0);
      if (dpr !== 1) {
        // If we have a high DPR, scale up using nearest-neighbor
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = logicalWidth;
        tempCanvas.height = logicalHeight;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(imageData, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.scale(dpr, dpr);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // Draw compression block grid if enabled
      drawBlockGrid(overlay, logicalWidth, logicalHeight);
    },
    [settings.mode, settings.levels, settings.noiseAmount, drawBlockGrid]
  );

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || !overlayRef.current || !aspectRatio) return;

    const updateCanvases = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      if (!container || !canvas || !overlay) return;

      const dpr = window.devicePixelRatio || 1;
      const containerWidth = container.clientWidth;
      const containerHeight = Math.floor(containerWidth / aspectRatio);

      // Calculate logical dimensions (aligned to 8 pixels)
      const logicalWidth = Math.floor(containerWidth / 8) * 8;
      const logicalHeight = Math.floor(containerHeight / 8) * 8;

      // Set physical dimensions (scaled by DPR)
      const physicalWidth = logicalWidth * dpr;
      const physicalHeight = logicalHeight * dpr;

      // Update main canvas
      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;

      // Update overlay canvas
      overlay.width = physicalWidth;
      overlay.height = physicalHeight;
      overlay.style.width = `${logicalWidth}px`;
      overlay.style.height = `${logicalHeight}px`;

      // Initialize or resize processor with LOGICAL dimensions
      if (!processorRef.current) {
        processorRef.current = new DitherProcessor(logicalWidth, logicalHeight);
      } else {
        processorRef.current.resize(logicalWidth, logicalHeight);
      }

      render(logicalWidth, logicalHeight);
    };

    const resizeObserver = new ResizeObserver(updateCanvases);
    resizeObserver.observe(containerRef.current);
    updateCanvases();

    return () => resizeObserver.disconnect();
  }, [aspectRatio, render]);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          imageRendering: 'pixelated',
          aspectRatio: `${aspectRatio}`,
          display: 'block'
        }}
      />
      <canvas
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
