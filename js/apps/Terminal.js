import portfolioData from '../../data/portfolio.json' with { type: 'json' };

export class TerminalApp {
    constructor(windowElement, windowManager) {
        this.windowElement = windowElement;
        this.windowManager = windowManager;
        this.history = [];
        this.historyIndex = -1;
        this.commandHistory = [];
        this.currentHistoryPos = -1;

        this.render();
    }

    render() {
        this.windowElement.querySelector('.window-content').style.padding = '0';
        const contentArea = this.windowElement.querySelector('.window-content');

        contentArea.innerHTML = `
            <div class="terminal-app" id="terminal-output" onclick="document.getElementById('cmd-input').focus()">
                <div class="terminal-line">OS Portfolio [Version 2.0.0]</div>
                <div class="terminal-line">(c) 2026 Geek69. All rights reserved.</div>
                <div class="terminal-line"><br></div>
                <div class="terminal-line">Type "help" for a list of commands.</div>
                <div class="terminal-line"><br></div>

                <div class="command-line">
                    <span class="prompt">guest@portfolio:~$</span>
                    <input type="text" class="cmd-input" id="cmd-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        `;

        this.input = contentArea.querySelector('#cmd-input');
        this.output = contentArea.querySelector('#terminal-output');

        setTimeout(() => this.input.focus(), 100);

        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    print(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        this.output.insertBefore(line, this.output.lastElementChild);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();

            const prevLine = document.createElement('div');
            prevLine.className = 'terminal-line';
            prevLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${command}`;
            this.output.insertBefore(prevLine, this.output.lastElementChild);

            if (command) {
                this.commandHistory.push(command);
                this.currentHistoryPos = this.commandHistory.length;
                this.execute(command);
            }

            this.input.value = '';
            this.scrollToBottom();
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.commandHistory.length > 0) {
                this.currentHistoryPos = Math.max(0, this.currentHistoryPos - 1);
                this.input.value = this.commandHistory[this.currentHistoryPos];
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.currentHistoryPos < this.commandHistory.length - 1) {
                this.currentHistoryPos++;
                this.input.value = this.commandHistory[this.currentHistoryPos];
            } else {
                this.currentHistoryPos = this.commandHistory.length;
                this.input.value = '';
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const partial = this.input.value.trim().toLowerCase();
            const commands = ['help', 'about', 'projects', 'exp', 'experience', 'contact', 'clear', 'sudo', 'whoami', 'date', 'skills', 'email', 'socials', 'download-resume', 'banner', 'repo', 'history', 'echo', 'neofetch', 'ls'];
            const match = commands.filter(c => c.startsWith(partial));
            if (match.length === 1) {
                this.input.value = match[0];
            } else if (match.length > 1) {
                this.print(`<span style="color: #888;">${match.join('  ')}</span>`);
            }
        }
    }

    execute(cmd) {
        const lowerCmd = cmd.toLowerCase().trim();
        const args = lowerCmd.split(/\s+/);
        const mainCmd = args[0];

        const { profile, skills, projects, experience } = portfolioData;

        switch (mainCmd) {
            case 'help':
                this.print(`
                    Available commands:<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">about</span>          - Open About page<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">projects</span>       - View Projects<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">exp</span>            - View Experience<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">contact</span>        - Contact Me<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">skills</span>         - Show technical skills<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">whoami</span>         - About the developer<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">email</span>          - Show email address<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">socials</span>        - Show social links<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">download-resume</span> - Download resume PDF<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">date</span>           - Show current date/time<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">neofetch</span>       - System info (fun)<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">echo</span>           - Repeat a message<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">banner</span>         - Show ASCII banner<br>
                    &nbsp;&nbsp;<span style="color: #33ff00">clear</span>          - Clear terminal
                `);
                break;

            case 'about':
                this.print("Opening About Me...");
                this.windowManager.openWindow('browser', 'about');
                break;

            case 'projects':
                if (args.length > 1 && args[1] === '--detail') {
                    const idx = parseInt(args[2]) - 1;
                    const p = projects[idx];
                    if (p) {
                        this.print(`
                            <span style="color: #33ff00; font-weight: bold;">${p.title}</span><br>
                            <span style="color: #888;">${p.description}</span><br>
                            <span style="color: #ff00ff;">Tech:</span> ${p.tech.join(', ')}<br>
                            ${p.codeUrl ? `<span style="color: #888;">Code:</span> ${p.codeUrl}<br>` : ''}
                            ${p.demoUrl ? `<span style="color: #888;">Demo:</span> ${p.demoUrl}` : ''}
                        `);
                    } else {
                        this.print(`Project #${args[2]} not found. Usage: projects --detail [1-${projects.length}]`);
                    }
                } else {
                    this.print("Opening Projects...");
                    this.windowManager.openWindow('browser', 'projects');
                }
                break;

            case 'exp':
            case 'experience':
                this.print("Opening Experience...");
                this.windowManager.openWindow('browser', 'experience');
                break;

            case 'contact':
                this.print("Opening Contact...");
                this.windowManager.openWindow('browser', 'contact');
                break;

