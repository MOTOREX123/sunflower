/**
 * ========================================
 * CONFIGURATION - EDIT YOUR MESSAGES HERE
 * ========================================
 */
const CONFIG = {
    // Scene 0: Opening
    opening: {
        line1: "Hey you... cutipiee🌻",
        line2: "I made something for you.",
        buttonText: "Open it ❤️"
    },

    // Scene 1: Sunflower
    sunflower: {
        message1: "Because you deserve something that always turns toward the light. 🌻",
        message2: "Just like I will always find my way back to you.",
        buttonText: "Continue ❤️",
        animationTimings: {
            seedAppear: 300,
            stemGrow: 1200,
            leafLeft: 1800,
            leafRight: 2200,
            centerBloom: 2800,
            petalsBloom: 3200,
            particlesStart: 3500,
            message1Show: 4500,
            message2Show: 5500,
            buttonShow: 6500
        }
    },

    // Scene 2: Personal Message
    personal: {
        lines: [
            "Somehow, in this huge world...",
            "I found you. ❤️",
            "And honestly...",
            "And I don't want to imagine my days without you."
        ],
        highlightLine: 1, // 0-indexed (line 2)
        lineDelays: [300, 1500, 3000, 4200],
        buttonText: "Continue ❤️",
        buttonDelay: 5500
    },

    // Scene 3: Code Message
    code: {
        codeLines: [
            { type: "keyword", text: "while" },
            { type: "space", text: " " },
            { type: "literal", text: "True" },
            { type: "text", text: ":" },
            { type: "newline", text: "\n" },
            { type: "indent", text: "    " },
            { type: "variable", text: "me" },
            { type: "text", text: "." },
            { type: "function", text: "love" },
            { type: "text", text: "(" },
            { type: "variable", text: "you" },
            { type: "text", text: ")" }
        ],
        outputText: "Running forever. ❤️",
        buttonText: "Continue ❤️",
        cardAppearDelay: 200,
        codeTypeDelay: 80,
        outputDelay: 2000,
        buttonDelay: 3000
    },

    // Scene 4: Garden
    garden: {
        sunflowerCount: 9,
        messages: [
            "If I could give you one thing...",
            "I'd give you a sunflower.",
            "But since I can't hand you one right now...",
            "I made you a little garden instead. 🌻"
        ],
        highlightIndex: 3,
        messageDelays: [800, 2200, 3800, 5500],
        buttonText: "Continue ❤️",
        buttonDelay: 7000
    },

    // Scene 5: Final
    final: {
        messages: [
            "You're my favorite person.",
            "Happy to have you in my life. ❤️"
        ],
        signature: {
            line: "Always yours,",
            name: "— Your favorite motuuuu 💻🌻"
        },
        messageDelays: [500, 1800],
        signatureDelay: 3200,
        buttonText: "See it again 🌻",
        buttonDelay: 4500
    },

    // Global settings
    global: {
        reducedMotion: false,
        musicEnabled: false,
        musicFile: "music/khat.mp3" // Add your music file here
    }
};

/**
 * ========================================
 * STATE MANAGEMENT
 * ========================================
 */
const state = {
    currentScene: 0,
    totalScenes: 6,
    isTransitioning: false,
    musicPlaying: false,
    prefersReducedMotion: false
};

/**
 * ========================================
 * DOM ELEMENTS
 * ========================================
 */
const elements = {
    app: document.getElementById('app'),
    scenes: [],
    buttons: {},
    music: {
        toggle: document.getElementById('music-toggle'),
        audio: document.getElementById('bg-music')
    }
};

/**
 * ========================================
 * INITIALIZATION
 * ========================================
 */
