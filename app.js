/**
 * STDKGIT 2026 Logic
 */

let audioCtx;

const views = {
    home: document.getElementById('view-home'),
    stdk: document.getElementById('view-stdk'),
    birdgames: document.getElementById('view-birdgames'),
    redeem: document.getElementById('view-redeem')
};

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playClickSound() {
    initAudioContext();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
}

window.navigateTo = (viewId) => {
    try {
        if (!views[viewId]) {
            console.error(`View ${viewId} not found`);
            return;
        }
        playClickSound();
        Object.values(views).forEach(view => {
            view.classList.remove('active');
        });
        views[viewId].classList.add('active');
        history.pushState({ view: viewId }, '', `#${viewId}`);
    } catch (e) {
        console.error('Navigation error:', e);
    }
};

window.simulateDownload = (filename) => {
    playClickSound();
    const btn = event.currentTarget;
    const originalIcon = btn.innerHTML;

    btn.innerHTML = '<span class="material-symbols-outlined">sync</span>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">done</span>';
        console.log(`STDK_GIT: Initializing download for ${filename}...`);
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.pointerEvents = 'all';
        }, 1000);
    }, 800);
};

window.handleRedeem = () => {
    const input = document.getElementById('redeem-input');
    const status = document.getElementById('redeem-status');
    const code = input.value.trim().toUpperCase();

    if (!code) return;

    playClickSound();
    status.innerText = "AUTHENTICATING...";
    status.style.color = "white";

    setTimeout(() => {
        if (code === "STDK-2026-X") {
            status.innerText = "SUCCESS: PROJECT_ALPHA UNLOCKED";
            status.style.color = "#00ff00";
        } else if (code === "BIRD GAMES" || code === "BIRD") {
            status.innerText = "ACCESS GRANTED: INITIALIZING BIRD_SIM";
            status.style.color = "#00ff00";
            setTimeout(() => navigateTo('birdgames'), 800);
        } else {
            status.innerText = "ERROR: INVALID_LINK_KEY";
            status.style.color = "#ff3333";
        }
    }, 1500);
};

// Handle history
window.onpopstate = (event) => {
    const view = (event.state && event.state.view) ? event.state.view : 'home';
    Object.values(views).forEach(v => v.classList.remove('active'));
    if (views[view]) views[view].classList.add('active');
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
});
history.replaceState({ view: 'home' }, '');