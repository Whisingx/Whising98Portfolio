const appIds = ['about', 'explorer', 'contact', 'gallery', 'hackclub', 'dos', 'boba-bash-delhi', 'boba-bash-grn', 'distortion-rlsp', 'og-tour'];
const appNames = {
  about: 'About Me',
  explorer: 'File Explorer',
  contact: 'Contact Me',
  hackclub: 'HackClub',
  gallery: 'Gallery',
  dos: 'DOS',
  'boba-bash-delhi': 'Boba Bash Delhi',
  'boba-bash-grn': 'Boba Bash Greater Noida',
  'distortion-rlsp': '::distortion:: Release Party',
  'og-tour': 'OG Lucifer Tour'
};

const appPages = {
  about: './portfolio.html',
  explorer: './explorer.html',
  contact: './contact.html',
  gallery: './gallery.html',
  hackclub: 'https://hackclub.com',
  dos: './dos.html',
  'boba-bash-delhi': './gallery/bobabashdelhi.html',
  'boba-bash-grn': './gallery/bobabashgrn.html',
  'distortion-rlsp': './gallery/dsrlps.html',
  'og-tour': './gallery/ogtour.html'
};

let openApps = {};
let focusedApp = null;

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 10000);

function toggleStartMenu(e) {
  e && e.stopPropagation();
  const m = document.getElementById('startMenu');
  m.classList.toggle('open');
  const btn = document.getElementById('startBtn');
  btn.setAttribute('aria-expanded', m.classList.contains('open'));
}

function closeStartMenu() {
  document.getElementById('startMenu').classList.remove('open');
  document.getElementById('startBtn').setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#startMenu') && !e.target.closest('#startBtn')) {
    closeStartMenu();
  }
});

function openApp(id) {
  const folderPaths = {
    'mydocs-explorer': 'C:\\My Documents',
    'boba-bash-delhi-folder': 'C:\\My Documents\\Boba Bash Delhi',
    'boba-bash-grn-folder': 'C:\\My Documents\\Boba Bash Greater Noida',
    'distortion-rlsp-folder': 'C:\\My Documents\\::distortion:: release party',
    'og-tour-folder': 'C:\\My Documents\\OG Lucifer Poore Dil Se Tour'
  };

  const targetAppId = folderPaths[id] ? 'explorer' : id;
  const initialPath = folderPaths[id] || null;

  if (!appPages[targetAppId]) return;

  const winId = 'win-' + targetAppId;

  if (!document.getElementById(winId)) {
    const win = document.createElement('div');
    win.className = 'win-window';
    win.id = winId;
    win.style.top = (Math.random() * 100 + 50) + 'px';
    win.style.left = (Math.random() * 100 + 50) + 'px';
    win.style.width = '480px';
    win.style.height = '360px';

    const titlebar = document.createElement('div');
    titlebar.className = 'win-titlebar';
    titlebar.onmousedown = (e) => startDrag(e, winId);
    titlebar.innerHTML = `
      <span class="win-title-text">${appNames[targetAppId] || 'Application'}</span>
      <div class="win-titlebar-btns">
        <div class="win-btn" onclick="minimizeApp('${targetAppId}')" title="Minimize">_</div>
        <div class="win-btn" onclick="maximizeWin('${winId}')" title="Maximize">□</div>
        <div class="win-btn" onclick="closeApp('${targetAppId}')" title="Close" style="font-weight:bold;">✕</div>
      </div>
    `;

    const body = document.createElement('div');
    body.className = 'win-body';
    body.style.padding = '0';
    body.style.overflow = 'hidden';
    
    let pageSrc = appPages[targetAppId];
    if (initialPath && targetAppId === 'explorer') {
      pageSrc += '?path=' + encodeURIComponent(initialPath);
    }

    body.innerHTML = `<iframe src="${pageSrc}" style="width:100%;height:100%;border:none;background:#fff;" id="iframe-${targetAppId}"></iframe>`;

    const resize = document.createElement('div');
    resize.className = 'resize-handle';
    resize.onmousedown = (e) => startResize(e, winId);

    win.appendChild(titlebar);
    win.appendChild(body);
    win.appendChild(resize);

    document.getElementById('desktop').appendChild(win);
    win.addEventListener('mousedown', () => focusWindow(targetAppId));
  } else if (initialPath && targetAppId === 'explorer') {
    const iframe = document.getElementById('iframe-' + targetAppId);
    if (iframe) {
      iframe.src = appPages[targetAppId] + '?path=' + encodeURIComponent(initialPath);
    }
  }

  if (!openApps[targetAppId]) {
    openApps[targetAppId] = { minimized: false };
    addTaskbarBtn(targetAppId);
  }
  openApps[targetAppId].minimized = false;
  document.getElementById(winId).classList.add('open');
  focusWindow(targetAppId);
}

function closeApp(id) {
  const win = document.getElementById('win-' + id);
  if (win) { win.classList.remove('open'); win.remove(); }
  delete openApps[id];
  removeTaskbarBtn(id);
  if (focusedApp === id) focusedApp = null;
}

function minimizeApp(id) {
  const win = document.getElementById('win-' + id);
  if (win) win.classList.remove('open');
  if (openApps[id]) openApps[id].minimized = true;
  const btn = document.getElementById('tb-' + id);
  if (btn) btn.classList.remove('active');
}