function init() {
    // Check reduced motion preference
    state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (state.prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-fast', '0.01s');
        document.documentElement.style.setProperty('--transition-normal', '0.01s');
        document.documentElement.style.setProperty('--transition-slow', '0.01s');
    }

    // Cache scene elements
    for (let i = 0; i < state.totalScenes; i++) {
        elements.scenes[i] = document.getElementById(`scene-${i}`);
    }

    // Cache buttons
    elements.buttons.start = document.getElementById('btn-start');
    elements.buttons.next1 = document.getElementById('btn-next-1');
    elements.buttons.next2 = document.getElementById('btn-next-2');
    elements.buttons.next3 = document.getElementById('btn-next-3');
    elements.buttons.next4 = document.getElementById('btn-next-4');
    elements.buttons.restart = document.getElementById('btn-restart');

    // Setup event listeners
    setupEventListeners();

    // Initialize background particles
    initBackgroundParticles();

    // Initialize final sunflower petals
    initFinalSunflower();

    // Apply config text content
    applyConfigText();

    // Show first scene
    showScene(0);
}

/**
 * ========================================
 * EVENT LISTENERS
 * ========================================
 */
function setupEventListeners() {
    // Scene navigation
    elements.buttons.start.addEventListener('click', handleStartClick);
    elements.buttons.next1.addEventListener('click', () => goToScene(2));
    elements.buttons.next2.addEventListener('click', () => goToScene(3));
    elements.buttons.next3.addEventListener('click', () => goToScene(4));
    elements.buttons.next4.addEventListener('click', () => goToScene(5));
    elements.buttons.restart.addEventListener('click', () => restartExperience());

    // Music toggle
    elements.music.toggle.addEventListener('click', toggleMusic);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    // Touch events for better mobile feel
    document.addEventListener('touchstart', () => {}, { passive: true });

    // Visibility change - pause animations when tab hidden
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

async function startMusicFromUserGesture() {
    const audio = elements.music.audio;
    const toggle = elements.music.toggle;

    if (!audio) return;

    const musicFile = CONFIG.global.musicFile;

    if (!audio.src || !audio.src.endsWith(musicFile)) {
        audio.src = musicFile;
        audio.load();
    }

    audio.loop = true;
    audio.volume = 0.7;

    try {
        await audio.play();

        state.musicPlaying = true;
        toggle.classList.add('playing');
        toggle.setAttribute('aria-label', 'Pause music');
        toggle.setAttribute('title', 'Pause music');

        console.log('Music started:', musicFile);
    } catch (error) {
        console.error('Music failed to start:', error);
    }
}

function handleStartClick() {
    startMusicFromUserGesture().finally(() => {
        goToScene(1);
    });
}

function handleKeydown(e) {
    if (state.isTransitioning) return;

    const activeScene = document.querySelector('.scene--active');
    if (!activeScene) return;

    const sceneIndex = parseInt(activeScene.dataset.scene, 10);

    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const nextBtn = activeScene.querySelector('.btn--next, .btn--primary, .btn--restart');
        if (nextBtn) nextBtn.click();
    }

    if (e.key === 'ArrowRight' && sceneIndex < state.totalScenes - 1) {
        goToScene(sceneIndex + 1);
    }

    if (e.key === 'ArrowLeft' && sceneIndex > 0) {
        goToScene(sceneIndex - 1);
    }

    if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }

    if (e.key === 'r' || e.key === 'R') {
        restartExperience();
    }
}

function handleVisibilityChange() {
    const audio = elements.music.audio;
    if (!audio) return;

    if (document.hidden && state.musicPlaying) {
        audio.pause();
    } else if (!document.hidden && state.musicPlaying) {
        const musicFile = CONFIG.global.musicFile;
        if (!audio.src || !audio.src.endsWith(musicFile)) {
            audio.src = musicFile;
            audio.load();
        }
        audio.loop = true;
        audio.volume = 0.7;
        audio.play().catch(() => {});
    }
}

/**
 * ========================================
 * SCENE NAVIGATION
 * ========================================
 */
