const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 1000; // Adjust for more or fewer particles
const heartScale = 10; // Adjust to scale the heart size
const expansionRate = 0.1; // Adjust to control the expansion speed

// Heart shape formula
function heartShape(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
}

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        const angle = Math.random() * Math.PI * 2;
        const heartPoint = heartShape(angle);
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.targetX = canvas.width / 2 + heartPoint.x * heartScale;
        this.targetY = canvas.height / 2 + heartPoint.y * heartScale;
	
	const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        
	this.x += dx * 0.8
	this.y += dx * 0.8
	    
        this.color = 'pink';
        this.size = Math.random() * 2 + 1;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * expansionRate;
        this.y += dy * expansionRate;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
}

animate();

