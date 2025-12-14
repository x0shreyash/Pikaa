const tweetForm = document.getElementById('tweetForm');
const tweetCard = document.getElementById('tweetCard');
const downloadBtn = document.getElementById('downloadBtn');
const charCounter = document.getElementById('charCounter');
const tweetInput = document.getElementById('tweet');
const verifiedToggle = document.getElementById('verified-toggle');
const avatarToggle = document.getElementById('avatar-toggle');
const openCustomColor = document.getElementById('openCustomColor');
const bgPresets = document.getElementById('bgPresets');
const bgOpacityInput = document.getElementById("bgOpacity");
const bgOpacityContainer = document.getElementById("bgOpacityContainer");
const bgOverlay = document.getElementById("bgOverlay");
const bgImageInput = document.getElementById('bgImage');
const avatarFileInput = document.getElementById('avatarFile');
const cardAvatar = document.getElementById('cardAvatar');

// Custom color modal elements
const customColorModal = document.getElementById('customColorModal');
const closeCustomColor = document.getElementById('closeCustomColor');
const cancelCustomColor = document.getElementById('cancelCustomColor');
const applyCustomColor = document.getElementById('applyCustomColor');
const customColorPreview = document.getElementById('customColorPreview');
const customColorHex = document.getElementById('customColorHex');
const customColorRgb = document.getElementById('customColorRgb');

// ============ HELPERS ============

