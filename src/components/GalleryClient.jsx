// src/components/GalleryClient.jsx

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function GalleryClient({ images }) {
  const [items, setItems] = useState([]);
  const [factors, setFactors] = useState({});
  const [transforms, setTransforms] = useState({});
  const [styles, setStyles] = useState({});
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 控制是否在生产环境下忽略 EXIF 方向
  const orientationCSS = process.env.NODE_ENV === 'production'
    ? 'image-orientation: none;'
    : '';

  const BASE = 270;
  const MIN_F = 0.9;
  const MAX_F = 1.1;
  const ANGLE_RANGE = 10; // 最大倾斜度 ±10°

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function genTransformMaps(list) {
    const oMap = {}, rMap = {};
    list.forEach(img => {
      const x = (Math.random() * 20 - 10).toFixed(2);
      const y = (Math.random() * 20 - 10).toFixed(2);
      oMap[img.src] = `translate(${x}px, ${y}px)`;
      const angle = (Math.random() * ANGLE_RANGE * 2 - ANGLE_RANGE).toFixed(2);
      rMap[img.src] = `rotate(${angle}deg)`;
    });
    return { oMap, rMap };
  }

  useEffect(() => {
    setItems(shuffle(images));
    const fMap = {};
    images.forEach(img => {
      fMap[img.src] = MIN_F + Math.random() * (MAX_F - MIN_F);
    });
    setFactors(fMap);

    const { oMap, rMap } = genTransformMaps(images);
    setTransforms(oMap);
    setTimeout(() => {
      const fullMap = {};
      images.forEach(img => {
        fullMap[img.src] = `${oMap[img.src]} ${rMap[img.src]}`;
      });
      setTransforms(fullMap);
    }, 100);
  }, [images]);

  useEffect(() => {
    const { oMap, rMap } = genTransformMaps(items);
    setTransforms(oMap);
    setTimeout(() => {
      const fullMap = {};
      items.forEach(img => {
        fullMap[img.src] = `${oMap[img.src]} ${rMap[img.src]}`;
      });
      setTransforms(fullMap);
    }, 100);
  }, [items]);

  function handleLoad(e, src) {
    if (styles[src]) return;
    const img = e.target;
    const size = BASE * factors[src];
    const style = img.naturalWidth >= img.naturalHeight
      ? { width: `${size}px`, height: 'auto' }
      : { height: `${size}px`, width: 'auto' };
    setStyles(prev => ({ ...prev, [src]: style }));
  }

  function Lightbox({ src, onClose }) {
    return createPortal(
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <img
          src={src}
          alt="Preview"
          style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
        />
      </div>,
      document.body
    );
  }

  return (
    <>
      <style>{`
        .gallery-container * { box-sizing: border-box; margin: 0; padding: 0; }
        .gallery-container {
          font-family: 'Homemade Apple', cursive;
          background: url('https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg') repeat;
          background-size: cover;
          padding: 1rem;
          border-radius: 10px;
        }
        .gallery-container .controls {
          text-align: center;
          padding: 20px;
        }
        .gallery-container .controls button {
          margin: 0 10px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #f5f0e1;
          color: #444;
          border: 2px solid #d2b48c;
          border-radius: 10px;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .gallery-container .controls button:hover {
          background-color: #e6d5b8;
          transform: translateY(-2px);
        }
        .gallery-container ul {
          padding: 20px;
          list-style: none;
          text-align: center;
        }
        .gallery-container ul li {
          display: inline-block;
          margin: 0 20px 20px 0;
          border: 12px solid #fff;
          border-radius: 4px;
          background: #fff;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.3);
          position: relative;
          top: 50px;
          transition: transform 0.6s ease, top 0.6s ease, opacity 0.6s ease;
          cursor: zoom-in;
          transform-origin: center center;
        }
        .gallery-container ul li:hover {
          transform: scale(1.05);
          top: 0;
          opacity: 0.9;
          z-index: 1;
        }
        .gallery-container ul li::after {
          content: '';
          position: absolute;
          top: -10px; left: -10px;
          width: 20px; height: 20px;
          background: radial-gradient(circle at 35% 35%, #fff 20%, #ddd 45%, #aaa 75%, #888 100%);
          border: 1px solid #666;
          border-radius: 50%;
          box-shadow: inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4);
          pointer-events: none;
        }
        .gallery-container ul li::before {
          content: '';
          position: absolute;
          top: 8px; left: -2px;
          width: 4px; height: 18px;
          background: linear-gradient(to bottom, #ccc 0%, #999 50%, #666 100%);
          border-radius: 2px;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.3);
          transform: rotate(15deg);
          pointer-events: none;
        }
        .gallery-container .photo img {
          ${orientationCSS}
          display: block;
          border-radius: 2px;
          filter: contrast(1.1) brightness(0.95) saturate(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .gallery-container .caption {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .gallery-container ul li:hover .caption {
          opacity: 1;
          transition-delay: 0.8s;
        }
        @media (max-width: 768px) {
          .gallery-container { transform: scale(0.6); transform-origin: top center; }
        }
      `}</style>

      <div className="gallery-container">
        <div className="controls">
          <button onClick={() => setItems(shuffle(items))}>随机排序</button>
          <button onClick={() => setItems([...images])}>顺序排列</button>
          <button onClick={() => setItems(prev => [...prev].reverse())}>倒序排列</button>
        </div>
        <ul>
          {items.map(img => (
            <li
              key={img.src}
              style={{ transform: transforms[img.src] }}
              onClick={() => { setIsOpen(true); setLightboxSrc(img.src); }}
            >
              <div className="photo">
                <img
                  src={img.src}
                  alt={img.caption}
                  onLoad={e => handleLoad(e, img.src)}
                  style={styles[img.src] || {}}
                />
                <div className="caption">{img.caption}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && <Lightbox src={lightboxSrc} onClose={() => setIsOpen(false)} />}
    </>
  );
}
