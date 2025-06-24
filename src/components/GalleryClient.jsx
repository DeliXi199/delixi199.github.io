import { useState, useEffect } from 'react';

export default function GalleryClient({ images }) {
  const [items, setItems] = useState([]);
  const [transforms, setTransforms] = useState([]);
  const [imageStyles, setImageStyles] = useState({});
  const [factors, setFactors] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 随机尺寸 & 旋转常量
  const BASE_LONG = 270;
  const MIN_F = 0.9;
  const MAX_F = 1.1;

  // 初始化 items 和尺寸因子
  useEffect(() => {
    setItems(images);
    // 为每张图片生成一个固定的随机尺寸因子
    const f = images.map(() => MIN_F + Math.random() * (MAX_F - MIN_F));
    setFactors(f);
  }, [images]);

  // 每次 items 改变时，生成随机旋转/偏移
  useEffect(() => {
    const newTransforms = items.map(() => {
      const angle = (Math.random() * 20 - 10).toFixed(2);
      const offsetX = (Math.random() * 20 - 10).toFixed(2);
      const offsetY = (Math.random() * 20 - 10).toFixed(2);
      return `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`;
    });
    setTransforms(newTransforms);
    // 保留 imageStyles，避免重复重置尺寸
  }, [items]);

  // Fisher–Yates 洗牌
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 图片加载完成后，根据预先生成的因子调整尺寸
  function handleImageLoad(idx, e) {
    const img = e.target;
    const { naturalWidth: w, naturalHeight: h } = img;
    const factor = factors[idx] || 1;
    const target = BASE_LONG * factor;
    const style = {};
    if (w >= h) {
      style.width = `${target}px`;
      style.height = 'auto';
    } else {
      style.height = `${target}px`;
      style.width = 'auto';
    }
    setImageStyles(prev => ({ ...prev, [idx]: style }));
  }

  return (
    <>
      <style>{`
        .gallery-container * { box-sizing: border-box; margin:0; padding:0 }
        .gallery-container {
          font-family: 'Homemade Apple', cursive;
          background: url('https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg') repeat;
          background-size: cover;
          padding: 1rem;
          border-radius: 10px;
        }
        .gallery-container .controls { text-align:center; padding:20px }
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
          font-family: 'Homemade Apple', cursive;
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
          transform-origin: center bottom;
          transition: all .6s ease;
          cursor: zoom-in;
        }
        .gallery-container ul li:hover {
          transform: scale(1.05);
          top: 0;
          opacity: .9;
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
        .gallery-container .photo { position: relative; }
        .gallery-container .photo img {
          display: block;
          border-radius: 2px;
          filter: contrast(1.1) brightness(0.95) saturate(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          pointer-events: none;
        }
        .gallery-container .caption {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
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
        .gallery-container #lightbox {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .gallery-container #lightbox.open {
          display: flex;
        }
        .gallery-container #lightbox img {
          max-width: 90vw;
          max-height: 90vh;
          box-shadow: 0 0 30px rgba(0,0,0,0.6);
        }
      `}</style>

      <div className="gallery-container">
        <div className="controls">
          <button onClick={() => setItems(shuffle(items))}>随机排序</button>
          <button onClick={() => setItems([...images])}>顺序排列</button>
          <button onClick={() => setItems(prev => [...prev].reverse())}>倒序排列</button>
        </div>

        <ul id="gallery">
          {items.map((img, idx) => (
            <li
              key={idx}
              style={{ transform: transforms[idx] }}
              onClick={() => {
                setLightboxSrc(img.src);
                setIsOpen(true);
              }}
            >
              <div className="photo">
                <img
                  src={img.src}
                  alt={img.caption}
                  onLoad={e => handleImageLoad(idx, e)}
                  style={imageStyles[idx] || {}}
                />
                <div className="caption">{img.caption}</div>
              </div>
            </li>
          ))}
        </ul>

        <div
          id="lightbox"
          className={isOpen ? 'open' : ''}
          onClick={() => setIsOpen(false)}
          tabIndex={0}
          onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}
        >
          <img id="lightbox-img" src={lightboxSrc} alt="放大图" />
        </div>
      </div>
    </>
  );
}
