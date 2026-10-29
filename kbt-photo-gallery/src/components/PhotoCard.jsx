import { useState } from 'react';
import { motion } from 'framer-motion';

const PhotoCard = ({ photo, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false); 

  // JsDeliver URL 
  const getImgUrl = () => {
    const filePath = photo.path;

    return `https://cdn.jsdelivr.net/gh/ImTanjim/ImTanjim-Tour_Images@main/${filePath}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.05)',
        height: 300,
      }}
    >
      {/* ================== LOADER ================== */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 13,
          }}
        >
          Loading...
        </div>
      )}

      {/* ================== IMAGE ================== */}
      <img
        src={getImgUrl()}
        alt={photo.name}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* ================== HOVER OVERLAY ================== */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 20,
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: '#a5b4fc', fontSize: 12 }}>
          {photo.category}
        </span>
        <h3
          style={{ color: '#fff', margin: '5px 0 0', fontSize: 15 }}
        >
          {photo.name}
        </h3>
      </motion.div>
    </motion.div>
  );
};

export default PhotoCard;
