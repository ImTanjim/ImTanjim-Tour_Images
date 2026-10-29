const Navbar = () => {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(15, 15, 25, 0.75)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 0',
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
        {/* বাম পাশের অংশ: Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            JOY
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            KBT Gallery
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            height: 30,
            width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)',
          }} />
          <h2 style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            fontWeight: 400,
            color: "#a855f7",
            textAlign: "right",
            letterSpacing: "-0.02em",
            fontStyle: "italic",
            margin: 0,
          }}>
            ✨ প্রতিটি মুহূর্ত বিশেষ
          </h2>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
