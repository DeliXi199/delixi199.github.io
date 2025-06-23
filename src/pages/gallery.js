// public/scripts/gallery.js
const ul = document.getElementById('gallery');
const originalItems = Array.from(ul.children);
let currentItems = [...originalItems];

const BASE_LONG = 300, MIN_F = 0.9, MAX_F = 1.1;

function applyRandomSize() {
  document.querySelectorAll('.photo img').forEach(img => {
    function resize() {
      const { naturalWidth: w, naturalHeight: h } = img;
      const factor = MIN_F + Math.random() * (MAX_F - MIN_F);
      const target = BASE_LONG * factor;
      w >= h ? img.style.width = target + 'px' : img.style.height = target + 'px';
    }
    img.complete ? resize() : img.onload = resize;
  });
}

function applyRandomRotation() {
  document.querySelectorAll('#gallery .photo').forEach(div => {
    const a = (Math.random() * 20 - 10).toFixed(2);
    div.style.transform = `rotate(${a}deg)`;
  });
}

function renderItems(items) {
  ul.innerHTML = '';
  items.forEach(item => ul.appendChild(item.cloneNode(true)));
  applyRandomSize();
  applyRandomRotation();
  bindClickEvents();
}

function bindClickEvents() {
  document.querySelectorAll('#gallery .photo').forEach(div => {
    div.onclick = () => {
      document.getElementById('lightbox').style.display = 'flex';
      document.querySelector('#lightbox img').src = div.querySelector('img').src;
    };
  });
}

currentItems = [...originalItems].sort(() => Math.random() - 0.5);
renderItems(currentItems);

document.getElementById('shuffleBtn').onclick = () => {
  currentItems.sort(() => Math.random() - 0.5);
  renderItems(currentItems);
};

document.getElementById('sortBtn').onclick = () => {
  currentItems = [...originalItems];
  renderItems(currentItems);
};

document.getElementById('reverseBtn').onclick = () => {
  currentItems = [...originalItems].reverse();
  renderItems(currentItems);
};

document.getElementById('lightbox').onclick = () =>
  document.getElementById('lightbox').style.display = 'none';

document.onkeydown = e => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').style.display = 'none';
  }
};
