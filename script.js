const container = document.getElementById('trail-container');

// Array of 20 unique images for the trail, using different seeds from picsum
const images = Array.from({ length: 20 }, (_, i) => `https://picsum.photos/seed/${i + 500}/400/600`);

let globalIndex = 0;
let lastMousePos = { x: 0, y: 0 };
const distanceThreshold = 60; // Distance required before dropping a new image

let isAppReady = false;

const initPreloader = async () => {
    const loader = document.getElementById('loader');
    if (!loader) {
        isAppReady = true;
        return;
    }

    // Wait for the font to load before starting the animation
    if (document.fonts) {
        await document.fonts.ready;
    }
    loader.classList.add('start-animation');

    // Load all images
    const promises = images.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // Continue even if one fails
        });
    });

    // Ensure animation plays for a specific duration
    const animationPromise = new Promise(resolve => setTimeout(resolve, 3000));

    await Promise.all([...promises, animationPromise]);

    loader.classList.add('finished');

    // Wait for the fill animation to hold for a moment
    setTimeout(() => {
        loader.classList.add('hide');
        isAppReady = true;

        // Remove loader from DOM after fade out
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 1500);
    }, 1200);
};

initPreloader();

// Helper function to calculate distance
const getDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

const handleMove = (x, y) => {
    if (!isAppReady) return;
    const currentMousePos = { x, y };

    // Check if mouse moved enough distance to drop a new image
    if (getDistance(lastMousePos, currentMousePos) < distanceThreshold) {
        return;
    }

    lastMousePos = currentMousePos;

    // Create image element
    const img = document.createElement('img');
    img.className = 'trail-image';

    // Select image source
    img.src = images[globalIndex % images.length];
    globalIndex++;

    // Position image at cursor
    img.style.left = `${currentMousePos.x}px`;
    img.style.top = `${currentMousePos.y}px`;

    // Gentle random rotation for an elegant feel when fading out
    const randomRotation = (Math.random() - 0.5) * 15;
    img.style.setProperty('--rotation', randomRotation);

    // Append to container
    container.appendChild(img);

    // Trigger reflow to ensure transition works immediately
    void img.offsetWidth;

    // Immediately trigger the grow-in animation
    img.classList.add('show');

    // Start fade out after a longer delay so they stay visible
    setTimeout(() => {
        img.classList.remove('show');
        img.classList.add('fade-out');
    }, 400);

    // Remove from DOM after transition completesS
    setTimeout(() => {
        if (img.parentNode) {
            container.removeChild(img);
        }
    }, 2000);
};

document.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });
