import { Browser } from './apps/Browser.js';
import { MailApp } from './apps/Mail.js';
import { TerminalApp } from './apps/Terminal.js';
import { FinderApp } from './apps/Finder.js';

export class WindowManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.windows = [];
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.browserInstance = null; // Track browser to reuse it

        // Global Event Listener for internal browser nav from other apps
        window.addEventListener('browser-nav', (e) => {
            if (e.detail) {
                this.openWindow('browser', e.detail);
            }
        });

        // Event listener for PDF Viewer
        window.addEventListener('open-pdf', (e) => {
            if (e.detail) {
                this.openWindow('pdf-viewer', e.detail);
            }
        });

        // Event listener for Text Viewer
        window.addEventListener('open-text', (e) => {
            if (e.detail) {
                this.openWindow('text-viewer', e.detail);
            }
        });
    }

    openWindow(id, extraPayload = null) {
        // Special Handling for "App" types

        // 1. Browser Handling (Central Hub)
        if (['browser', 'about', 'projects', 'experience', 'contact'].includes(id)) {
            // If ID is one of the content pages, map it to browser text
            let url = 'https://portfolio.os/home';
            if (id === 'about') url = 'https://portfolio.os/about';
            if (id === 'projects') url = 'https://portfolio.os/projects';
            if (id === 'experience') url = 'https://portfolio.os/experience';
            if (id === 'contact') url = 'https://portfolio.os/contact';

            // If payload exists (from internal nav), use that
            if (extraPayload) url = extraPayload;

            // Check if browser is already open
            const browserWin = this.windows.find(w => w.id === 'browser');

            if (browserWin) {
                // Restore if minimized
                if (browserWin.minimized) this.restoreWindow('browser');

                // Focus it
                this.focusWindow(browserWin.element);

                // Navigate
                if (this.browserInstance) {
                    this.browserInstance.navigate(url);
                }
                return;
            } else {
                // Create new Browser Window
                const winEl = this.createWindowElement('browser', 'Safari Browser', '');
                this.container.appendChild(winEl);
                this.windows.push({ id: 'browser', element: winEl, minimized: false });

                // Init Browser App
                this.browserInstance = new Browser(winEl, this);
                this.browserInstance.navigate(url); // Navigate to initial target

                this.focusWindow(winEl);
                this.setupWindowInteractions(winEl);
                return;
            }
        }

        // 2. Finder Handling
        if (id === 'finder') {
            if (this.checkAndRestore('finder')) return;

            const winEl = this.createWindowElement('finder', 'Finder', '');
            this.container.appendChild(winEl);
            this.windows.push({ id: 'finder', element: winEl, minimized: false });

            new FinderApp(winEl, this);

            this.focusWindow(winEl);
            this.setupWindowInteractions(winEl);
            return;
        }

        // 3. PDF Viewer [NEW]
        if (id === 'pdf-viewer') {
            // Allow multiple? For now let's say single instance for resume
            if (this.checkAndRestore('pdf-viewer')) return;

            const pdfUrl = extraPayload || 'https://pdfobject.com/pdf/sample.pdf';
            const content = `
                <div style="height: 100%; width: 100%; display: flex; flex-direction: column;">
                    <iframe src="${pdfUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
                </div>
             `;

            const winEl = this.createWindowElement('pdf-viewer', 'Resume Preview', content);
            this.container.appendChild(winEl);
            this.windows.push({ id: 'pdf-viewer', element: winEl, minimized: false });

            this.focusWindow(winEl);
            this.setupWindowInteractions(winEl);
            return;
        }

        // 4. Text Viewer [NEW]
        if (id === 'text-viewer') {
            // Unique ID based on title maybe? For now generic 'text-viewer'
            if (this.checkAndRestore('text-viewer')) return;

            const data = extraPayload || { title: 'Untitled.txt', content: '' };
            const content = `
                <div style="padding: 24px; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
                    ${data.content}
                </div>
            `;

            const winEl = this.createWindowElement('text-viewer', data.title, content);
            this.container.appendChild(winEl);
            this.windows.push({ id: 'text-viewer', element: winEl, minimized: false });

            this.focusWindow(winEl);
            this.setupWindowInteractions(winEl);
            return;
        }

        // 5. Mail Handling (was 3)
        if (id === 'mail') {
            if (this.checkAndRestore('mail')) return;

            const winEl = this.createWindowElement('mail', 'Mail', '');
            this.container.appendChild(winEl);
            this.windows.push({ id: 'mail', element: winEl, minimized: false });

            new MailApp(winEl);

            this.focusWindow(winEl);
            this.setupWindowInteractions(winEl);
            return;
        }

        // 4. Terminal Handling
        if (id === 'terminal') {
            if (this.checkAndRestore('terminal')) return;

            const winEl = this.createWindowElement('terminal', 'Terminal', '');
            winEl.style.background = '#000'; // Override for terminal
            this.container.appendChild(winEl);
            this.windows.push({ id: 'terminal', element: winEl, minimized: false });

            new TerminalApp(winEl, this);

            this.focusWindow(winEl);
            this.setupWindowInteractions(winEl);
            return;
        }

        // 5. Trash Handling
        if (id === 'trash') {
            alert("“I find that the harder I work, the more luck I seem to have.” – Thomas Jefferson\n\n(No trash found!)");
            return;
        }
    }

    checkAndRestore(id) {
        const existing = this.windows.find(w => w.id === id);
        if (existing) {
            if (existing.minimized) this.restoreWindow(id);
            this.focusWindow(existing.element);
            return true;
        }
        return false;
    }

    createWindowElement(id, title, content) {
        const div = document.createElement('div');
        div.classList.add('window');
        div.id = `window-${id}`;
        div.style.zIndex = this.zIndexCounter++;

        // Stagger positions
        const offset = this.windows.filter(w => !w.minimized).length * 20;
        div.style.top = `${60 + offset}px`;
        div.style.left = `${60 + offset}px`;

        // Loading skeleton (replaced by actual content)
        const loadingContent = content || `
            <div class="window-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading ${title}...</div>
            </div>
        `;

        // Inner HTML skeleton
        div.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <div class="control-btn close-btn" title="Close"></div>
                    <div class="control-btn min-btn" title="Minimize"></div>
                    <div class="control-btn max-btn" title="Maximize"></div>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">
                ${loadingContent}
            </div>
        `;

        // Bind events for buttons
        const closeBtn = div.querySelector('.close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(id);
        });

        const minBtn = div.querySelector('.min-btn');
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(id);
        });

        const maxBtn = div.querySelector('.max-btn');
        maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximize(div);
        });

        return div;
    }

    closeWindow(id) {
        const winObj = this.windows.find(w => w.id === id);
        if (winObj) {
            winObj.element.style.animation = 'closeWindow 0.2s forwards';
            winObj.element.addEventListener('animationend', () => {
                winObj.element.remove();
                this.windows = this.windows.filter(w => w.id !== id);

                // Clear instance ref if closed
                if (id === 'browser') this.browserInstance = null;
            });
        }
    }

    minimizeWindow(id) {
        const winObj = this.windows.find(w => w.id === id);
        if (winObj && !winObj.minimized) {
            winObj.minimized = true;
            winObj.element.style.opacity = '0';
            winObj.element.style.pointerEvents = 'none';
        }
    }

    restoreWindow(id) {
        const winObj = this.windows.find(w => w.id === id);
        if (winObj && winObj.minimized) {
            winObj.minimized = false;
            winObj.element.style.opacity = '1';
            winObj.element.style.pointerEvents = 'all';
            this.focusWindow(winObj.element);
        }
    }

    toggleMaximize(windowEl) {
        if (windowEl.classList.contains('maximized')) {
            windowEl.classList.remove('maximized');

            windowEl.style.width = '600px';
            windowEl.style.height = '400px';
            windowEl.style.top = windowEl.dataset.prevTop || '100px';
            windowEl.style.left = windowEl.dataset.prevLeft || '100px';
        } else {
            // Store state
            windowEl.dataset.prevTop = windowEl.style.top;
            windowEl.dataset.prevLeft = windowEl.style.left;

            windowEl.classList.add('maximized');
            windowEl.style.width = '100%';
            windowEl.style.height = 'calc(100% - var(--menubar-height) - var(--dock-height))'; // simplistic
            windowEl.style.top = 'var(--menubar-height)';
            windowEl.style.left = '0';
        }
    }

    focusWindow(windowEl) {
        this.zIndexCounter++;
        windowEl.style.zIndex = this.zIndexCounter;
        windowEl.classList.add('focused');

        // Unfocus others
        this.windows.forEach(w => {
            if (w.element !== windowEl) {
                w.element.classList.remove('focused');
            }
        });

        this.activeWindow = windowEl;
    }

    setupWindowInteractions(windowEl) {
        const header = windowEl.querySelector('.window-header');

        // Focus on click
        windowEl.addEventListener('mousedown', () => {
            this.focusWindow(windowEl);
        });

        // Draggable
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('control-btn')) return; // ignore control buttons
            if (windowEl.classList.contains('maximized')) return; // don't drag if maximized

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            initialLeft = windowEl.offsetLeft;
            initialTop = windowEl.offsetTop;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            windowEl.style.left = `${initialLeft + dx}px`;
            windowEl.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) isDragging = false;
        });
    }
}
