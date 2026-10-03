const canvas = document.getElementById('embers');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Подгоняем размер канваса под окно
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
        // Рандомизируем начальное положение по Y, чтобы при загрузке искры были везде
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100; // Появляются чуть ниже экрана
        this.size = Math.random() * 3.5 + 1.2; // РАЗМЕР ИСКРЫ (увеличен чуток)
        this.speedY = Math.random() * 0.8 + 0.3; // СКОРОСТЬ ПОЛЕТА ВВЕРХ (плавнее и медленнее)
        this.speedX = Math.random() * 0.6 - 0.3; // Легкое смещение влево-вправо
        this.opacity = Math.random() * 0.8 + 0.2;

        // ЦВЕТА ИСКР (В формате RGB: Красный, Зеленый, Синий)
        const colors = [
            '255, 100, 0',
            '255, 50, 0',
            '255, 150, 50',
            '200, 30, 0'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Сила размытия (для создания глубины фокуса)
        this.blur = Math.random() * 3;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Легкое покачивание (ветер)
        this.speedX += (Math.random() - 0.5) * 0.02;

        // Постепенное затухание по мере подъема (адаптировано под медленную скорость)
        if (this.y < height * 0.4) {
            this.opacity -= 0.001;
        }

        // Если искра исчезла или улетела высоко - перерождаем ее
        if (this.opacity <= 0 || this.y < -50) {
            this.reset();
            this.y = height + Math.random() * 50; // Снова снизу
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;

        // Свечение искры
        ctx.shadowBlur = this.blur * 6 + 6;
        ctx.shadowColor = `rgba(${this.color}, ${this.opacity})`;

        ctx.fill();
    }
}

// КОЛИЧЕСТВО ИСКР (увеличено)
const particleCount = 230;
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();