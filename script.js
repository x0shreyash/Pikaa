const tweetForm = document.getElementById('tweetForm');
const tweetCard = document.getElementById('tweetCard');
const downloadBtn = document.getElementById('downloadBtn');
const charCounter = document.getElementById('charCounter');
const tweetInput = document.getElementById('tweet');
const verifiedToggle = document.getElementById('verified-toggle');
const toggleSwitch = document.getElementById('toggle-switch');
const bgColorInput = document.getElementById('bgColor');
const bgOpacityInput = document.getElementById("bgOpacity");
const bgOpacityContainer = document.getElementById("bgOpacityContainer");
const bgOverlay = document.getElementById("bgOverlay");
const bgImageInput = document.getElementById('bgImage');
const avatarFileInput = document.getElementById('avatarFile');
const cardAvatar = document.getElementById('cardAvatar');

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
  // Verified badge - Fixed version
const verified = document.getElementById('verified-toggle').classList.contains('active');
document.getElementById('cardVerified').innerHTML = verified
  ? `<svg class="verified-badge" viewBox="0 0 24 24" aria-label="Verified account" role="img">
       <path fill="#1DA1F2" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
     </svg>`
  : '';

  // Background color/image
  if (tweetCard.bgImgUrl) {
    tweetCard.style.background = `${bgColorInput.value} url('${tweetCard.bgImgUrl}') center/cover no-repeat`;
  } else {
    tweetCard.style.background = bgColorInput.value;
  }
}

// Verified badge - Fixed version
function updateVerifiedBadge() {
  const verified = verifiedToggle.classList.contains('active');
  document.getElementById('cardVerified').innerHTML = verified
    ? `<svg class="verified-badge" viewBox="0 0 24 24" aria-label="Verified account" role="img">
         <path fill="#1DA1F2" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
       </svg>`
    : '';
}

verifiedToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle both elements at once
    this.classList.toggle('active');
    toggleSwitch.classList.toggle('active');
    
    // Force immediate update
    requestAnimationFrame(() => {
        const isActive = this.classList.contains('active');
        document.getElementById('cardVerified').innerHTML = isActive 
            ? `<svg class="verified-badge" viewBox="0 0 24 24" aria-label="Verified account" role="img">
                 <path fill="#1DA1F2" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
               </svg>`
            : '';
    });
});

// Live preview for all fields
tweetForm.addEventListener('input', updateCard);
tweetForm.addEventListener('change', updateCard);

tweetInput.addEventListener('input', function() {
  charCounter.textContent = 280 - tweetInput.value.length;
});

// Background color
bgColorInput.addEventListener('input', function() {
  if (tweetCard.bgImgUrl) {
    tweetCard.style.background = `${bgColorInput.value} url('${tweetCard.bgImgUrl}') center/cover no-repeat`;
  } else {
    tweetCard.style.background = bgColorInput.value;
  }
});
// Background opacity
bgImageInput.addEventListener('change', function() {
  const file = bgImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      tweetCard.bgImgUrl = e.target.result;
      tweetCard.style.background = `${bgColorInput.value} url('${tweetCard.bgImgUrl}') center/cover no-repeat`;
      bgOverlay.style.backgroundColor = `rgba(0, 0, 0, ${bgOpacityInput.value})`;
      bgOpacityContainer.style.display = "block"; // ✅ Show slider
    };
    reader.readAsDataURL(file);
  } else {
    tweetCard.bgImgUrl = null;
    tweetCard.style.background = bgColorInput.value;
    bgOverlay.style.backgroundColor = "transparent";
    bgOpacityContainer.style.display = "none"; // ✅ Hide slider
  }
});
bgOpacityInput.addEventListener("input", () => {
  bgOverlay.style.backgroundColor = `rgba(0, 0, 0, ${bgOpacityInput.value})`;
});

// Background image upload
bgImageInput.addEventListener('change', function() {
  const file = bgImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      tweetCard.bgImgUrl = e.target.result;
      tweetCard.style.background = `${bgColorInput.value} url('${tweetCard.bgImgUrl}') center/cover no-repeat`;
    };
    reader.readAsDataURL(file);
  } else {
    tweetCard.bgImgUrl = null;
    tweetCard.style.background = bgColorInput.value;
  }
});

// Avatar file upload
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

function setAvatarFromDiceBear(seed) {
  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
  fetch(avatarUrl)
    .then(response => response.text())
    .then(svg => {
      const base64 = btoa(unescape(encodeURIComponent(svg)));
      cardAvatar.src = `data:image/svg+xml;base64,${base64}`;
    })
    .catch(err => console.error("Avatar load failed:", err));
}

function downloadCard() {
  const clone = tweetCard.cloneNode(true);
  clone.style.border = "none";
  clone.style.boxShadow = "none";
  const style = getComputedStyle(tweetCard);

clone.style.width = style.width;
clone.style.height = tweetCard.scrollHeight + "px";
clone.style.animation = 'none';
clone.style.transition = 'none';



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
    }).catch(error => {
      console.error("Image generation failed:", error);
    });
  }, 50);
}

downloadBtn.addEventListener("click", downloadCard);


// Random seed for avatar
function getRandomSeed() {
  // Generates a random string for the seed
  return Math.random().toString(36).substring(2, 10);
}

// Set a random Bottts Neutral avatar on page load if no file is chosen
const randomSeed = getRandomSeed();
const defaultAvatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${randomSeed}`;
setAvatarFromDiceBear(randomSeed);


// Update avatar fallback to Bottts Neutral as well
avatarFileInput.addEventListener('change', function() {
  const file = avatarFileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      cardAvatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    cardAvatar.src = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${getRandomSeed()}`;
  }
});

// Initial preview
updateCard();