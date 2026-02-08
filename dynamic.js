/* ===============================
   GET CANVAS
================================ */
const canvas = document.getElementById("molecule-bg");

if (!canvas) {
  console.error("❌ Canvas not found!");
}

const ctx = canvas.getContext("2d");

/* ===============================
   RESIZE CANVAS TO HERO
================================ */
function resizeCanvas() {
  const hero = document.querySelector("section.min-h-screen");

  if (!hero) return;

  canvas.width = hero.clientWidth;
  canvas.height = hero.clientHeight;

  initParticles();
}

window.addEventListener("resize", resizeCanvas);

/* ===============================
   MOUSE INTERACTION
================================ */
const mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* ===============================
   PARTICLE CLASS
================================ */
class Particle {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.baseX = x;
    this.baseY = y;

    this.size = Math.random() * 4 + 3;
    this.density = Math.random() * 20 + 10;
  }

  draw() {

    ctx.fillStyle = "rgba(97,218,251,0.9)";

    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(97,218,251,0.5)";

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {

    if (mouse.x === null || mouse.y === null) return;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {

      const force = (mouse.radius - distance) / mouse.radius;

      const moveX = (dx / distance) * force * this.density;
      const moveY = (dy / distance) * force * this.density;

      this.x -= moveX;
      this.y -= moveY;

    } else {

      this.x += (this.baseX - this.x) / 15;
      this.y += (this.baseY - this.y) / 15;
    }
  }
}

/* ===============================
   PARTICLE SYSTEM
================================ */
let particles = [];

function initParticles() {

  particles = [];

  const amount =
    Math.floor((canvas.width * canvas.height) / 10000);

  for (let i = 0; i < amount; i++) {

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    particles.push(new Particle(x, y));
  }
}

/* ===============================
   CONNECT PARTICLES
================================ */
function connectParticles() {

  for (let i = 0; i < particles.length; i++) {

    let links = 0;

    for (let j = i + 1; j < particles.length; j++) {

      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110 && links < 2) {

        ctx.strokeStyle =
          `rgba(97,218,251,${0.4 - dist / 110})`;

        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();

        links++;
      }
    }
  }
}

/* ===============================
   ANIMATION LOOP
================================ */
function animate() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.shadowBlur = 0;

  connectParticles();

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

/* ===============================
   START
================================ */
resizeCanvas();
initParticles();
animate();
