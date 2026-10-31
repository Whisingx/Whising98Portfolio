const PRE_ASSIGNED = [
  { id: 1, name: "DSC_0019.JPG", type: "image/jpeg", sizeKB: 342, url: "./photos/bbd/DSC_0019.JPG" },
  { id: 2, name: "DSC_0022.JPG", type: "image/jpeg", sizeKB: 3493, url: "./photos/bbd/DSC_0022.JPG" },
  { id: 3, name: "DSC_0031.JPG", type: "image/jpeg", sizeKB: 5056, url: "./photos/bbd/DSC_0031.JPG" },
  { id: 4, name: "DSC_0034.JPG", type: "image/jpeg", sizeKB: 4256, url: "./photos/bbd/DSC_0034.JPG" },
  { id: 5, name: "DSC_0036.JPG", type: "image/jpeg", sizeKB: 6028, url: "./photos/bbd/DSC_0036.JPG" },
  { id: 6, name: "DSC_0054.JPG", type: "image/jpeg", sizeKB: 3250, url: "./photos/bbd/DSC_0054.JPG" },
  { id: 7, name: "DSC_0058.JPG", type: "image/jpeg", sizeKB: 2907, url: "./photos/bbd/DSC_0058.JPG" },
  { id: 8, name: "DSC_0087.JPG", type: "image/jpeg", sizeKB: 654, url: "./photos/bbd/DSC_0087.JPG" },
  { id: 9, name: "DSC_0088.JPG", type: "image/jpeg", sizeKB: 321, url: "./photos/bbd/DSC_0088.JPG" },
  { id: 10, name: "DSC_0094.JPG", type: "image/jpeg", sizeKB: 643, url: "./photos/bbd/DSC_0094.JPG" },
  { id: 11, name: "DSC_0108.JPG", type: "image/jpeg", sizeKB: 231, url: "./photos/bbd/DSC_0108.JPG" },
  { id: 12, name: "DSC_0131.JPG", type: "image/jpeg", sizeKB: 141, url: "./photos/bbd/DSC_0131.JPG" },
  { id: 13, name: "DSC_0132.JPG", type: "image/jpeg", sizeKB: 442, url: "./photos/bbd/DSC_0132.JPG" },
  { id: 14, name: "DSC_0135.JPG", type: "image/jpeg", sizeKB: 923, url: "./photos/bbd/DSC_0135.JPG" },
  { id: 14, name: "DSC_0141.JPG", type: "image/jpeg", sizeKB: 923, url: "./photos/bbd/DSC_0141.JPG" },
  { id: 15, name: "DSC_0162.JPG", type: "image/jpeg", sizeKB: 431, url: "./photos/bbd/DSC_0162.JPG" },
  { id: 16, name: "DSC_0164.JPG", type: "image/jpeg", sizeKB: 621, url: "./photos/bbd/DSC_0164.JPG" },
  { id: 17, name: "DSC_0165.JPG", type: "image/jpeg", sizeKB: 428, url: "./photos/bbd/DSC_0165.JPG" },
  { id: 18, name: "DSC_0174.JPG", type: "image/jpeg", sizeKB: 428, url: "./photos/bbd/DSC_0174.JPG" },
  { id: 19, name: "DSC_0182.JPG", type: "image/jpeg", sizeKB: 428, url: "./photos/bbd/DSC_0182.JPG" },
  { id: 20, name: "DSC_0185.JPG", type: "image/jpeg", sizeKB: 428, url: "./photos/bbd/DSC_0185.JPG" },
  { id: 21, name: "DSC_0198.JPG", type: "image/jpeg", sizeKB: 428, url: "./photos/bbd/DSC_0198.JPG" }
];

let photos = [];
let current = 0;
let slideshowTimer = null;

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function loadPreAssignedPhotos() {
  photos = [];
  
  PRE_ASSIGNED.forEach((img) => {
    const bytes = img.sizeKB * 1024;
    photos.push({
      name: img.name,
      type: img.type,
      size: formatSize(bytes),
      rawBytes: bytes,
      url: img.url,
      isPreassigned: true
    });
  });
  
  rebuildThumbs();
  if (photos.length > 0) {
    showPhoto(0);
  } else {
    clearViewer();
  }
}

function removeCurrentPhoto() {
  if (photos.length === 0) return;
  
  photos.splice(current, 1);
  
  if (current >= photos.length) current = photos.length - 1;
  rebuildThumbs();
  if (photos.length > 0) {
    showPhoto(current);
  } else {
    clearViewer();
  }
}

