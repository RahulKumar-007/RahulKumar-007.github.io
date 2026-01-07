export class MailApp {
    constructor(windowElement) {
        this.windowElement = windowElement;
        this.render();
    }

    render() {
        // Reset window padding
        this.windowElement.querySelector('.window-content').style.padding = '0';

        const contentArea = this.windowElement.querySelector('.window-content');
        contentArea.innerHTML = `
            <div class="mail-app">
                <div class="mail-toolbar">
                    <div style="font-weight: 600; color: #333;"><i class="ph ph-envelope-simple"></i> New Message</div>
                    <button id="send-btn" style="background: var(--accent-color); color: white; border: none; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;">
                        <i class="ph ph-paper-plane-right"></i> Send
                    </button>
                </div>
                <div class="mail-compose">
                    <div class="mail-field">
                        <span class="field-label">From:</span>
                        <input type="email" class="field-input" placeholder="visitor@example.com" id="mail-from">
                    </div>
                    <div class="mail-field">
                        <span class="field-label">To:</span>
                        <input type="text" class="field-input" value="chhonkarrahul1362@gmail.com" readonly style="color: #666; background: transparent;">
                    </div>
                    <div class="mail-field">
                        <span class="field-label">Subject:</span>
                        <input type="text" class="field-input" placeholder="Project Inquiry..." id="mail-subject" autofocus>
                    </div>
                    <textarea class="mail-body" placeholder="Write your message here..." id="mail-body"></textarea>
                </div>
                <div class="success-toast" id="mail-toast">
                    <i class="ph-fill ph-check-circle"></i> Message Sent Successfully!
                </div>
            </div>
        `;

        // Interaction
        const sendBtn = contentArea.querySelector('#send-btn');
        sendBtn.addEventListener('click', async () => {
            const fromEmail = contentArea.querySelector('#mail-from').value;
            const subject = contentArea.querySelector('#mail-subject').value;
            const body = contentArea.querySelector('#mail-body').value;

            if (!fromEmail || !body) {
                alert("Please fill in your email and message.");
                return;
            }

            // UI Loading State
            const originalBtnText = sendBtn.innerHTML;
            sendBtn.innerHTML = '<i class="ph ph-spinner-gap"></i> Sending...';
            sendBtn.style.opacity = '0.7';
            sendBtn.disabled = true;

            try {
                // REPLACE THIS URL WITH YOUR ACTUAL FORMSPREE ENDPOINT
                const response = await fetch("https://formspree.io/f/xjgkjyoe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        email: fromEmail,
                        message: `Subject: ${subject}\n\n${body}`
                    })
                });

                if (response.ok) {
                    const toast = contentArea.querySelector('#mail-toast');
                    toast.style.opacity = '1';
                    toast.style.bottom = '40px';

                    sendBtn.innerHTML = 'Sent';
                    sendBtn.style.background = '#4CAF50';

                    setTimeout(() => {
                        // Reset form
                        contentArea.querySelector('#mail-subject').value = '';
                        contentArea.querySelector('#mail-body').value = '';
                        // Keep email? Maybe.

                        sendBtn.innerHTML = '<i class="ph ph-paper-plane-right"></i> Send';
                        sendBtn.style.background = 'var(--accent-color)';
                        sendBtn.style.opacity = '1';
                        sendBtn.disabled = false;

                        toast.style.opacity = '0';
                        toast.style.bottom = '24px';
                    }, 3000);
                } else {
                    alert("Oops! There was a problem sending your form.");
                    sendBtn.innerHTML = originalBtnText;
                    sendBtn.style.opacity = '1';
                    sendBtn.disabled = false;
                }
            } catch (error) {
                alert("Error sending email.");
                console.error(error);
                sendBtn.innerHTML = originalBtnText;
                sendBtn.style.opacity = '1';
                sendBtn.disabled = false;
            }
        });
    }
}
