import { Clock } from './Clock.js';
import { WindowManager } from './WindowManager.js';
import { Dock } from './Dock.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Clock
    const clock = new Clock();
    clock.start();

    // Initialize Window Manager
    const windowManager = new WindowManager('#window-area');

    // Initialize Dock
    const dock = new Dock('#dock', windowManager);

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
