// src/components/GalleryClient.jsx
import { useState, useEffect } from 'react';

export default function GalleryClient({ images }) {
  // items: 当前渲染顺序的数组
  const [items, setItems] = useState([]);
  // factors: { [src]: 随机尺寸因子 }
  const [factors, setFactors] = useState({});
  // transforms: { [src]: 随机 translate+rotate  }
  const [transforms, setTransforms] = useState({});
  // styles:    { [src]: { width: '...', height: '...' } }
  const [styles, setStyles] = useState({});
  // lightbox
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const BASE = 270, MIN_F = 0.9, MAX_F = 1.1;

  // 初始化：images 更新时
  useEffect(() => {
    // 同步 items
    setItems(images);
    // 只做一次的：为每张图生成一个固定因子
    const fMap = {};
    images.forEach(img => {
      fMap[img.src] = MIN_F + Math.random() * (MAX_F - MIN_F);
    });
    setFactors(fMap);

    // 同步一次 transforms
    const tMap = {};
    images.forEach(img => {
      const a = (Math.random()*20 - 10).toFixed(2);
      const x = (Math.random()*20 - 10).toFixed(2);
      const y = (Math.random()*20 - 10).toFixed(2);
      tMap[img.src] = `translate(${x}px, ${y}px) rotate(${a}deg)`;
    });
    setTransforms(tMap);
    // **不再清空 styles**
  }, [images]);

  // 每次 items 改变时，只更新 transforms（重排钉图效果）
  useEffect(() => {
    const tMap = {};
    items.forEach(img => {
      const a = (Math.random()*20 - 10).toFixed(2);
      const x = (Math.random()*20 - 10).toFixed(2);
      const y = (Math.random()*20 - 10).toFixed(2);
      tMap[img.src] = `translate(${x}px, ${y}px) rotate(${a}deg)`;
    });
    setTransforms(tMap);
    // **不清空 styles，保持初次加载的尺寸**
  }, [items]);

  // 洗牌
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 图片 onLoad 时只执行一次，按 factors[src] 计算样式
  function onLoad(e, src) {
    if (styles[src]) return;  // 已算过就跳过
    const img = e.target;
    const { naturalWidth: w, naturalHeight: h } = img;
    const f = factors[src];
    const t = BASE * f;
    const style = w >= h
      ? { width: `${t}px`, height: 'auto' }
      : { height: `${t}px`, width: 'auto' };
    setStyles(prev => ({ ...prev, [src]: style }));
  }

  return (
    <>
      <style>{`
        .gallery-container * { box-sizing:border-box; margin:0; padding:0 }
        .gallery-container {
          font-family:'Homemade Apple',cursive;
          background:url('https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg')repeat;
          background-size:cover;
          padding:1rem;border-radius:10px;
        }
        .gallery-container .controls { text-align:center; padding:20px }
        .gallery-container .controls button {
          margin:0 10px; padding:10px 20px; font-size:16px;
          background:#f5f0e1; color:#444;
          border:2px solid #d2b48c; border-radius:10px;
          box-shadow:2px 2px 6px rgba(0,0,0,0.2);
          transition:all .3s ease; cursor:pointer;
        }
        .gallery-container .controls button:hover {
          background:#e6d5b8; transform:translateY(-2px);
        }
        .gallery-container ul {
          padding:20px; list-style:none; text-align:center;
        }
        .gallery-container ul li {
          display:inline-block; margin:0 20px 20px 0;
          border:12px solid #fff; border-radius:4px; background:#fff;
          box-shadow:inset 0 2px 4px rgba(0,0,0,0.1),0 10px 20px rgba(0,0,0,0.3);
          position:relative; cursor:zoom-in; transition:all .6s ease;
          top:50px;
        }
        .gallery-container ul li:hover {
          transform:scale(1.05); top:0; opacity:.9; z-index:1;
        }
        .gallery-container ul li::after { /* 钉子伪元素 */ }
        .gallery-container ul li::before { /* 钉子伪元素 */ }
        .gallery-container .photo { position:relative; }
        .gallery-container .photo img {
          display:block; border-radius:2px;
          filter:contrast(1.1) brightness(0.95) saturate(1.2);
          box-shadow:0 4px 8px rgba(0,0,0,0.2);
        }
        .gallery-container .caption {
          position:absolute; top:0; left:0; width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,0.6); color:#fff; font-size:1rem;
          opacity:0; transition:opacity .3s ease;
        }
        .gallery-container ul li:hover .caption {
          opacity:1; transition-delay:.8s;
        }
        .gallery-container #lightbox {
          display:none; position:fixed; inset:0;
          background:rgba(0,0,0,0.8);
          justify-content:center; align-items:center; z-index:9999;
        }
        .gallery-container #lightbox.open {
          display:flex;
        }
        .gallery-container #lightbox img {
          max-width:90vw; max-height:90vh;
          box-shadow:0 0 30px rgba(0,0,0,0.6);
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
              onClick={() => { setLightboxSrc(img.src); setIsOpen(true); }}
            >
              <div className="photo">
                <img
                  src={img.src}
                  alt={img.caption}
                  onLoad={e => onLoad(e, img.src)}
                  style={styles[img.src] || {}}
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
        >
          <img src={lightboxSrc} alt="放大图" />
        </div>
      </div>
    </>
  );
}
