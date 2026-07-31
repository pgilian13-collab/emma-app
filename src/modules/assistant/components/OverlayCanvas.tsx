import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import * as fabric from 'fabric';
import type { OverlayTransform } from '@modules/assistant/types';
import type { FabricImage } from 'fabric';

interface OverlayCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  imageUrl: string | null;
  transform: OverlayTransform;
  locked: boolean;
  onTransformChange: (next: Partial<OverlayTransform>) => void;
  onImageLoaded?: (width: number, height: number) => void;
}

export function OverlayCanvas({
  canvasRef,
  containerRef,
  imageUrl,
  transform,
  locked,
  onTransformChange,
  onImageLoaded,
}: OverlayCanvasProps) {
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const imageRef = useRef<FabricImage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const containerEl = containerRef.current;
    if (!canvasEl || !containerEl) return;

    const sizeContainer = () => {
      const rect = containerEl.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (fabricRef.current) {
        fabricRef.current.setDimensions({ width, height });
      }
    };

    const canvas = new fabric.Canvas(canvasEl, {
      width: containerEl.clientWidth,
      height: containerEl.clientHeight,
      backgroundColor: 'transparent',
      selection: false,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      fireRightClick: true,
      stopContextMenu: true,
      renderOnAddRemove: true,
    });
    fabricRef.current = canvas;
    setReady(true);

    sizeContainer();

    const observer = new ResizeObserver(sizeContainer);
    observer.observe(containerEl);

    canvas.on('object:modified', (event) => {
      const target = event.target as FabricImage | undefined;
      if (!target) return;
      onTransformChange({
        left: target.left ?? 0,
        top: target.top ?? 0,
        scaleX: target.scaleX ?? 1,
        scaleY: target.scaleY ?? 1,
        angle: target.angle ?? 0,
        opacity: target.opacity ?? 1,
      });
    });

    return () => {
      observer.disconnect();
      canvas.dispose();
      fabricRef.current = null;
      imageRef.current = null;
      setReady(false);
    };
  }, [canvasRef, containerRef, onTransformChange]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !ready) return;
    const image = imageRef.current;
    if (image) {
      image.set({
        left: transform.left,
        top: transform.top,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
        angle: transform.angle,
        opacity: transform.opacity,
        selectable: !locked,
        evented: !locked,
        lockMovementX: locked,
        lockMovementY: locked,
        lockScalingX: locked,
        lockScalingY: locked,
        lockRotation: locked,
        hasControls: !locked,
      });
      image.setCoords();
      canvas.requestRenderAll();
    }
  }, [transform, locked, ready]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !ready || !imageUrl) {
      if (imageRef.current && canvas) {
        canvas.remove(imageRef.current);
        imageRef.current = null;
        canvas.requestRenderAll();
      }
      return;
    }

    let cancelled = false;
    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (cancelled || !fabricRef.current) return;
        if (imageRef.current) {
          fabricRef.current.remove(imageRef.current);
        }
        const container = containerRef.current;
        const cw = container?.clientWidth ?? 640;
        const ch = container?.clientHeight ?? 360;
        const fitScale = Math.min(cw / img.width, ch / img.height) * 0.8;

        img.set({
          left: cw / 2,
          top: ch / 2,
          originX: 'center',
          originY: 'center',
          scaleX: fitScale,
          scaleY: fitScale,
          opacity: transform.opacity,
          angle: transform.angle,
          selectable: !locked,
          evented: !locked,
          hasControls: !locked,
          lockMovementX: locked,
          lockMovementY: locked,
          lockScalingX: locked,
          lockScalingY: locked,
          lockRotation: locked,
        });
        fabricRef.current.add(img);
        fabricRef.current.requestRenderAll();
        imageRef.current = img;
        onImageLoaded?.(img.width ?? 0, img.height ?? 0);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [imageUrl, ready, containerRef, locked, transform.angle, transform.opacity, onImageLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${locked ? 'cursor-default' : 'touch-none'}`}
      style={{ pointerEvents: locked ? 'none' : 'auto' }}
    />
  );
}