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

// Toggle flashlight on click or touch anywhere on the screen
document.addEventListener('click', (e) => {
    // Prevent toggling if clicking on a form element or link (optional)
    flashlightOn = !flashlightOn;
    document.getElementById('content').style.opacity = flashlightOn ? 1 : 0;
    flashlightOn ? loadRandomArticle() : document.getElementById('content').innerHTML = '';
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
        // Only treat as tap if movement is small (e.g., < 10px)
        if (dx < 10 && dy < 10) {
            flashlightOn = !flashlightOn;
            document.getElementById('content').style.opacity = flashlightOn ? 1 : 0;
            flashlightOn ? loadRandomArticle() : document.getElementById('content').innerHTML = '';
        }
    }
}, { passive: true });
// document.addEventListener('touchstart', (e) => {
//     flashlightOn = !flashlightOn;
//     document.getElementById('content').style.opacity = flashlightOn ? 1 : 0;
//     flashlightOn ? loadRandomArticle() : document.getElementById('content').innerHTML = '';
// }, { passive: true });

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

// particlesJS("particles-js", {
//     particles: {
//         number: { value: 60 },
//         color: { value: "#00ff00" },
//         opacity: { value: 0.05 },
//         size: { value: 2 },
//         move: { enable: true, speed: 0.5 }
//     },
//     interactivity: {
//         events: { onhover: { enable: false } }
//     },
//     line_linked: {
//         color: { value: "#00ff00" }
//     },
// });

particlesJS("particles-js", { "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#00ff13" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#00ff31", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false, "mode": "repulse" }, "onclick": { "enable": false, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true }); var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function () { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;

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
            // Pick two random images (can be the same)
            const leftImg = images[Math.floor(Math.random() * images.length)];
            const rightImg = images[Math.floor(Math.random() * images.length)];
            document.getElementById('gutter-left').style.backgroundImage = `url('images/${leftImg}')`;
            document.getElementById('gutter-right').style.backgroundImage = `url('images/${rightImg}')`;
        });
}

// Only run on desktop
if (window.innerWidth >= 900) {
    setRandomGutterImages();
}