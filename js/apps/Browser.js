import portfolioData from '../../data/portfolio.json' with { type: 'json' };

export class Browser {
    constructor(windowElement, windowManager) {
        this.windowElement = windowElement;
        this.windowManager = windowManager;
        this.history = [];
        this.currentIndex = -1;
        this.homeUrl = 'https://portfolio.os/home';

        this.renderFrame();
        this.navigate(this.homeUrl);
    }

    renderFrame() {
        this.windowElement.querySelector('.window-content').style.padding = '0';
        this.windowElement.querySelector('.window-content').style.overflow = 'hidden';

        const contentArea = this.windowElement.querySelector('.window-content');

        contentArea.innerHTML = `
            <div class="browser-window">
                <div class="browser-toolbar">
                    <div class="browser-controls">
                        <i class="ph ph-arrow-left nav-btn" id="nav-back"></i>
                        <i class="ph ph-arrow-right nav-btn" id="nav-fwd"></i>
                        <i class="ph ph-arrow-clockwise nav-btn" id="nav-refresh"></i>
                    </div>
                    <div class="address-bar">
                        <i class="ph ph-lock-key" style="color: #666; font-size: 12px;"></i>
                        <input type="text" class="address-input" value="${this.homeUrl}" readonly>
                    </div>
                </div>

                <div class="bookmarks-bar">
                    <div class="bookmark" data-url="https://portfolio.os/home"><i class="ph-fill ph-house"></i> Home</div>
                    <div class="bookmark" data-url="https://portfolio.os/about"><i class="ph-fill ph-user"></i> About</div>
                    <div class="bookmark" data-url="https://portfolio.os/experience"><i class="ph-fill ph-briefcase"></i> Experience</div>
                    <div class="bookmark" data-url="https://portfolio.os/projects"><i class="ph-fill ph-code"></i> Projects</div>
                    <div class="bookmark" data-url="https://portfolio.os/contact"><i class="ph-fill ph-envelope"></i> Contact</div>
                </div>

                <div class="browser-viewport" id="browser-viewport">
                </div>
            </div>
        `;

        contentArea.querySelector('#nav-back').addEventListener('click', () => this.goBack());
        contentArea.querySelector('#nav-fwd').addEventListener('click', () => this.goForward());
        contentArea.querySelector('#nav-refresh').addEventListener('click', () => this.refresh());

        const bookmarks = contentArea.querySelectorAll('.bookmark');
        bookmarks.forEach(b => {
            b.addEventListener('click', () => this.navigate(b.dataset.url));
        });
    }

