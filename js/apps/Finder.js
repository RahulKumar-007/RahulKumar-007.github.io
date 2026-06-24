export class FinderApp {
    constructor(windowElement, windowManager) {
        this.windowElement = windowElement;
        this.windowManager = windowManager;
        this.render();
    }

    render() {
        this.windowElement.querySelector('.window-content').style.padding = '0';
        const contentArea = this.windowElement.querySelector('.window-content');

        // Base Layout
        contentArea.innerHTML = `
            <div class="finder-window">
                <!-- Sidebar -->
                <div class="finder-sidebar">
                    <div class="sidebar-group">
                        <div class="sidebar-title">Favorites</div>
                        <div class="sidebar-item"><i class="ph-fill ph-broadcast" style="color: var(--accent-color)"></i> AirDrop</div>
                        <div class="sidebar-item"><i class="ph-fill ph-clock"></i> Recents</div>
                        <div class="sidebar-item"><i class="ph-fill ph-files"></i> Applications</div>
                        <div class="sidebar-item"><i class="ph-fill ph-desktop"></i> Desktop</div>
                        <div class="sidebar-item"><i class="ph-fill ph-file-text"></i> Documents</div>
                        <div class="sidebar-item active"><i class="ph-fill ph-download-simple"></i> Downloads</div>
                    </div>
                     <div class="sidebar-group">
                        <div class="sidebar-title">iCloud</div>
                        <div class="sidebar-item"><i class="ph-fill ph-cloud"></i> iCloud Drive</div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="finder-content">
                    <div class="finder-toolbar">
                        <div class="path-nav">
                             <i class="ph ph-caret-left"></i>
                             <i class="ph ph-caret-right" style="opacity: 0.3"></i>
                             <span style="margin-left: 8px; font-weight: 500;">Downloads</span>
                        </div>
                        <div class="view-toggles">
                            <i class="ph ph-squares-four"></i>
                            <i class="ph ph-list-dashes"></i>
                        </div>
                    </div>
                    
                    <div class="file-grid">
                        <!-- Resume PDF -->
                        <div class="file-item" id="file-resume">
                            <i class="ph-fill ph-file-pdf" style="color: #e0443e;"></i>
                            <span class="file-name">Resume_2026.pdf</span>
                            <span class="file-meta">2.4 MB</span>
                        </div>

                        <!-- Links Text -->
                        <div class="file-item" id="file-links">
                            <i class="ph-fill ph-file-txt" style="color: #9ca3af;"></i>
                            <span class="file-name">links.txt</span>
                            <span class="file-meta">1 KB</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach Event Listeners
        const resumeFile = contentArea.querySelector('#file-resume');
        const linksFile = contentArea.querySelector('#file-links');

        if (resumeFile) {
            resumeFile.addEventListener('click', () => {
                // Download resume PDF directly
                const link = document.createElement('a');
                link.href = '../../Assets/Resume_2026.pdf';
                link.download = 'Rahul_Kumar_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }

        if (linksFile) {
            linksFile.addEventListener('click', () => {
                const textContent = `
                    <h3 style="margin-bottom: 16px;">My Links</h3>
                    <p style="margin-bottom: 12px;">Here are the links to my profiles:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 8px;">
                            <a href="https://github.com/RahulKumar-007" target="_blank" style="color: #0066cc; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                                <i class="ph ph-github-logo"></i> GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/rahul-kumar-5639421b1/" target="_blank" style="color: #0066cc; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                                <i class="ph ph-linkedin-logo"></i> LinkedIn
                            </a>
                        </li>
                    </ul>
                `;
                window.dispatchEvent(new CustomEvent('open-text', {
                    detail: {
                        title: 'links.txt',
                        content: textContent
                    }
                }));
            });
        }
    }
}