function showScene(index) {
    if (index < 0 || index >= state.totalScenes) return;

    state.currentScene = index;

    elements.scenes.forEach((scene, i) => {
        if (i === index) {
            scene.classList.add('scene--active');
        } else {
            scene.classList.remove('scene--active');
        }
    });

    // Trigger scene-specific animations
    triggerSceneAnimations(index);
}

async function goToScene(index) {
    if (state.isTransitioning || index === state.currentScene) return;

    state.isTransitioning = true;

    // Fade out current scene
    const currentSceneEl = elements.scenes[state.currentScene];
    currentSceneEl.style.transition = 'opacity 0.4s ease';
    currentSceneEl.style.opacity = '0';

    await sleep(400);

    showScene(index);

    // Fade in new scene
    const newSceneEl = elements.scenes[index];
    newSceneEl.style.transition = 'opacity 0.4s ease';
    newSceneEl.style.opacity = '1';

    await sleep(400);

    state.isTransitioning = false;
}

function restartExperience() {
    // Reset all animated elements
    resetAllAnimations();

    // Go to scene 0
    goToScene(0);
}

function resetAllAnimations() {
    // Reset scene 1 video
    const video1 = document.getElementById('bloom');
    if (video1) {
        video1.pause();
        video1.currentTime = 0;
    }

    // Reset messages and button
    const msg1 = document.getElementById('msg-1');
    const msg2 = document.getElementById('msg-2');
    const btnNext1 = document.getElementById('btn-next-1');

    [msg1, msg2, btnNext1].forEach(el => {
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        }
    });

    // Reset scene 2 messages
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById(`seq-${i}`);
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        }
    }
    const btnNext2 = document.getElementById('btn-next-2');
    if (btnNext2) {
        btnNext2.style.animation = 'none';
        btnNext2.offsetHeight;
        btnNext2.style.animation = '';
    }

    // Reset scene 3 code card
    const codeCard = document.getElementById('code-card');
    const codeOutput = document.getElementById('code-output');
    const cursor = document.getElementById('cursor');
    const btnNext3 = document.getElementById('btn-next-3');

    [codeCard, codeOutput, btnNext3].forEach(el => {
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        }
    });

    // Re-type code
    typeCode();

    // Reset scene 4 video
    const video4 = document.getElementById('garden');
    if (video4) {
        video4.pause();
        video4.currentTime = 0;
    }

    // Reset scene 4 garden messages
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById(`garden-msg-${i}`);
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        }
    }
    const btnNext4 = document.getElementById('btn-next-4');
    if (btnNext4) {
        btnNext4.style.animation = 'none';
        btnNext4.offsetHeight;
        btnNext4.style.animation = '';
    }

    // Reset scene 5 final messages
    for (let i = 1; i <= 2; i++) {
        const el = document.getElementById(`final-${i}`);
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        }
    }
    const sigLine = document.querySelector('.signature__line');
    const sigName = document.querySelector('.signature__name');
    const btnRestart = document.getElementById('btn-restart');

    [sigLine, sigName, btnRestart].forEach(el => {
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        }
    });
}

/**
 * ========================================
 * SCENE ANIMATIONS
 * ========================================
 */
function triggerSceneAnimations(sceneIndex) {
    switch (sceneIndex) {
        case 1:
            animateSunflowerScene();
            break;
        case 2:
            animatePersonalMessageScene();
            break;
        case 3:
            animateCodeScene();
            break;
        case 4:
            animateGardenScene();
            break;
        case 5:
            animateFinalScene();
            break;
    }
}

/* ---- Scene 1: Sunflower (Video) ---- */
function animateSunflowerScene() {
    const timings = CONFIG.sunflower.animationTimings;

    // Ensure video plays when scene becomes active
    const video = document.getElementById('sunflower-bloom-video');
    if (video) {
        video.currentTime = 0;
        video.play().catch(() => {
            // Autoplay may be blocked, video will show first frame
        });
    }

    // Show messages
    setTimeout(() => {
        showMessage('msg-1');
    }, timings.message1Show);

    setTimeout(() => {
        showMessage('msg-2');
    }, timings.message2Show);

    // Show button
    setTimeout(() => {
        showButton('btn-next-1');
    }, timings.buttonShow);
}