function hexToRgbString(hex) {
  if (!hex) return null;
  let h = hex.trim().replace('#', '');
  if (![3, 6].includes(h.length)) return null;
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return null;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

function rgbStringToHex(rgbStr) {
  if (!rgbStr) return null;
  const parts = rgbStr.split(',').map(v => parseInt(v.trim(), 10));
  if (parts.length !== 3 || parts.some(x => Number.isNaN(x) || x < 0 || x > 255)) return null;
  const [r, g, b] = parts;
  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function getRandomSeed() {
  return Math.random().toString(36).substring(2, 10);
}

function getCurrentColor() {
  return (bgPresets?.querySelector('.preset-swatch.active')?.dataset.color) || '#000000';
}

function setBgColor(color) {
  if (tweetCard.bgImgUrl) {
    tweetCard.style.background = `${color} url('${tweetCard.bgImgUrl}') center/cover no-repeat`;
  } else {
    tweetCard.style.background = color;
  }
}

function setAvatarFromDiceBear(seed) {
  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
  fetch(avatarUrl)
    .then(response => response.text())
    .then(svg => {
      const base64 = btoa(unescape(encodeURIComponent(svg)));
      cardAvatar.src = `data:image/svg+xml;base64,${base64}`;
    })
    .catch(() => {});
}

// ============ CARD UPDATE ============

function updateCard() {
  document.getElementById('cardAuthor').textContent = document.getElementById('author').value;
  document.getElementById('cardUsername').textContent = '@' + document.getElementById('username').value.replace(/^@/, '');
  document.getElementById('cardContent').textContent = tweetInput.value;

  // Date
  const now = new Date();
  const time = now.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const month = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();
  const dateStr = `${time} · ${month} ${day}, ${year}`;
  document.getElementById('cardFooter').textContent = dateStr;

  // Verified badge
  const verified = verifiedToggle.classList.contains('active');
  document.getElementById('cardVerified').innerHTML = verified
    ? `<svg class="verified-badge" viewBox="0 0 24 24" aria-label="Verified account" role="img">
         <path fill="#1DA1F2" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
       </svg>`
    : '';
    
    // Background color/image
  setBgColor(getCurrentColor());
}

// ============ MODAL LOGIC ============

function openColorModal(initialColor) {
  const startColor = initialColor || '#15181c';
  customColorHex.value = startColor;
  customColorRgb.value = hexToRgbString(startColor) || '';
  customColorPreview.style.background = startColor;
  customColorModal.classList.add('open');
}

function closeColorModal() {
  customColorModal.classList.remove('open');
}

// Rainbow button
openCustomColor?.addEventListener('click', () => {
  const style = getComputedStyle(tweetCard);
  const bg = style.backgroundColor;
  let startHex = '#15181c';
  if (bg.startsWith('rgb')) {
    const nums = bg
      .replace(/^rgba?\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .slice(0, 3)
      .map(v => parseInt(v.trim(), 10));
    if (nums.length === 3 && nums.every(n => !Number.isNaN(n))) {
      startHex =
        '#' +
        nums
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase();
    }
  }
  openColorModal(startHex);
});

// Close modal buttons
[closeCustomColor, cancelCustomColor].forEach(btn => btn?.addEventListener('click', closeColorModal));

// Backdrop click
if (customColorModal) {
  customColorModal.addEventListener('click', (e) => {
    if (e.target === customColorModal) closeColorModal();
  });
}

// Sync hex → preview + RGB
customColorHex.addEventListener('input', () => {
  let value = customColorHex.value.trim();
  if (!value.startsWith('#')) value = '#' + value;
  if (value.length === 4 || value.length === 7) {
    const rgb = hexToRgbString(value);
    if (rgb) {
      customColorPreview.style.background = value;
      customColorRgb.value = rgb;
    }
  }
});

// Sync RGB → preview + hex
customColorRgb.addEventListener('input', () => {
  const hex = rgbStringToHex(customColorRgb.value);
  if (hex) {
    customColorHex.value = hex;
    customColorPreview.style.background = hex;
  }
});

// Apply custom color
applyCustomColor.addEventListener('click', () => {
  const hex = customColorHex.value.trim();
  if (!hex || !/^#?[0-9a-fA-F]{6}$/.test(hex.replace('#', ''))) return;
  
  const finalHex = hex.startsWith('#') ? hex : '#' + hex;
  bgPresets?.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('active'));
  setBgColor(finalHex);
  closeColorModal();
});

// ============ VERIFIED TOGGLE ============

verifiedToggle.addEventListener('click', (e) => {
  e.preventDefault();
  verifiedToggle.classList.toggle('active');
  updateCard();
});

// ============ AVATAR TOGGLE ============
avatarToggle.addEventListener('click', (e) => {
  e.preventDefault();
  avatarToggle.classList.toggle('active');
  tweetCard.classList.toggle('no-avatar');
});

// ============ LIVE PREVIEW ============

tweetForm.addEventListener('input', updateCard);
tweetForm.addEventListener('change', updateCard);

// ============ CHARACTER COUNTER ============

if (charCounter && tweetInput) {
  const maxChars = parseInt(tweetInput.getAttribute('maxlength'), 10) || 1000;

  const updateCharCounter = () => {
    charCounter.textContent = `${tweetInput.value.length}/${maxChars}`;
  };

  tweetInput.addEventListener('input', updateCharCounter);
  updateCharCounter(); // init on load
}

// ============ PRESET COLORS ============

bgPresets?.querySelectorAll('.preset-swatch:not(.preset-custom)').forEach(swatch => {
  swatch.addEventListener('click', () => {
    bgPresets.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    setBgColor(swatch.dataset.color);
  });
});

// ============ BACKGROUND IMAGE ============

bgImageInput.addEventListener('change', function() {
  const file = bgImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      tweetCard.bgImgUrl = e.target.result;
      setBgColor(getCurrentColor());
      bgOverlay.style.backgroundColor = `rgba(0, 0, 0, ${bgOpacityInput.value})`;
      bgOpacityContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    tweetCard.bgImgUrl = null;
    setBgColor(getCurrentColor());
    bgOverlay.style.backgroundColor = "transparent";
    bgOpacityContainer.style.display = "none";
  }
});

bgOpacityInput.addEventListener("input", () => {
  bgOverlay.style.backgroundColor = `rgba(0, 0, 0, ${bgOpacityInput.value})`;
});

// ============ AVATAR ============

avatarFileInput.addEventListener('change', function() {
  const file = avatarFileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      cardAvatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    setAvatarFromDiceBear(getRandomSeed());
  }
});

// ============ DOWNLOAD ============

function downloadCard() {
  const clone = tweetCard.cloneNode(true);
  clone.style.border = "none";
  clone.style.boxShadow = "none";
  clone.style.animation = 'none';
  clone.style.transition = 'none';

  const style = getComputedStyle(tweetCard);
  clone.style.width = style.width;
  clone.style.height = tweetCard.scrollHeight + "px";

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.top = "0";
  wrapper.style.left = "0";
  wrapper.style.opacity = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.style.zIndex = "-1";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  setTimeout(() => {
    domtoimage.toPng(clone, {
      cacheBust: true,
      width: tweetCard.offsetWidth * 3,
      height: tweetCard.offsetHeight * 3,
      style: {
        transform: "scale(3)",
        transformOrigin: "top left",
        width: tweetCard.offsetWidth + "px",
        height: tweetCard.offsetHeight + "px"
      }
    }).then(dataUrl => {
      document.body.removeChild(wrapper);
      const link = document.createElement("a");
      link.download = "tweet-card.png";
      link.href = dataUrl;
      link.click();
    }).catch(error => {});
  }, 50);
}

downloadBtn.addEventListener("click", downloadCard);

// ============ INIT ============

setAvatarFromDiceBear(getRandomSeed());
updateCard();
