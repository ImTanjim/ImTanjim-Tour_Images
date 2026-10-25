import { Image, Sparkles } from 'lucide-react';

const Navbar = () => {
  return (
    <nav
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand: Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(168, 85, 247, 0.35)',
            }}
          >
            <Image size={20} strokeWidth={2} stroke="currentColor" />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #fff, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            KBT Photo Gallery
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            height: 28,
            width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.18), transparent)',
          }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 2,
          }}>
            <Sparkles size={14} strokeWidth={2} color="#a855f7" style={{ marginBottom: 2 }} />
            <h2 style={{
              fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
              fontWeight: 600,
              color: "#a855f7",
              textAlign: "right",
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              margin: 0,
              lineHeight: 1.2,
            }}>
            ✨ প্রতিটি মুহূর্ত বিশেষ
            </h2>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;