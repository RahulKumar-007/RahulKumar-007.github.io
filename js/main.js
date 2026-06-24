import { Clock } from './Clock.js';
import { WindowManager } from './WindowManager.js';
import { Dock } from './Dock.js';

function bootSplash() {
    const splash = document.getElementById('splash-screen');
    const desktop = document.getElementById('desktop');
    const text = splash?.querySelector('.splash-text');

    const messages = ['Starting up...', 'Loading kernel...', 'Initializing display...', 'Launching PortfolioOS...', 'Ready!'];
    let i = 0;

    const timer = setInterval(() => {
        i++;
        if (text && messages[i]) text.textContent = messages[i];
        if (i >= messages.length - 1) {
            clearInterval(timer);
            setTimeout(() => {
                splash.classList.add('fade-out');
                setTimeout(() => {
                    splash.style.display = 'none';
                    desktop.style.display = '';
                }, 500);
            }, 400);
        }
    }, 300);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
    bootSplash();
    // Initialize Clock
    const clock = new Clock();
    clock.start();

    // Initialize Window Manager
    const windowManager = new WindowManager('#window-area');

    // Initialize Dock
    const dock = new Dock('#dock', windowManager);

    // Download Resume button in menu bar
    const resumeBtn = document.getElementById('download-resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'Assets/Resume_2026.pdf';
            link.download = 'Rahul_Kumar_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Initialize Desktop Icons
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const target = icon.dataset.target;
            windowManager.openWindow(target);
        });

        // Touch support for mobile (single tap)
        icon.addEventListener('touchstart', () => {
            const target = icon.dataset.target;
            // clear selection of others?
        });
    });

    console.log('OS Portfolio Environment Initialized');
});
