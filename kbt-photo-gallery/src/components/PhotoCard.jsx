import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Maximize } from 'lucide-react';

const PhotoCard = ({ photo, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getImgUrl = () => {
    const filePath = photo.path;
    return `https://cdn.jsdelivr.net/gh/ImTanjim/ImTanjim-Tour_Images@main/${filePath}`;
  };

  const displayName = photo.name || 'Image';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-panel"
      style={{
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: 320,
        border: '1px solid rgba(148, 163, 184, 0.10)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
      }}
    >
      {!isLoaded && (
        <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      )}

      <img
        src={getImgUrl()}
        alt={displayName}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.45s ease, transform 0.5s ease',
          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          filter: 'contrast(1.04) saturate(0.94)',
        }}
      />

      {/* Hover overlay with view/zoom hint */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0), rgba(15,23,42,0.55))',
            pointerEvents: 'none',
            transition: 'background 0.3s ease',
          }}
        />
      )}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              borderRadius: 12,
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <Maximize size={17} strokeWidth={2} />
          </motion.div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#e2e8f0',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          textShadow: '0 2px 10px rgba(15,23,42,0.8)',
          backdropFilter: 'blur(6px)',
          padding: '0 8px',
          borderRadius: 10,
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            background: 'rgba(148, 163, 184, 0.18)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            fontSize: 9,
            color: '#dbeafe',
            flexShrink: 0,
          }}
        >
          •
        </span>
        <span
          style={{
            whiteSpace: 'pre-line',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {displayName}
        </span>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