function rebuildThumbs() {
  const strip = document.getElementById('thumb-strip');
  strip.innerHTML = '';

  if (photos.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'thumb-empty';
    empty.innerHTML = 'No photos.<br>Gallery is empty.';
    strip.appendChild(empty);
    document.getElementById('status-count').textContent = '0 photos';
    document.getElementById('info-total').textContent = '0';
    return;
  }

  photos.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'thumb' + (i === current ? ' active' : '');
    div.id = 'thumb-' + i;
    div.onclick = () => showPhoto(i);

    const img = document.createElement('img');
    img.src = p.url;
    img.alt = p.name;
    img.onerror = () => {
      img.style.objectFit = 'contain';
      img.style.background = '#c0c0c0';
    };

    const num = document.createElement('div');
    num.className = 'thumb-num';
    num.textContent = i + 1;

    div.appendChild(img);
    div.appendChild(num);
    strip.appendChild(div);
  });

  const totalCount = photos.length;
  document.getElementById('status-count').textContent = totalCount + ' photo' + (totalCount !== 1 ? 's' : '');
  document.getElementById('info-total').textContent = totalCount;
}

function showPhoto(i) {
  if (photos.length === 0) return;
  i = ((i % photos.length) + photos.length) % photos.length;
  current = i;
  const p = photos[i];

  const viewerImg = document.getElementById('viewer-img');
  const placeholder = document.getElementById('viewer-placeholder');
  
  viewerImg.style.opacity = '0';
  viewerImg.style.display = 'block';
  placeholder.style.display = 'none';
  
  viewerImg.src = p.url;
  viewerImg.onload = () => { 
    viewerImg.style.opacity = '1'; 
  };
  viewerImg.onerror = () => {
    viewerImg.style.display = 'none';
    placeholder.style.display = 'block';
    placeholder.innerHTML = 'Image failed to load.<br>The file might be unavailable.';
    placeholder.style.color = '#aaa';
  };

  document.querySelectorAll('.thumb').forEach((t, idx) => {
    t.classList.toggle('active', idx === i);
  });
  
  const activeThumb = document.getElementById('thumb-' + i);
  if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  document.getElementById('info-name').textContent = p.name;
  let fileTypeDisplay = (p.type.split('/')[1] || p.type).toUpperCase();
  if (fileTypeDisplay.includes('JPEG')) fileTypeDisplay = 'JPEG';
  else if (fileTypeDisplay.includes('PNG')) fileTypeDisplay = 'PNG';
  document.getElementById('info-type').textContent = fileTypeDisplay;
  document.getElementById('info-size').textContent = p.size;
  document.getElementById('info-index').textContent = (i + 1) + ' of ' + photos.length;
  document.getElementById('info-total').textContent = photos.length;
  document.getElementById('status-file').textContent = p.name;
}

function clearViewer() {
  const viewerImg = document.getElementById('viewer-img');
  const placeholder = document.getElementById('viewer-placeholder');
  viewerImg.style.display = 'none';
  viewerImg.src = '';
  viewerImg.style.opacity = '1';
  placeholder.style.display = 'block';
  placeholder.innerHTML = 'No photos loaded.<br>Gallery is empty.';
  placeholder.style.color = '#aaa';
  document.getElementById('info-name').textContent = '—';
  document.getElementById('info-type').textContent = '—';
  document.getElementById('info-size').textContent = '—';
  document.getElementById('info-index').textContent = '—';
  document.getElementById('info-total').textContent = '0';
  document.getElementById('status-file').textContent = 'No file selected';
}

function prevPhoto() { 
  if (photos.length) showPhoto(current - 1); 
}
function nextPhoto() { 
  if (photos.length) showPhoto(current + 1);
}

function toggleSlideshow() {
  const btn  = document.getElementById('btn-slide');
  const info = document.getElementById('info-slide');
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    btn.textContent = 'Slideshow';
    info.textContent = 'Off';
  } else {
    slideshowTimer = setInterval(() => {
      if (photos.length > 0) {
        nextPhoto();
      } else {
        if (slideshowTimer) {
          clearInterval(slideshowTimer);
          slideshowTimer = null;
          btn.textContent = 'Slideshow';
          info.textContent = 'Off';
        }
      }
    }, 3000);
    btn.textContent = 'Stop';
    info.textContent = 'On';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Delete') {
    e.preventDefault();
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPhoto();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevPhoto();
  if (e.key === 'Delete') removeCurrentPhoto();
});

loadPreAssignedPhotos();

document.getElementById('viewer-img').addEventListener('load', function() {
  const placeholder = document.getElementById('viewer-placeholder');
  if (placeholder.style.display !== 'none') {
    placeholder.style.display = 'none';
  }
  this.style.opacity = '1';
});

window.addEventListener('beforeunload', () => {
  if (slideshowTimer) clearInterval(slideshowTimer);
});