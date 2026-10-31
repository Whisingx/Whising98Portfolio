const PRE_ASSIGNED = [
  { id: 1, name: "boba-bash-6cd5cd70c113.webp", type: "image/webp", sizeKB: 342, url: "./photos/bbgrn/boba-bash-6cd5cd70c113.webp" },
  { id: 2, name: "boba-bash-6f7d3d4c6a13.webp", type: "image/webp", sizeKB: 3493, url: "./photos/bbgrn/boba-bash-6f7d3d4c6a13.webp" },
  { id: 3, name: "boba-bash-8ad0786645a8.webp", type: "image/webp", sizeKB: 5056, url: "./photos/bbgrn/boba-bash-8ad0786645a8.webp" },
  { id: 4, name: "boba-bash-28a454d9755e.webp", type: "image/webp", sizeKB: 4256, url: "./photos/bbgrn/boba-bash-28a454d9755e.webp" },
  { id: 5, name: "boba-bash-084c429e4971.webp", type: "image/webp", sizeKB: 6028, url: "./photos/bbgrn/boba-bash-084c429e4971.webp" },
  { id: 6, name: "boba-bash-affd184c721d.webp", type: "image/webp", sizeKB: 3250, url: "./photos/bbgrn/boba-bash-affd184c721d.webp" },
  { id: 7, name: "boba-bash-bcc2b5dad78a.webp", type: "image/webp", sizeKB: 2907, url: "./photos/bbgrn/boba-bash-bcc2b5dad78a.webp" },
  { id: 8, name: "boba-bash-ca73c0535a65.webp", type: "image/webp", sizeKB: 421, url: "./photos/bbgrn/boba-bash-ca73c0535a65.webp" },
  { id: 9, name: "boba-bash-cf7611dbc9c7.webp", type: "image/webp", sizeKB: 432, url: "./photos/bbgrn/boba-bash-cf7611dbc9c7.webp" },
  { id: 10, name: "boba-bash-ccba645e1a41.webp", type: "image/webp", sizeKB: 321, url: "./photos/boba-bash-ccba645e1a41.webp" },
  { id: 11, name: "boba-bash-f1b902e96c52.webp", type: "image/webp", sizeKB: 867, url: "./photos/boba-bash-f1b902e96c52.webp" }
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