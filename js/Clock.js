export class Clock {
    constructor() {
        this.element = document.getElementById('clock');
    }

    start() {
        this.update();
        setInterval(() => this.update(), 1000); // Update every second
    }

    update() {
        const now = new Date();
        const options = { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
        // Example: Sat 9:41 PM
        this.element.textContent = now.toLocaleDateString('en-US', options).replace(/,/g, '');
    }
}
