import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
} from 'lucide-react';

const Lightbox = ({
  photo,
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  /* ================== ZOOM & PAN STATE ================== */
  const [isZoomed, setIsZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const imgRef = useRef(null);
  const paneRef = useRef(null);

  /* ================== KEYBOARD NAVIGATION ================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        setIsZoomed(false);
      }
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  /* ================== SCROLL LOCK ================== */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  /* ================== RESET ZOOM WHEN PHOTO CHANGES ================== */
  useEffect(() => {
    setIsZoomed(false);
    setPan({ x: 0, y: 0 });
  }, [currentIndex]);

  /* ================== DRAG TO PAN (when zoomed) ================== */
  const handlePaneMouseDown = useCallback(
    (e) => {
      if (!isZoomed || e.button !== 0) return;
      e.preventDefault();
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartPan(pan);
    },
    [isZoomed, pan],
  );

  const handleWindowMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setPan({ x: startPan.x + dx, y: startPan.y + dy });
    },
    [isDragging, startPos, startPan],
  );

  const handleWindowMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* ================== SAFETY GUARD ================== */
  // Category switches can briefly leave `photo` undefined — bail out
  // instead of crashing on `photo.download_url` below.
  if (!photo) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === photos.length - 1;
  const zoomScale = isZoomed ? 1.8 : 1;

  const ctrl = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: 14,
    width: 46,
    height: 46,
    background: 'rgba(255, 255, 255, 0.10)',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
    flexShrink: 0,
  };

  const navCtrl = {
    ...ctrl,
    width: 56,
    height: 56,
    fontSize: 22,
    background: 'rgba(15, 23, 42, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background:
          'radial-gradient(circle at center, #161c2b 0%, #0a0f1a 55%, #070a12 100%)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        outline: 'none',
      }}
    >
      {/* ================== TOP CONTROLS: ZOOM + CLOSE ================== */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 28px',
          zIndex: 1201,
          pointerEvents: 'none',
        }}
      >
        {/* Zoom button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
            if (!isZoomed) setPan({ x: 0, y: 0 });
          }}
          style={{
            ...ctrl,
            pointerEvents: 'auto',
            padding: '0 12px',
            minWidth: 120,
            justifyContent: 'center',
          }}
        >
          {isZoomed ? (
            <Minimize size={17} strokeWidth={2} />
          ) : (
            <Maximize size={17} strokeWidth={2} />
          )}
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              opacity: isZoomed ? 0.9 : 0.85,
            }}
          >
            {isZoomed ? 'Reset Zoom' : 'Zoom'}
          </span>
        </button>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            ...ctrl,
            pointerEvents: 'auto',
            width: 44,
            height: 44,
          }}
        >
          <X size={19} strokeWidth={2} />
        </button>
      </div>
      {/* ================== IMAGE PANE (zoom + pan) ================== */}
      <div
        ref={paneRef}
        onMouseDown={handlePaneMouseDown}
        className={`zoom-pane ${isZoomed ? 'is-zoomed' : ''} ${
          isDragging ? 'is-dragging' : ''
        }`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            ref={imgRef}
            key={photo.download_url}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            src={photo.download_url}
            alt={photo.name}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsZoomed((prev) => !prev);
              if (!isZoomed) setPan({ x: 0, y: 0 });
            }}
            draggable={false}
            style={{
              maxWidth: '86vw',
              maxHeight: '78vh',
              objectFit: 'contain',
              borderRadius: 14,
              boxShadow: isZoomed
                ? '0 0 0 rgba(0,0,0,0)'
                : '0 30px 100px rgba(0,0,0,0.7), 0 0 24px rgba(0,0,0,0.45)',
              userSelect: 'none',
              transformOrigin: 'center center',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
              transition: isDragging
                ? 'none'
                : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'contrast(1.03) saturate(1.04)',
            }}
          />
        </AnimatePresence>
      </div>

      {/* ================== PREVIOUS ================== */}
      <button
        disabled={isFirst}
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.95';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        style={{
          ...navCtrl,
          position: 'absolute',
          left: 22,
          zIndex: 1201,
          pointerEvents: 'auto',
          opacity: isFirst ? 0.4 : 0.8,
        }}
      >
        <ChevronLeft size={26} strokeWidth={2} />
        <span
          style={{
            marginLeft: 10,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
          }}
        >
          Previous
        </span>
      </button>

      {/* ================== NEXT ================== */}
      <button
        disabled={isLast}
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.95';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        style={{
          ...navCtrl,
          position: 'absolute',
          right: 22,
          zIndex: 1201,
          pointerEvents: 'auto',
          flexDirection: 'row-reverse',
          opacity: isLast ? 0.4 : 0.8,
        }}
      >
        <span
          style={{
            marginRight: 10,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
          }}
        >
          Next
        </span>
        <ChevronRight size={26} strokeWidth={2} />
      </button>

      {/* ================== COUNTER & NAME ================== */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.75)',
          fontSize: 13,
          pointerEvents: 'none',
          letterSpacing: '-0.01em',
        }}
      >
        <div
          style={{
            marginBottom: 6,
            fontSize: 15,
            color: '#fff',
            fontWeight: 600,
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          {photo.name}
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '4px 12px',
            borderRadius: 20,
            display: 'inline-block',
            backdropFilter: 'blur(6px)',
          }}
        >
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* ================== DRAG / ZOOM HINT ================== */}
      {!isZoomed && (
        <div
          style={{
            position: 'absolute',
            bottom: 86,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.45)',
            fontSize: 11.5,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          Zoom &bull; double-click to toggle &bull; drag to pan
        </div>
      )}
    </motion.div>
  );
};

export default Lightbox;