/* ---- Scene 2: Personal Message ---- */
function animatePersonalMessageScene() {
    const { lines, highlightLine, lineDelays, buttonText, buttonDelay } = CONFIG.personal;

    lines.forEach((line, i) => {
        const el = document.getElementById(`seq-${i + 1}`);
        if (!el) return;

        el.textContent = line;

        if (i === highlightLine) {
            el.classList.add('seq-line--highlight');
        } else {
            el.classList.remove('seq-line--highlight');
        }

        setTimeout(() => {
            el.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, lineDelays[i]);
    });

    // Update button text
    const btn = document.getElementById('btn-next-2');
    if (btn) {
        btn.querySelector('span').textContent = buttonText;
        setTimeout(() => {
            btn.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, buttonDelay);
    }
}

/* ---- Scene 3: Code Message ---- */
function animateCodeScene() {
    const { codeLines, outputText, buttonText, cardAppearDelay, codeTypeDelay, outputDelay, buttonDelay } = CONFIG.code;

    // Show card
    const card = document.getElementById('code-card');
    if (card) {
        setTimeout(() => {
            card.style.animation = 'cardAppear 0.8s ease forwards';
        }, cardAppearDelay);
    }

    // Type code
    typeCode(codeLines, codeTypeDelay);

    // Show output
    const outputEl = document.querySelector('.output-text');
    if (outputEl) {
        outputEl.textContent = outputText;
        setTimeout(() => {
            outputEl.style.animation = 'fadeIn 0.6s ease forwards';
        }, outputDelay);
    }

    // Show button
    const btn = document.getElementById('btn-next-3');
    if (btn) {
        btn.querySelector('span').textContent = buttonText;
        setTimeout(() => {
            btn.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, buttonDelay);
    }
}

function typeCode(lines = CONFIG.code.codeLines, delay = CONFIG.code.codeTypeDelay) {
    const codeEl = document.querySelector('.code-content code');
    if (!codeEl) return;

    codeEl.innerHTML = '';

    lines.forEach((line, i) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.className = line.type || 'text';
            span.textContent = line.text;
            codeEl.appendChild(span);
        }, i * delay);
    });
}

/* ---- Scene 4: Garden (Video) ---- */
function animateGardenScene() {
    const { messages, highlightIndex, messageDelays, buttonText, buttonDelay } = CONFIG.garden;

    // Ensure video plays when scene becomes active
    const video = document.getElementById('sunflower-garden-video');
    if (video) {
        video.currentTime = 0;
        video.play().catch(() => {
            // Autoplay may be blocked, video will show first frame
        });
    }

    messages.forEach((msg, i) => {
        const el = document.getElementById(`garden-msg-${i + 1}`);
        if (!el) return;

        el.textContent = msg;

        if (i === highlightIndex) {
            el.classList.add('garden-message--highlight');
        } else {
            el.classList.remove('garden-message--highlight');
        }

        setTimeout(() => {
            el.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, messageDelays[i]);
    });

    const btn = document.getElementById('btn-next-4');
    if (btn) {
        btn.querySelector('span').textContent = buttonText;
        setTimeout(() => {
            btn.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, buttonDelay);
    }
}

/* ---- Scene 5: Final ---- */
function initFinalSunflower() {
    const container = document.getElementById('petals-final');
    if (!container) return;

    const petalCount = 16;
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.setProperty('--r', `${(360 / petalCount) * i}deg`);
        petal.style.transform = `rotate(${((360 / petalCount) * i)}deg) translateY(-50%)`;
        container.appendChild(petal);
    }
}

function animateFinalScene() {
    const { messages, signature, messageDelays, signatureDelay, buttonText, buttonDelay } = CONFIG.final;

    messages.forEach((msg, i) => {
        const el = document.getElementById(`final-${i + 1}`);
        if (!el) return;

        el.textContent = msg;
        setTimeout(() => {
            el.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, messageDelays[i]);
    });

    // Signature
    const sigLine = document.querySelector('.signature__line');
    const sigName = document.querySelector('.signature__name');
    if (sigLine) sigLine.textContent = signature.line;
    if (sigName) sigName.textContent = signature.name;

    [sigLine, sigName].forEach(el => {
        if (el) {
            setTimeout(() => {
                el.style.animation = 'fadeSlideUp 0.8s ease forwards';
            }, signatureDelay);
        }
    });

    // Button
    const btn = document.getElementById('btn-restart');
    if (btn) {
        btn.querySelector('span').textContent = buttonText;
        setTimeout(() => {
            btn.style.animation = 'fadeSlideUp 0.8s ease forwards';
        }, buttonDelay);
    }
}

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */
function showMessage(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.animation = 'fadeSlideUp 0.8s ease forwards';
    }
}

function showButton(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.animation = 'fadeSlideUp 0.8s ease forwards';
    }
}

