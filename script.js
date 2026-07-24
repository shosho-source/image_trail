const container = document.getElementById('trail-container');

// Array of 20 unique images for the trail, using different seeds from picsum
const images = Array.from({length: 20}, (_, i) => `https://picsum.photos/seed/${i + 500}/400/600`);

let globalIndex = 0;
let lastMousePos = { x: 0, y: 0 };
const distanceThreshold = 60; // Distance required before dropping a new image

// Helper function to calculate distance
const getDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

document.addEventListener('mousemove', (e) => {
    const currentMousePos = { x: e.clientX, y: e.clientY };
    
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

    // Remove from DOM after transition completes (400ms delay + 1.5s transition)
    setTimeout(() => {
        if(img.parentNode) {
            container.removeChild(img);
        }
    }, 2000);
});
