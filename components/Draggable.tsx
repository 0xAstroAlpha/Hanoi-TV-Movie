import React, { useState, useEffect, useRef } from 'react';

interface DraggableProps {
  children: React.ReactNode;
  initialPos?: { x: number; y: number };
  onPosChange?: (pos: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const Draggable: React.FC<DraggableProps> = ({ 
  children, 
  initialPos = { x: 50, y: 50 }, 
  onPosChange,
  containerRef,
  className = ''
}) => {
  const [pos, setPos] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!dragRef.current) return;
    
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Capture pointer to track movement even if it leaves the element
    dragRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || !dragRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate new position relative to container
    let newX = e.clientX - containerRect.left - offsetRef.current.x;
    let newY = e.clientY - containerRect.top - offsetRef.current.y;

    // Optional: Constrain to container
    const elRect = dragRef.current.getBoundingClientRect();
    const maxX = containerRect.width - elRect.width;
    const maxY = containerRect.height - elRect.height;
    
    // Clamp values (allow slight overhang for better UX)
    newX = Math.max(-20, Math.min(newX, containerRect.width - 20));
    newY = Math.max(-20, Math.min(newY, containerRect.height - 20));

    setPos({ x: newX, y: newY });
    if (onPosChange) onPosChange({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (dragRef.current) {
      dragRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={dragRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ 
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`select-none ${className}`}
    >
      {children}
    </div>
  );
};