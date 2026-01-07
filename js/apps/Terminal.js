export class TerminalApp {
    constructor(windowElement, windowManager) {
        this.windowElement = windowElement;
        this.windowManager = windowManager;
        this.history = [];
        this.historyIndex = 0;

        this.render();
    }

    render() {
        this.windowElement.querySelector('.window-content').style.padding = '0';
        const contentArea = this.windowElement.querySelector('.window-content');

        contentArea.innerHTML = `
            <div class="terminal-app" id="terminal-output" onclick="document.getElementById('cmd-input').focus()">
                <div class="terminal-line">OS Portfolio [Version 1.0.0]</div>
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

        // Auto focus
        setTimeout(() => this.input.focus(), 100);

        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    print(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text; // allow HTML
        this.output.insertBefore(line, this.output.lastElementChild);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();

            // Print previous command
            const prevLine = document.createElement('div');
            prevLine.className = 'terminal-line';
            prevLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${command}`;
            this.output.insertBefore(prevLine, this.output.lastElementChild);

            this.input.value = '';

            if (command) {
                this.execute(command);
            }

            this.scrollToBottom();
        }
    }

    execute(cmd) {
        const lowerCmd = cmd.toLowerCase();

        switch (lowerCmd) {
            case 'help':
                this.print(`
                    Available commands:<br>
                    &nbsp;&nbsp;<span style="color: #fff">about</span>    - Open About page<br>
                    &nbsp;&nbsp;<span style="color: #fff">projects</span> - View Projects<br>
                    &nbsp;&nbsp;<span style="color: #fff">exp</span>      - View Experience<br>
                    &nbsp;&nbsp;<span style="color: #fff">contact</span>  - Contact Me<br>
                    &nbsp;&nbsp;<span style="color: #fff">clear</span>    - Clear terminal
                `);
                break;
            case 'about':
                this.print("Opening About Me...");
                this.windowManager.openWindow('browser', 'about');
                break;
            case 'projects':
                this.print("Opening Projects...");
                this.windowManager.openWindow('browser', 'projects');
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
            case 'clear':
                // clear all except input
                const lines = this.output.querySelectorAll('.terminal-line');
                lines.forEach(l => l.remove());
                break;
            case 'sudo':
                this.print("Nice try! You have no power here.");
                break;
            default:
                this.print(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
    }
}