function applyConfigText() {
    // Scene 0
    document.getElementById('opening-line-1').textContent = CONFIG.opening.line1;
    document.getElementById('opening-line-2').textContent = CONFIG.opening.line2;
    elements.buttons.start.querySelector('.btn__text').textContent = CONFIG.opening.buttonText;

    // Scene 1
    document.getElementById('msg-1').textContent = CONFIG.sunflower.message1;
    document.getElementById('msg-2').textContent = CONFIG.sunflower.message2;
    elements.buttons.next1.querySelector('span').textContent = CONFIG.sunflower.buttonText;

    // Scene 3
    elements.buttons.next3.querySelector('span').textContent = CONFIG.code.buttonText;

    // Scene 4
    elements.buttons.next4.querySelector('span').textContent = CONFIG.garden.buttonText;

    // Scene 5
    elements.buttons.restart.querySelector('span').textContent = CONFIG.final.buttonText;
}

/* ---- Background Particles ---- */
function initBackgroundParticles() {
    const particleContainers = document.querySelectorAll('.particles:not(#garden-particles)');

    particleContainers.forEach(container => {
        createBackgroundParticles(container, 15);
    });

    // Garden particles
    const gardenParticles = document.getElementById('garden-particles');
    if (gardenParticles) {
        createBackgroundParticles(gardenParticles, 25, true);
    }
}

function createBackgroundParticles(container, count, isGarden = false) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = isGarden ? 'garden-particle' : 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 6}s`;
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = '0';
        container.appendChild(particle);
    }
}

/* ---- Stars ---- */
function initStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 60}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        const size = 1 + Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        starsContainer.appendChild(star);
    }
}

/* ---- Music ---- */
function toggleMusic() {
    const audio = elements.music.audio;
    const toggle = elements.music.toggle;

    if (!audio) return;

    const musicFile = CONFIG.global.musicFile;

    if (!audio.src || !audio.src.endsWith(musicFile)) {
        audio.src = musicFile;
        audio.load();
    }

    audio.loop = true;
    audio.volume = 0.7;

    if (state.musicPlaying) {
        audio.pause();
        toggle.classList.remove('playing');
        toggle.setAttribute('aria-label', 'Play music');
        toggle.setAttribute('title', 'Play music');
        state.musicPlaying = false;
    } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                toggle.classList.add('playing');
                toggle.setAttribute('aria-label', 'Pause music');
                toggle.setAttribute('title', 'Pause music');
                state.musicPlaying = true;
            }).catch(() => {
                console.log('Music playback blocked');
            });
        }
    }
}

/* ---- Utility ---- */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ========================================
 * START THE EXPERIENCE
 * ========================================
 */
document.addEventListener('DOMContentLoaded', init);

// Initialize stars after DOM ready
setTimeout(initStars, 100);