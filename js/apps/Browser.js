export class Browser {
    constructor(windowElement, windowManager) {
        this.windowElement = windowElement;
        this.windowManager = windowManager;
        this.history = [];
        this.currentIndex = -1;
        this.homeUrl = 'https://portfolio.os/home';

        // Setup UI
        this.renderFrame();
        this.navigate(this.homeUrl);
    }

    renderFrame() {
        // Clear window content first (remove standard padding container if exists)
        this.windowElement.querySelector('.window-content').style.padding = '0';
        this.windowElement.querySelector('.window-content').style.overflow = 'hidden';

        const contentArea = this.windowElement.querySelector('.window-content');

        contentArea.innerHTML = `
            <div class="browser-window">
                <!-- Toolbar -->
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
                
                <!-- Bookmarks -->
                <div class="bookmarks-bar">
                    <div class="bookmark" data-url="https://portfolio.os/home"><i class="ph-fill ph-house"></i> Home</div>
                    <div class="bookmark" data-url="https://portfolio.os/about"><i class="ph-fill ph-user"></i> About</div>
                    <div class="bookmark" data-url="https://portfolio.os/experience"><i class="ph-fill ph-briefcase"></i> Experience</div>
                    <div class="bookmark" data-url="https://portfolio.os/projects"><i class="ph-fill ph-code"></i> Projects</div>
                    <div class="bookmark" data-url="https://portfolio.os/contact"><i class="ph-fill ph-envelope"></i> Contact</div>
                </div>

                <!-- Viewport -->
                <div class="browser-viewport" id="browser-viewport">
                    <!-- Content injected here -->
                </div>
            </div>
        `;

        // Bind Events
        contentArea.querySelector('#nav-back').addEventListener('click', () => this.goBack());
        contentArea.querySelector('#nav-fwd').addEventListener('click', () => this.goForward());
        contentArea.querySelector('#nav-refresh').addEventListener('click', () => this.refresh());

        const bookmarks = contentArea.querySelectorAll('.bookmark');
        bookmarks.forEach(b => {
            b.addEventListener('click', () => this.navigate(b.dataset.url));
        });
    }

    navigate(url) {
        // Push to history if new URL
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
        this.renderContent(url); // Simple re-render
    }

    updateAddressBar(url) {
        this.windowElement.querySelector('.address-input').value = url;
    }

    renderContent(url) {
        const viewport = this.windowElement.querySelector('#browser-viewport');
        const route = url.split('/').pop(); // 'about', 'home', etc.

        let html = '';

        if (route === 'home') {
            html = `
                <div class="browser-home">
                     <div class="home-card" onclick="window.dispatchEvent(new CustomEvent('browser-nav', {detail: 'https://portfolio.os/about'}))">
                        <i class="ph-fill ph-user card-icon"></i>
                        <div class="card-title">About Me</div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">My skills & background</p>
                    </div>
                     <div class="home-card" onclick="window.dispatchEvent(new CustomEvent('browser-nav', {detail: 'https://portfolio.os/experience'}))">
                        <i class="ph-fill ph-briefcase card-icon"></i>
                        <div class="card-title">Experience</div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">Work History</p>
                    </div>
                     <div class="home-card" onclick="window.dispatchEvent(new CustomEvent('browser-nav', {detail: 'https://portfolio.os/projects'}))">
                        <i class="ph-fill ph-code card-icon"></i>
                        <div class="card-title">Projects</div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">Selected Works</p>
                    </div>
                     <div class="home-card" onclick="window.dispatchEvent(new CustomEvent('browser-nav', {detail: 'https://portfolio.os/contact'}))">
                        <i class="ph-fill ph-envelope card-icon"></i>
                        <div class="card-title">Contact</div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">Get in touch</p>
                    </div>
                </div>
            `;

            // Need to bind the onclick events after insertion or use global styling. 
            // Better to add event listeners after HTML injection.
            setTimeout(() => {
                const cards = viewport.querySelectorAll('.home-card');
                cards.forEach((card, index) => {
                    const targets = ['about', 'experience', 'projects', 'contact'];
                    card.onclick = () => this.navigate(`https://portfolio.os/${targets[index]}`);
                });
            }, 0);

        } else if (route === 'about') {
            html = `
                <div style="padding: 40px 48px; max-width: 860px; margin: 0 auto; font-family: 'Inter', system-ui, sans-serif;">

                    <!-- Hero -->
                    <div style="display: flex; gap: 32px; align-items: center; margin-bottom: 40px; background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%); border-radius: 20px; padding: 28px; border: 1px solid #e0e7ff;">
                        <img src="../../Assets/profile_image.png"
                             style="width: 110px; height: 110px; object-fit: cover; border-radius: 50%; box-shadow: 0 0 0 4px #fff, 0 0 0 6px var(--accent-color, #6366f1); flex-shrink: 0;">
                        <div>
                            <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 4px; color: #1e1b4b;">Rahul Kumar</h1>
                            <p style="font-size: 14px; font-weight: 600; color: var(--accent-color, #6366f1); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">Associate Engineer · Cloud & Data Engineering</p>
                            <p style="line-height: 1.7; color: #475569; font-size: 14px; margin: 0;">
                                Engineer at the intersection of <strong>cloud data engineering</strong>, <strong>AI/ML</strong>, and <strong>full-stack development</strong>. Currently building scalable Azure data pipelines at Nagarro using ADF, Databricks &amp; Delta Lake. Previously interned at MakeMyTrip (Product Analytics) and Bharti Airtel Foundation (AI Automation).
                            </p>
                        </div>
                    </div>

                    <!-- Latest Experience Highlight -->
                    <div style="margin-bottom: 36px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 18px 22px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <i class="ph-fill ph-lightning" style="color: #f59e0b; font-size: 16px;"></i>
                            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #92400e;">Current Role — Nagarro</span>
                        </div>
                        <h3 style="font-size: 16px; font-weight: 700; color: #1e1b4b; margin: 0 0 10px;">Associate Engineer Trainee</h3>
                        <ul style="margin: 0; padding-left: 18px; color: #78350f; font-size: 13px; line-height: 1.7;">
                            <li>Built &amp; deployed an end-to-end cloud data pipeline on <strong>Azure</strong> (ADF + ADLS Gen2 + Databricks) with <strong>medallion architecture</strong> (Bronze–Silver–Gold) using Delta Lake.</li>
                            <li>Developed parameterized <strong>ETL workflows</strong> using PySpark &amp; Azure Data Factory — handling schema drift, missing data, and automated ingestion with scheduled triggers.</li>
                            <li>Optimized big data workloads via Spark techniques (partitioning, caching, broadcast joins, Z-Ordering) and implemented monitoring, logging &amp; data quality checks.</li>
                        </ul>
                    </div>

                    <!-- Skills Section -->
                    <h2 style="font-size: 18px; font-weight: 700; color: #1e1b4b; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                        <i class="ph-fill ph-code" style="color: var(--accent-color, #6366f1);"></i>
                        Technical Skills
                    </h2>

                    <div style="display: flex; flex-direction: column; gap: 20px;">

                        <!-- Languages & DB -->
                        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                                <i class="ph-fill ph-database" style="color: #8b5cf6; font-size: 16px;"></i>
                                <span style="font-size: 13px; font-weight: 700; color: #4c1d95; text-transform: uppercase; letter-spacing: 0.06em;">Languages &amp; DB</span>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${['C/C++','MATLAB','Python','SQL','MongoDB','JavaScript','TypeScript','HTML','CSS'].map(s =>
                                    `<span style="background: #f3f0ff; color: #5b21b6; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid #ddd6fe;">${s}</span>`
                                ).join('')}
                            </div>
                        </div>

                        <!-- Frameworks & Technologies -->
                        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                                <i class="ph-fill ph-squares-four" style="color: #0ea5e9; font-size: 16px;"></i>
                                <span style="font-size: 13px; font-weight: 700; color: #0c4a6e; text-transform: uppercase; letter-spacing: 0.06em;">Frameworks &amp; Technologies</span>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${['React','Express','Node.js','Next.js','TailwindCSS','Vercel','Jest','Pandas','NumPy','Matplotlib','OpenCV','Seaborn','TensorFlow'].map(s =>
                                    `<span style="background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid #bae6fd;">${s}</span>`
                                ).join('')}
                            </div>
                        </div>

                        <!-- Tools & Proficiencies -->
                        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                                <i class="ph-fill ph-wrench" style="color: #10b981; font-size: 16px;"></i>
                                <span style="font-size: 13px; font-weight: 700; color: #064e3b; text-transform: uppercase; letter-spacing: 0.06em;">Tools &amp; Proficiencies</span>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${['Docker','Spark','Databricks','Azure (ADF, ADLS Gen2)','Clerk','Stripe','Shadcn','RESTful APIs','Unix','Agile','Scrum'].map(s =>
                                    `<span style="background: #d1fae5; color: #065f46; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid #a7f3d0;">${s}</span>`
                                ).join('')}
                            </div>
                        </div>

                    </div>
                </div>
            `;
        } else if (route === 'experience') {
            html = `
                <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
                    <h1 style="margin-bottom: 32px;">Experience</h1>

                    <div style="margin-bottom: 32px; border-left: 3px solid var(--accent-color); padding-left: 20px;">
                        <h3 style="font-size: 18px;">Associate Engineer Trainee</h3>
                        <div style="color: #666; font-size: 14px; margin-bottom: 8px; font-weight: bold;">Nagarro • 01/2026 – Present</div>
                        <p style="color: #444; line-height: 1.5;">Built and deployed an end-to-end cloud data pipeline on Azure, integrating ADF, ADLS Gen2, and Databricks, implementing
medallion architecture (Bronze–Silver–Gold) with Delta Lake for scalable data processing</p>
                    </div>
                    
                    <div style="margin-bottom: 32px; border-left: 3px solid #ddd; padding-left: 20px;">
                        <h3 style="font-size: 18px;">Product Analyst Intern</h3>
                        <div style="color: #666; font-size: 14px; margin-bottom: 8px; font-weight: bold;">MakeMyTrip • 06/2025 – 07/2025</div>
                        <p style="color: #444; line-height: 1.5;">Analyzed user funnels across PWA and SEO/SEM journeys to identify drop-offs and abnormal behavior using session-level insights. Built custom dashboards to track conversion trends, search anomalies, and booking pain points. Led large-scale hotel deduplication using rule-based logic and DinoV2 vision embeddings, and generated AI-powered SEM ad copies for major tourist cities.</p>
                    </div>

                     <div style="margin-bottom: 32px; border-left: 3px solid #ddd; padding-left: 20px;">
                        <h3 style="font-size: 18px;">AI Automation Intern</h3>
                        <div style="color: #666; font-size: 14px; margin-bottom: 8px;font-weight: bold;">Bharti Airtel Foundation • 06/2024 – 08/2024</div>
                        <p style="color: #444; line-height: 1.5;">Developed the complete backend infrastructure for an AI-based Question Bank Generator app using Node.js and Express,
integrating with PostgreSQL using sequelize ORM to manage a large-scale question database for 100,000 potential users.</p>
                    </div>
                </div>
            `;
        } else if (route === 'projects') {
            html = `
                <div style="padding: 40px; max-width: 900px; margin: 0 auto;">
                    <h1 style="margin-bottom: 32px;">Projects</h1>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
                         <div style="border: 1px solid #eee; border-radius: 12px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" 
                              onmouseover="this.style.transform='translateY(-4px)'" 
                              onmouseout="this.style.transform='translateY(0)'">
                            <div style="height: 160px; overflow: hidden;">
                                <img src="../../Assets/project_fact_checker.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="padding: 16px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <h3 style="font-size: 16px; margin: 0;">Autonomous Fact Checker</h3>
                                    <a href="https://github.com/RahulKumar-007/Fact_checker" target="_blank" style="text-decoration: none; color: var(--accent-color); font-size: 12px; border: 1px solid var(--accent-color); padding: 4px 8px; border-radius: 4px;">View Code</a>
                                </div>
                                <p style="font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5;">Streamlit-based autonomous fact-checking web app integrating Google Gemini via LangChain, DuckDuckGo search, and a ChromaDB knowledge base with HuggingFace embeddings to verify user claims in real time.</p>
                            </div>
                         </div>
                         <div style="border: 1px solid #eee; border-radius: 12px; overflow: hidden; transition: transform 0.2s; cursor: pointer;"
                              onmouseover="this.style.transform='translateY(-4px)'" 
                              onmouseout="this.style.transform='translateY(0)'">
                            <div style="height: 160px; overflow: hidden;">
                                <img src="../../Assets/project_imgai.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="padding: 16px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <h3 style="font-size: 16px; margin: 0;">ImgAi</h3>
                                    <a href="https://img-ai-nu.vercel.app/" target="_blank" style="text-decoration: none; color: var(--accent-color); font-size: 12px; border: 1px solid var(--accent-color); padding: 4px 8px; border-radius: 4px;">Try Out</a>
                                </div>
                                <p style="font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5;">SaaS AI Image Processing Platform.</p>
                            </div>
                         </div>
                         <div style="border: 1px solid #eee; border-radius: 12px; overflow: hidden; transition: transform 0.2s; cursor: pointer;"
                              onmouseover="this.style.transform='translateY(-4px)'"
                              onmouseout="this.style.transform='translateY(0)'">
                            <div style="height: 160px; overflow: hidden;">
                                <img src="../../Assets/project_myvcs.png" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="padding: 16px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <h3 style="font-size: 16px; margin: 0;">myVCS</h3>
                                    <a href="https://github.com/RahulKumar-007/Version_Control_System" target="_blank" style="text-decoration: none; color: var(--accent-color); font-size: 12px; border: 1px solid var(--accent-color); padding: 4px 8px; border-radius: 4px;">View Code</a>
                                </div>
                                <p style="font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5;">Custom VCS in C++17 with content-addressed storage, SHA-256 hashing, zlib compression, commit DAG, branching, three-way merge, diff engine, stash, and 25+ integration tests.</p>
                            </div>
                         </div>
                    </div>
                </div>
             `;
        } else if (route === 'contact') {
            html = `
                 <div style="padding: 40px; max-width: 600px; margin: 0 auto; text-align: center;">
                    <i class="ph-fill ph-paper-plane-tilt" style="font-size: 64px; color: var(--accent-color); margin-bottom: 24px;"></i>
                    <h1 style="margin-bottom: 16px;">Get In Touch</h1>
                    <p style="color: #666; margin-bottom: 32px;">This is the web view contact page. For a direct message, try the Mail app in the Dock!</p>
                    
                    <div style="background: #f9f9f9; padding: 24px; border-radius: 12px; text-align: left;">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; font-size: 12px; color: #888; margin-bottom: 4px;">Email</label>
                            <div style="font-size: 16px; color: #333;">chhonkarrahul1362@gmail.com</div>
                        </div>
                         <div>
                            <label style="display: block; font-size: 12px; color: #888; margin-bottom: 4px;">Socials</label>
                            <div style="display: flex; gap: 16px; font-size: 24px; color: #333; margin-top: 8px;">
                                <a href="https://www.linkedin.com/in/rahul-kumar-5639421b1/" target="_blank" style="text-decoration: none; color: inherit;">
                                    <i class="ph ph-linkedin-logo" style="cursor: pointer;"></i>
                                </a>
                                <a href="https://github.com/RahulKumar-007" target="_blank" style="text-decoration: none; color: inherit;">
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

        viewport.innerHTML = html;
        viewport.scrollTop = 0;
    }
}
