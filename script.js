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
document.addEventListener('touchstart', (e) => {
    flashlightOn = !flashlightOn;
    document.getElementById('content').style.opacity = flashlightOn ? 1 : 0;
    flashlightOn ? loadRandomArticle() : document.getElementById('content').innerHTML = '';
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

particlesJS("particles-js", {
    particles: {
        number: { value: 60 },
        color: { value: "#00ff00" },
        opacity: { value: 0.05 },
        size: { value: 2 },
        move: { enable: true, speed: 0.5 }
    },
    interactivity: {
        events: { onhover: { enable: false } }
    },
    line_linked: {
        color: { value: "#00ff00" }
    },
});

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