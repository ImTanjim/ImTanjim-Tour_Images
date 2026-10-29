import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Lightbox = ({
  photo,
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  /* ================== KEYBOARD NAVIGATION ================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
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

  /* ================== SAFETY GUARD ================== */
  // Category switches can briefly leave `photo` undefined — bail out
  // instead of crashing on `photo.download_url` below.
  if (!photo) return null;

  const btnStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    fontSize: 36,
    width: 52,
    height: 52,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    flexShrink: 0,
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
        background: 'rgba(0,0,0,0.93)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ================== CLOSE BUTTON ================== */}
      <button
        onClick={onClose}
        style={{
          ...btnStyle,
          position: 'absolute',
          top: 20,
          right: 24,
          fontSize: 22,
          zIndex: 1001,
        }}
      >
        ✕
      </button>

      {/* ================== LEFT ARROW ================== */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            'rgba(255,255,255,0.25)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')
        }
        style={{
          ...btnStyle,
          position: 'absolute',
          left: 16,
          zIndex: 1001,
        }}
      >
        ‹
      </button>

      {/* ================== IMAGE ================== */}
      <AnimatePresence mode="wait">
        <motion.img
          key={photo.download_url}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          src={photo.download_url}
          alt={photo.name}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '88vw',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: 12,
            boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
            userSelect: 'none',
          }}
        />
      </AnimatePresence>

      {/* ================== RIGHT ARROW ================== */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            'rgba(255,255,255,0.25)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')
        }
        style={{
          ...btnStyle,
          position: 'absolute',
          right: 16,
          zIndex: 1001,
        }}
      >
        ›
      </button>

      {/* ================== COUNTER & NAME ================== */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.65)',
          fontSize: 13,
          pointerEvents: 'none',
        }}
      >
        <div style={{ marginBottom: 4 }}>{photo.name}</div>
        <div>
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </motion.div>
  );
};

export default Lightbox;