function restoreApp(id) {
  if (!openApps[id]) return openApp(id);
  const win = document.getElementById('win-' + id);
  if (!win) return;
  if (openApps[id].minimized) {
    openApps[id].minimized = false;
    win.classList.add('open');
    focusWindow(id);
  } else {
    minimizeApp(id);
  }
}

function focusWindow(id) {
  document.querySelectorAll('.win-window').forEach(w => {
    w.classList.remove('focused');
    const tb = w.querySelector('.win-titlebar');
    if (tb) tb.style.background = 'linear-gradient(to right, #808080, #a0a0a0)';
  });
  const win = document.getElementById('win-' + id);
  if (win) {
    win.classList.add('focused');
    const tb = win.querySelector('.win-titlebar');
    if (tb) tb.style.background = 'linear-gradient(to right, #000080, #1084d0)';
  }
  document.querySelectorAll('.tb-app-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tb-' + id);
  if (btn) btn.classList.add('active');
  focusedApp = id;
}

function addTaskbarBtn(id) {
  if (document.getElementById('tb-' + id)) return;
  const appsDiv = document.getElementById('taskItems');
  const btn = document.createElement('div');
  btn.className = 'tb-app-btn active';
  btn.id = 'tb-' + id;
  btn.title = appNames[id] || 'Application';
  btn.onclick = () => restoreApp(id);
  btn.innerHTML = `<span>${appNames[id] || 'Application'}</span>`;
  appsDiv.appendChild(btn);
}

function removeTaskbarBtn(id) {
  const btn = document.getElementById('tb-' + id);
  if (btn) btn.remove();
}

function selectIcon(id, e) {
  e && e.stopPropagation();
  deselectAll();
  const el = document.getElementById(id);
  if (el) el.classList.add('selected');
}

function deselectAll() {
  document.querySelectorAll('.desk-icon').forEach(i => i.classList.remove('selected'));
}

let dragTarget = null, dragOX = 0, dragOY = 0;

function startDrag(e, id) {
  if (e.target.classList.contains('win-btn')) return;
  dragTarget = document.getElementById(id);
  const appId = id.replace('win-', '');
  focusWindow(appId);
  const r = dragTarget.getBoundingClientRect();
  dragOX = e.clientX - r.left;
  dragOY = e.clientY - r.top;
  e.preventDefault();
}

document.addEventListener('mousemove', e => {
  if (!dragTarget) return;
  let x = e.clientX - dragOX;
  let y = e.clientY - dragOY;
  const desk = document.getElementById('desktop');
  const dr = desk.getBoundingClientRect();
  x = Math.max(0, Math.min(x, dr.width - dragTarget.offsetWidth));
  y = Math.max(0, Math.min(y, dr.height - dragTarget.offsetHeight));
  dragTarget.style.left = x + 'px';
  dragTarget.style.top = y + 'px';
});

document.addEventListener('mouseup', () => { dragTarget = null; });

let resizeTarget = null, resizeOX = 0, resizeOY = 0, resizeW0 = 0, resizeH0 = 0;

function startResize(e, id) {
  resizeTarget = document.getElementById(id);
  resizeOX = e.clientX;
  resizeOY = e.clientY;
  resizeW0 = resizeTarget.offsetWidth;
  resizeH0 = resizeTarget.offsetHeight;
  e.stopPropagation();
  e.preventDefault();
}

document.addEventListener('mousemove', e => {
  if (!resizeTarget) return;
  const nw = Math.max(280, resizeW0 + (e.clientX - resizeOX));
  const nh = Math.max(180, resizeH0 + (e.clientY - resizeOY));
  resizeTarget.style.width = nw + 'px';
  resizeTarget.style.height = nh + 'px';
});

document.addEventListener('mouseup', () => { resizeTarget = null; });

const ICON_W    = 72;
const ICON_H    = 92;   
const ICON_GAP  = 12; 
const ICON_PAD_TOP  = 16;
const ICON_PAD_LEFT = 16;
const COL_GAP   = 8;  

function layoutIcons() {
  const desktop  = document.getElementById('desktop');
  const icons    = Array.from(document.querySelectorAll('.desk-icon'));

  const availH = desktop.offsetHeight - ICON_PAD_TOP - 8; 

  let col = 0;
  let rowY = ICON_PAD_TOP;

  icons.forEach(icon => {
    if (rowY + ICON_H > availH && rowY > ICON_PAD_TOP) {
      col++;
      rowY = ICON_PAD_TOP;
    }

    const x = ICON_PAD_LEFT + col * (ICON_W + COL_GAP);
    const y = rowY;

    icon.style.left = x + 'px';
    icon.style.top  = y + 'px';

    rowY += ICON_H + ICON_GAP;
  });
}

layoutIcons();
window.addEventListener('resize', layoutIcons);

const winPrevState = {};

function maximizeWin(id) {
  const win = document.getElementById(id);
  const desk = document.getElementById('desktop');
  if (winPrevState[id]) {
    win.style.left = winPrevState[id].left;
    win.style.top = winPrevState[id].top;
    win.style.width = winPrevState[id].width;
    win.style.height = winPrevState[id].height;
    delete winPrevState[id];
  } else {
    winPrevState[id] = {
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height
    };
    win.style.left = '0px';
    win.style.top = '0px';
    win.style.width = desk.offsetWidth + 'px';
    win.style.height = desk.offsetHeight + 'px';
  }
}