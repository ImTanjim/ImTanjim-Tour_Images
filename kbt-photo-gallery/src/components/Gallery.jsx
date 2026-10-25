import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from 'lucide-react';
import { fetchPhotos, fetchFolders } from '../utils/githubApi';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ================== LOAD FOLDERS + PHOTOS (single fetch pass) ================== */
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        setIsLoading(true);
        const folderData = await fetchFolders();

        // Root + every folder fetched in parallel (instead of one-by-one)
        const [rootPhotos, folderPhotoLists] = await Promise.all([
          fetchPhotos(),
          Promise.all(
            folderData.map(async (folder) => {
              const folderPhotos = await fetchPhotos(folder.name);
              return folderPhotos.map((ph) => ({
                ...ph,
                category: folder.name,
              }));
            }),
          ),
        ]);

        if (cancelled) return;

        const rootWithCategory = rootPhotos.map((ph) => ({
          ...ph,
          category: 'Root',
        }));

        setCategories(['All', ...folderData.map((folder) => folder.name)]);
        setPhotos([...rootWithCategory, ...folderPhotoLists.flat()]);
      } catch (error) {
        console.error('Photo load failed:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ================== FILTER PHOTOS (derived state) ================== */
  const filteredPhotos = useMemo(
    () =>
      activeCategory === 'All'
        ? photos
        : photos.filter(
            (photo) =>
              photo.category?.toLowerCase() ===
              activeCategory.toLowerCase(),
          ),
    [photos, activeCategory],
  );

  /* ================== SKELETONS ================== */
  const skeletonCount = 8;
  const skeletons = Array.from({ length: skeletonCount }, (_, i) => i);

  /* ================== LIGHTBOX NAVIGATION ================== */
  const handlePrev = () =>
    setSelectedIndex((i) =>
      i === null || filteredPhotos.length === 0
        ? null
        : (i - 1 + filteredPhotos.length) % filteredPhotos.length,
    );

  const handleNext = () =>
    setSelectedIndex((i) =>
      i === null || filteredPhotos.length === 0
        ? null
        : (i + 1) % filteredPhotos.length,
    );

  return (
    <section
      id="gallery"
      className="fade-in-up"
      style={{
        padding: '48px 20px 70px',
        background:
          'linear-gradient(180deg, #0e1626 0%, #090d17 100%)',
        minHeight: '100vh',
        borderTop: '1px solid rgba(148, 163, 184, 0.12)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* ================== HEADER TITLE ================== */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'rgba(255,255,255,0.85)',
          }}>
            <span style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #fff, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Gallery
            </span>
            <span style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
            }}>
              {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* ================== CATEGORY PILLS ================== */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 30,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? 'pill--active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================== PHOTO GRID ================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 22,
          }}
        >
          {isLoading ? (
            skeletons.map((i) => (
              <div key={i} className="skeleton" style={{ height: 320 }} />
            ))
          ) : filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo, index) => (
              <PhotoCard
                key={photo.path || photo.download_url}
                photo={photo}
                onClick={() => setSelectedIndex(index)}
              />
            ))
          ) : (
            <div
              style={{
                gridColumn: '1/-1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Image size={22} strokeWidth={2} color="rgba(255,255,255,0.45)" />
              </div>
              <p className="empty-msg" style={{ marginBottom: 6 }}>
                কোনো ছবি পাওয়া যায়নি
              </p>
              <p style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                maxWidth: 300,
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                Try selecting another category or check back soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================== LIGHTBOX ================== */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photo={filteredPhotos[selectedIndex]}
            photos={filteredPhotos}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
