import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type DrawerSide = 'left' | 'right' | 'bottom';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  width?: string;
  height?: string;
  children: ReactNode;
  className?: string;
}

const sideConfig: Record<DrawerSide, { position: string; enter: string; exit: string }> = {
  left:   { position: 'top-0 bottom-0 left-0',  enter: 'translate-x-0',  exit: '-translate-x-full' },
  right:  { position: 'top-0 bottom-0 right-0', enter: 'translate-x-0',  exit: 'translate-x-full'  },
  bottom: { position: 'bottom-0 left-0 right-0', enter: 'translate-y-0', exit: 'translate-y-full'  },
};

export function Drawer({
  open,
  onClose,
  side = 'left',
  width = 'w-72',
  height = 'max-h-[85vh]',
  children,
  className = '',
}: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Double rAF ensures the element is painted before the transition starts
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const { position, enter, exit } = sideConfig[side];
  const isHorizontal = side === 'left' || side === 'right';
  const sizeClass = isHorizontal ? `${width} h-full` : `w-full ${height}`;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed ${position} z-50 bg-white shadow-xl ${sizeClass} transition-transform duration-300 ease-out ${visible ? enter : exit} ${className}`}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