    navigate(url) {
        if (this.history[this.currentIndex] !== url) {
            this.history = this.history.slice(0, this.currentIndex + 1);
            this.history.push(url);
            this.currentIndex++;
        }

        this.updateAddressBar(url);
        this.renderContent(url);
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            const url = this.history[this.currentIndex];
            this.updateAddressBar(url);
            this.renderContent(url);
        }
    }

    goForward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            const url = this.history[this.currentIndex];
            this.updateAddressBar(url);
            this.renderContent(url);
        }
    }

    refresh() {
        const url = this.history[this.currentIndex];
        this.renderContent(url);
    }

    updateAddressBar(url) {
        this.windowElement.querySelector('.address-input').value = url;
    }

    renderSkillGroup(group) {
        return `
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                    <i class="${group.icon}" style="color: ${group.color}; font-size: 16px;"></i>
                    <span style="font-size: 13px; font-weight: 700; color: ${group.labelColor}; text-transform: uppercase; letter-spacing: 0.06em;">${group.label}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${group.items.map(s =>
                        `<span style="background: ${group.bgColor}; color: ${group.textColor}; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid ${group.borderColor};">${s.name}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    renderProjectCard(project, index) {
        const themes = [
            {
                gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #0284c7 100%)',
                icon: 'ph-fill ph-robot',
                badgeBg: 'rgba(34, 211, 238, 0.2)',
                badgeColor: '#67e8f9',
                chipBg: '#eef2ff',
                chipColor: '#4338ca'
            },
            {
                gradient: 'linear-gradient(135deg, #431407 0%, #9a3412 50%, #059669 100%)',
                icon: 'ph-fill ph-package',
                badgeBg: 'rgba(251, 146, 60, 0.22)',
                badgeColor: '#fed7aa',
                chipBg: '#fff7ed',
                chipColor: '#c2410c'
            },
            {
                gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
                icon: 'ph-fill ph-git-branch',
                badgeBg: 'rgba(45, 212, 191, 0.2)',
                badgeColor: '#99f6e4',
                chipBg: '#f0fdfa',
                chipColor: '#0f766e'
            }
        ];
        const theme = themes[index % themes.length];
        const visibleTech = (project.tech || []).slice(0, 4);
        const extraTech = (project.tech || []).length - visibleTech.length;

        return `
            <div class="project-card" data-project-index="${index}">
                <div class="project-banner" style="background: ${theme.gradient};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <span style="background: ${theme.badgeBg}; color: ${theme.badgeColor}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18);">
                            ${project.tagline || 'Featured Project'}
                        </span>
                        <i class="${theme.icon}" style="font-size: 28px; opacity: 0.9;"></i>
                    </div>
                    <h3 style="font-size: 20px; font-weight: 700; margin: 16px 0 0; color: #fff; letter-spacing: -0.01em;">
                        ${project.title}
                    </h3>
                </div>
                <div style="padding: 18px 20px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; gap: 14px;">
                    <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">
                        ${project.description}
                    </p>
                    <div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
                            ${visibleTech.map(t => `<span style="background: ${theme.chipBg}; color: ${theme.chipColor}; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 999px;">${t}</span>`).join('')}
                            ${extraTech > 0 ? `<span style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px;">+${extraTech}</span>` : ''}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #f1f5f9;">
                            <span style="font-size: 12px; color: #64748b; font-weight: 500;">Click for details</span>
                            <div style="display: flex; gap: 8px;">
                                ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" style="text-decoration: none; background: var(--accent-gradient); color: #fff; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 8px; display: inline-flex; align-items: center; gap: 4px;" onclick="event.stopPropagation()"><i class="ph ph-github-logo"></i> Code</a>` : ''}
                                ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" style="text-decoration: none; color: #10b981; font-size: 12px; font-weight: 600; border: 1px solid #10b981; padding: 4px 10px; border-radius: 8px;" onclick="event.stopPropagation()">Live Demo</a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProjectModal(project) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 16px;">
                    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">${project.description}</p>
                    <div style="margin-bottom: 18px;">
                        <strong style="display: block; margin-bottom: 8px; color: #0f172a;">Tech Stack</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            ${project.tech.map(t => `<span style="background: #eef2ff; color: #4f46e5; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 16px;">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" class="modal-btn" style="background: var(--accent-gradient); color: #fff; padding: 9px 20px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;"><i class="ph ph-github-logo"></i> View Code</a>` : ''}
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="modal-btn" style="background: #10b981; color: #fff; padding: 9px 20px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;"><i class="ph ph-arrow-square-out"></i> Live Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `;

        overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('visible'));
    }

    renderContent(url) {
        const viewport = this.windowElement.querySelector('#browser-viewport');
        const route = url.split('/').pop();

        const { profile, skills, experience, projects } = portfolioData;

        let html = '';

        if (route === 'home') {
            const currentRole = experience[0];
            html = `
                <div class="browser-home-wrapper">
                    <div class="home-hero-banner">
                        <div style="max-width: 560px;">
                            <div class="hero-badge">
                                <span class="hero-badge-dot"></span>
                                ${currentRole.role} @ ${currentRole.company}
                            </div>
                            <h1 style="font-size: 26px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">
                                👋 Welcome to RahulOS
                            </h1>
                            <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.6;">
                                ${profile.tagline}
                            </p>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="home-cta-btn" data-nav="projects" style="background: var(--accent-gradient); color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                                Explore Projects →
                            </button>
                            <button class="home-cta-btn" data-nav="about" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.22); padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer;">
                                About Me
                            </button>
                        </div>
                    </div>

                    <div class="browser-home">
                        <div class="home-card" data-nav="about">
                            <i class="ph-fill ph-user-circle card-icon"></i>
                            <div class="card-title">About Me</div>
                            <p style="font-size: 12px; color: #64748b; margin-top: 6px;">Skills & background</p>
                        </div>
                        <div class="home-card" data-nav="experience">
                            <i class="ph-fill ph-briefcase card-icon"></i>
                            <div class="card-title">Experience</div>
                            <p style="font-size: 12px; color: #64748b; margin-top: 6px;">Career timeline</p>
                        </div>
                        <div class="home-card" data-nav="projects">
                            <i class="ph-fill ph-rocket-launch card-icon"></i>
                            <div class="card-title">Projects</div>
                            <p style="font-size: 12px; color: #64748b; margin-top: 6px;">Selected works</p>
                        </div>
                        <div class="home-card" data-nav="contact">
                            <i class="ph-fill ph-paper-plane-tilt card-icon"></i>
                            <div class="card-title">Contact</div>
                            <p style="font-size: 12px; color: #64748b; margin-top: 6px;">Get in touch</p>
                        </div>
                    </div>

                    <div class="github-activity-strip">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i class="ph-fill ph-github-logo" style="font-size: 18px; color: #0f172a;"></i>
                                <span style="font-size: 14px; font-weight: 700; color: #0f172a; font-family: var(--font-display);">GitHub Activity</span>
                            </div>
                            <a href="${profile.links.github}" target="_blank" style="font-size: 12px; color: var(--accent-color); text-decoration: none; font-weight: 600;">
                                @RahulKumar-007 ↗
                            </a>
                        </div>
                        <div style="overflow-x: auto;">
                            <img src="https://ghchart.rshah.org/6366f1/RahulKumar-007" alt="RahulKumar-007 GitHub Contribution Chart" style="width: 100%; min-width: 520px; display: block;">
                        </div>
                    </div>
                </div>
            `;

            viewport.innerHTML = html;
            viewport.scrollTop = 0;

            viewport.querySelectorAll('.home-card, .home-cta-btn').forEach(el => {
                el.addEventListener('click', () => {
                    this.navigate(`https://portfolio.os/${el.dataset.nav}`);
                });
            });
            return;
        }

        if (route === 'about') {
            const currentRole = experience[0];
            html = `
                <div style="padding: 40px 48px; max-width: 860px; margin: 0 auto; font-family: 'Inter', system-ui, sans-serif;">

                    <div class="about-hero" style="display: flex; gap: 32px; align-items: center; margin-bottom: 40px; background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%); border-radius: 20px; padding: 28px; border: 1px solid #e0e7ff;">
                        <div class="avatar-ring-wrapper">
                            <img src="${profile.avatar}" alt="${profile.name}">
                        </div>
                        <div>
                            <h1 id="typing-name" style="font-size: 28px; font-weight: 700; margin: 0 0 4px; color: #1e1b4b;"></h1>
                            <p style="font-size: 14px; font-weight: 600; color: var(--accent-color, #6366f1); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">${profile.title}</p>
                            <p style="line-height: 1.7; color: #475569; font-size: 14px; margin: 0;">
                                ${profile.description}
                            </p>
                        </div>
                    </div>

                    <div style="margin-bottom: 36px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 18px 22px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <i class="ph-fill ph-lightning" style="color: #f59e0b; font-size: 16px;"></i>
                            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #92400e;">Current Role — ${currentRole.company}</span>
                        </div>
                        <h3 style="font-size: 16px; font-weight: 700; color: #1e1b4b; margin: 0 0 10px;">${currentRole.role}</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #78350f; font-size: 13px; line-height: 1.7;">
                            ${currentRole.highlights ? currentRole.highlights.map(h => `<li>${h}</li>`).join('') : `<li>${currentRole.description}</li>`}
                        </ul>
                    </div>

                    <h2 style="font-size: 18px; font-weight: 700; color: #1e1b4b; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                        <i class="ph-fill ph-code" style="color: var(--accent-color, #6366f1);"></i>
                        Technical Skills
                    </h2>

                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        ${this.renderSkillGroup(skills.languages)}
                        ${this.renderSkillGroup(skills.frameworks)}
                        ${this.renderSkillGroup(skills.tools)}
                    </div>

                    <h2 style="font-size: 18px; font-weight: 700; color: #1e1b4b; margin: 32px 0 20px; display: flex; align-items: center; gap: 8px;">
                        <i class="ph-fill ph-chart-bar" style="color: var(--accent-color);"></i>
                        Skill Proficiency
                    </h2>
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px;">
                        <canvas id="skills-chart" width="400" height="200"></canvas>
                    </div>
                </div>
            `;
        } else if (route === 'experience') {
            html = `
                <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
                    <h1 style="margin-bottom: 32px; color: #0f172a;">Experience</h1>
                    <div class="timeline">
                        ${experience.map((exp, i) => `
                            <div class="timeline-item" style="--timeline-color: ${exp.color};">
                                <div class="timeline-dot ${i === 0 ? 'live-pulse' : ''}"></div>
                                <div class="timeline-card">
                                    <div class="timeline-meta">
                                        <span>${exp.company} • ${exp.period}</span>
                                        ${i === 0 ? `<span class="live-role-pill">● Active · Full-Time</span>` : ''}
                                    </div>
                                    <h3 class="timeline-role">${exp.role}</h3>
                                    <p style="color: #475569; line-height: 1.6; font-size: 14px; margin: 0;">${exp.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (route === 'projects') {
            html = `
                <div style="padding: 40px; max-width: 940px; margin: 0 auto;">
                    <h1 style="margin-bottom: 8px; color: #0f172a;">Featured Projects</h1>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 28px;">Systems engineering, autonomous AI agents, and developer tooling.</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
                        ${projects.map((p, i) => this.renderProjectCard(p, i)).join('')}
                    </div>
                </div>
            `;

            viewport.innerHTML = html;
            viewport.scrollTop = 0;

            viewport.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', () => {
                    const idx = parseInt(card.dataset.projectIndex);
                    this.renderProjectModal(projects[idx]);
                });
            });
            return;
        } else if (route === 'contact') {
            html = `
                <div style="padding: 40px; max-width: 600px; margin: 0 auto; text-align: center;">
                    <i class="ph-fill ph-paper-plane-tilt" style="font-size: 64px; color: var(--accent-color); margin-bottom: 24px;"></i>
                    <h1 style="margin-bottom: 16px;">Get In Touch</h1>
                    <p style="color: #666; margin-bottom: 32px;">Use the Mail app in the Dock to send a message, or reach out below!</p>

                    <div style="background: #f9f9f9; padding: 24px; border-radius: 12px; text-align: left;">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; font-size: 12px; color: #888; margin-bottom: 4px;">Email</label>
                            <div style="font-size: 16px; color: #333;">${profile.email}</div>
                        </div>
                        <div>
                            <label style="display: block; font-size: 12px; color: #888; margin-bottom: 4px;">Socials</label>
                            <div style="display: flex; gap: 16px; font-size: 24px; color: #333; margin-top: 8px;">
                                <a href="${profile.links.linkedin}" target="_blank" style="text-decoration: none; color: inherit;">
                                    <i class="ph ph-linkedin-logo" style="cursor: pointer;"></i>
                                </a>
                                <a href="${profile.links.github}" target="_blank" style="text-decoration: none; color: inherit;">
                                    <i class="ph ph-github-logo" style="cursor: pointer;"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            html = `<div style="padding: 40px; text-align: center;">404 Not Found</div>`;
        }

        viewport.style.opacity = '0';
        setTimeout(() => {
            viewport.innerHTML = html;
            viewport.scrollTop = 0;
            viewport.style.opacity = '1';
        }, 80);

        if (route === 'about') {
            this.typeWriterEffect('typing-name', portfolioData.profile.name, 60);
            setTimeout(() => this.renderSkillChart(portfolioData.skills), 300);
        }
    }

    renderSkillChart(skills) {
        const canvas = document.getElementById('skills-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        const labels = [];
        const data = [];
        const colors = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316'];

        Object.values(skills).forEach(group => {
            group.items.forEach(s => {
                labels.push(s.name);
                data.push(s.level);
            });
        });

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels.slice(0, 12),
                datasets: [{
                    label: 'Proficiency',
                    data: data.slice(0, 12),
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20, font: { size: 10 } },
                        grid: { color: 'rgba(0,0,0,0.06)' },
                        angleLines: { color: 'rgba(0,0,0,0.06)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    typeWriterEffect(elementId, text, speed = 50) {
        const el = document.getElementById(elementId);
        if (!el) return;
        let i = 0;
        el.textContent = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                el.style.borderRight = '2px solid var(--accent-color)';
                setTimeout(() => { el.style.borderRight = 'none'; }, 1500);
            }
        }, speed);
    }
}
