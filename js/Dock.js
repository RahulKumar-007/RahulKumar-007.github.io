export class Dock {
    constructor(dockSelector, windowManager) {
        this.element = document.querySelector(dockSelector);
        this.windowManager = windowManager;
        this.items = this.element.querySelectorAll('.dock-item');

        this.setupEvents();
    }

    setupEvents() {
        this.items.forEach(item => {
            item.addEventListener('click', () => {
                const app = item.dataset.app;

                // New Mapping Logic
                // Finder -> Browser (Home)
                // Mail -> Mail App
                // Safari -> Browser
                // Terminal -> Terminal App
                // Trash -> Alert

                if (app === 'safari') this.windowManager.openWindow('browser', 'https://portfolio.os/home'); // or google?
                else {
                    this.windowManager.openWindow(app);
                }

                this.animateBounce(item);
            });
        });
    }

    animateBounce(element) {
        element.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            element.style.transform = '';
        }, 300);
    }
}