            case 'skills':
                this.print(`
                    <span style="color: #fff; font-weight: bold;">Technical Skills</span><br><br>
                    <span style="color: #8b5cf6;">Languages & DB:</span><br>
                    ${skills.languages.items.map(s => `  <span style="color: #33ff00;">${s.name}</span>`).join(' ')}<br><br>
                    <span style="color: #0ea5e9;">Frameworks:</span><br>
                    ${skills.frameworks.items.map(s => `  <span style="color: #33ff00;">${s.name}</span>`).join(' ')}<br><br>
                    <span style="color: #10b981;">Tools:</span><br>
                    ${skills.tools.items.map(s => `  <span style="color: #33ff00;">${s.name}</span>`).join(' ')}
                `);
                break;

            case 'whoami':
                this.print(`
                    <span style="color: #33ff00;">${profile.name}</span><br>
                    <span style="color: #888;">${profile.title}</span><br>
                    ${profile.tagline}
                `);
                break;

            case 'email':
                this.print(`Contact: <a href="mailto:${profile.email}" style="color: #33ff00; text-decoration: underline;">${profile.email}</a>`);
                break;

            case 'socials':
                this.print(`
                    GitHub:   <a href="${profile.links.github}" target="_blank" style="color: #33ff00; text-decoration: underline;">${profile.links.github}</a><br>
                    LinkedIn: <a href="${profile.links.linkedin}" target="_blank" style="color: #33ff00; text-decoration: underline;">${profile.links.linkedin}</a>
                `);
                break;

            case 'download-resume':
                this.print("Downloading resume...");
                const link = document.createElement('a');
                link.href = 'Assets/Resume_2026.pdf';
                link.download = 'Rahul_Kumar_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                break;

            case 'date':
                this.print(new Date().toString());
                break;

            case 'neofetch':
                this.print(`
                    <span style="color: #33ff00;">          ██████████</span>   <span style="color: #fff;">${profile.name}</span><br>
                    <span style="color: #33ff00;">        ██        ██</span>   <span style="color: #888;">------------------------</span><br>
                    <span style="color: #33ff00;">      ██            ██</span>  <span style="color: #fff;">OS:</span> <span style="color: #888;">PortfolioOS 2.0</span><br>
                    <span style="color: #33ff00;">    ██                ██</span> <span style="color: #fff;">Host:</span> <span style="color: #888;">${window.location.hostname}</span><br>
                    <span style="color: #33ff00;">  ██                    ██</span><span style="color: #fff;">Shell:</span> <span style="color: #888;">portfolio-bash</span><br>
                    <span style="color: #33ff00;">  ██    ████████████    ██</span><span style="color: #fff;">Uptime:</span> <span style="color: #888;">${Math.floor((Date.now() - performance.timing.navigationStart) / 60000)} mins</span><br>
                    <span style="color: #33ff00;">  ██    ██      ██    ██</span> <span style="color: #fff;">Email:</span> <span style="color: #888;">${profile.email}</span><br>
                    <span style="color: #33ff00;">  ██    ████████████    ██</span><span style="color: #fff;">Projects:</span> <span style="color: #888;">${projects.length}</span><br>
                    <span style="color: #33ff00;">  ██                    ██</span><br>
                    <span style="color: #33ff00;">    ██                ██</span><br>
                    <span style="color: #33ff00;">      ██            ██</span><br>
                    <span style="color: #33ff00;">        ██        ██</span><br>
                    <span style="color: #33ff00;">          ██████████</span><br>
                `);
                break;

            case 'echo':
                this.print(args.slice(1).join(' ') || '');
                break;

            case 'banner':
                this.print(`
                    <span style="color: #33ff00; font-size: 16px; font-weight: bold;">
██████   ██████  ██████  ████████  █████  ██████   ██████  ██      ██  ██████<br>
██   ██ ██      ██   ██    ██    ██   ██ ██   ██ ██    ██ ██      ██ ██    ██<br>
██████  ██      ██████     ██    ███████ ██████  ██    ██ ██      ██ ██    ██<br>
██      ██      ██   ██    ██    ██   ██ ██   ██ ██    ██ ██      ██ ██    ██<br>
██       ██████ ██   ██    ██    ██   ██ ██   ██  ██████  ███████ ██  ██████<br>
                    </span>
                    <span style="color: #888;">${profile.name} — ${profile.title}</span>
                `);
                break;

            case 'repo':
                this.print(`Source code: <a href="https://github.com/RahulKumar-007/OS_Portfolio" target="_blank" style="color: #33ff00;">github.com/RahulKumar-007/OS_Portfolio</a>`);
                break;

            case 'history':
                this.print(this.commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('<br>') || 'No commands yet.');
                break;

            case 'ls':
                this.print(`
                    <span style="color: #8b5cf6;">about/</span>  <span style="color: #0ea5e9;">projects/</span>  <span style="color: #10b981;">experience/</span>  <span style="color: #f59e0b;">contact/</span>  <span style="color: #888;">resume.pdf</span>
                `);
                break;

            case 'clear':
                const lines = this.output.querySelectorAll('.terminal-line');
                lines.forEach(l => l.remove());
                break;

            case 'sudo':
                this.print("Nice try! You have no power here.");
                break;

            default:
                this.print(`Command not found: ${mainCmd}. Type 'help' for available commands.`);
        }
    }
}
