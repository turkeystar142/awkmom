// =======================
// Canvas & Flashlight Setup
// =======================

// Canvas setup
const canvas = document.getElementById('flashlight');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Flashlight toggle
let flashlightOn = false;

// Track position
let mouseX = -1000;
let mouseY = -1000;


// =======================
// Flashlight Animation Loop
// =======================

// Animate flashlight
function drawFlashlight() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (flashlightOn) {
        // Light gradient
        const radius = 300;
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }

    requestAnimationFrame(drawFlashlight);
}

drawFlashlight();

// =======================
// User Interaction Handlers
// =======================

function showContentAndGutters(show) {
    document.getElementById('content').style.opacity = show ? 1 : 0;
    document.getElementById('gutter-left').style.opacity = show ? 1 : 0;
    document.getElementById('gutter-right').style.opacity = show ? 1 : 0;
}

// Toggle flashlight on click or touch anywhere on the screen
document.addEventListener('click', (e) => {
    flashlightOn = !flashlightOn;
    showContentAndGutters(flashlightOn);
    if (flashlightOn) {
        loadRandomArticle();
        setRandomGutterImages();
    } else {
        document.getElementById('content').innerHTML = '';
    }
});

let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
        const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
        const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
        if (dx < 10 && dy < 10) {
            flashlightOn = !flashlightOn;
            showContentAndGutters(flashlightOn);
            if (flashlightOn) {
                loadRandomArticle();
                setRandomGutterImages();
            } else {
                document.getElementById('content').innerHTML = '';
            }
        }
    }
}, { passive: true });

// Track mouse and touch movements
document.addEventListener('mousemove', (e) => {
    if (flashlightOn) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
});
document.addEventListener('touchmove', (e) => {
    if (flashlightOn && e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
}, { passive: true });

// =======================
// Particle Initialization
// =======================

particlesJS("particles-js", { "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#00ff13" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 0, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 80, "color": "#00ff00", "opacity": 0.25, "width": 20 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": false, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });

// =======================
// Article Loading
// =======================

// Fetch and load articles from the server
let articles = [];

fetch('list-articles.php')
    .then(res => res.json())
    .then(files => {
        articles = files.map(f => 'articles/' + f);
    });

function loadRandomArticle() {
    if (articles.length === 0) return;
    const randomFile = articles[Math.floor(Math.random() * articles.length)];
    fetch(randomFile)
        .then(response => response.text())
        .then(text => {
            document.getElementById('content').innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        });
}

// =======================
// Image Loading
// =======================

function setRandomGutterImages() {
    fetch('list-images.php')
        .then(res => res.json())
        .then(images => {
            if (!images.length) return;

            // Calculate how many images fit vertically
            const gutterHeight = window.innerHeight;
            const imgHeight = 90 + 12; // image height + gap (adjust to match CSS)
            const count = Math.floor(gutterHeight / imgHeight);

            // Helper to get N random images (can repeat)
            function getRandomImages(n) {
                return Array.from({ length: n }, () => images[Math.floor(Math.random() * images.length)]);
            }

            // Left gutter
            const leftContainer = document.querySelector('#gutter-left .gutter-images');
            leftContainer.innerHTML = '';
            getRandomImages(count).forEach((imgSrc, i) => {
                const img = document.createElement('img');
                img.src = `images/${imgSrc}`;
                img.style.animationDelay = `${i * 0.3}s`; // stagger animation
                leftContainer.appendChild(img);
            });

            // Right gutter
            const rightContainer = document.querySelector('#gutter-right .gutter-images');
            rightContainer.innerHTML = '';
            getRandomImages(count).forEach((imgSrc, i) => {
                const img = document.createElement('img');
                img.src = `images/${imgSrc}`;
                img.style.animationDelay = `${i * 0.3}s`;
                rightContainer.appendChild(img);
            });
        });
}

// Only run on desktop
if (window.innerWidth >= 900) {
    setRandomGutterImages();
}