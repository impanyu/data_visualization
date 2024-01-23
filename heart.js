const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 10000; // Adjust for more or fewer particles
const heartScale = 10; // Adjust to scale the heart size
const expansionRate = 0.05; // Adjust to control the expansion speed

// Function to interpolate between pink and red
function interpolateColor(distance) {
    // Assuming distance is normalized between 0 and 1
    const pink = { r: 255, g: 192, b: 203 }; // RGB for pink
    const red = { r: 255, g: 0, b: 0 }; // RGB for red

    return {
        r: pink.r + (red.r - pink.r) * distance,
        g: pink.g + (red.g - pink.g) * distance,
        b: pink.b + (red.b - pink.b) * distance,
    };
}

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
    getDistance() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        return Math.sqrt(dx * dx + dy * dy);
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
        
	this.x += dx * (0.6+Math.random()*0.4) 
	this.y += dy * (0.6+Math.random()*0.4)
	    
        this.updateColor();
        this.size = Math.random() * 3 + .5;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * expansionRate;
        this.y += dy * expansionRate;
	this.updateColor();
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            this.reset();
        }

    }
    
   getBrightness() {
        // Fluctuating brightness: sine wave pattern based on distance
        return 0.5 + 0.5 * Math.sin(this.getDistance() * 0.8);
    }
   updateColor() {
        const maxDistance = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        const distance = this.getDistance();
        const normalizedDistance = 1 - (distance / maxDistance); // Normalizing distance
        const color = interpolateColor(normalizedDistance);
        this.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    draw() {
	ctx.globalAlpha = this.getBrightness();
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

