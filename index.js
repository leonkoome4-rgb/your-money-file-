let lastTransaction = null;

document.addEventListener('DOMContentLoaded', function() {
    generateRandomMessages(10);

    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            if (!lastTransaction) {
                alert('No transaction available to report.');
                return;
            }

            const amount = lastTransaction.amount;
            const balance = lastTransaction.balance;
            const tid = generateRandomTID();

            // parse numbers safely (strip non-numeric chars)
            const a = parseFloat(String(amount).replace(/[^0-9.-]+/g, '')) || 0;
            const b = parseFloat(String(balance).replace(/[^0-9.-]+/g, '')) || 0;
            const refunded = a + b;

            const failureMessage = `Your transaction has failed. Your Airtel Money balance is Ksh ${refunded.toFixed(1)}. Please try again later. TID: ${tid}`;

            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.textContent = failureMessage;

            document.querySelector('.chat-body').appendChild(messageElement);
            document.querySelector('.chat-body').scrollTop = document.querySelector('.chat-body').scrollHeight;
        });
    }

    // Ensure mobile taps on the Send button submit reliably across browsers
    const form = document.getElementById('transactionForm');
    const sendBtn = document.getElementById('sendBtn');

    if (sendBtn && form) {
        // Use pointer events where available — more consistent across platforms
        sendBtn.addEventListener('pointerdown', function (e) {
            // Only handle primary pointer (finger or primary mouse button)
            if (e.isPrimary === false) return;

            // Prevent multiple quick submissions by disabling the button temporarily
            if (sendBtn.disabled) {
                e.preventDefault();
                return;
            }

            try {
                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else {
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
            } catch (err) {
                // fallback to native submit if something goes wrong
                try { form.submit(); } catch (e) { /* ignore */ }
            }

            sendBtn.disabled = true;
            setTimeout(() => { sendBtn.disabled = false; }, 700);
        }, { passive: true });

        // Also ensure normal clicks behave (desktop/backwards compatibility)
        sendBtn.addEventListener('click', function (e) {
            if (sendBtn.disabled) {
                e.preventDefault();
                return;
            }
            // let the form submit naturally via click
        });
    }
});

document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const raw = document.getElementById('bulkInput').value || '';
    // Expecting comma-separated values in this order:
    // recipient number, amount, recipient number, current balance
    let parts = raw.split(',').map(p => p.trim()).filter(p => p.length);

    if (parts.length < 4) {
        // fallback: split on whitespace if user didn't use commas
        parts = raw.split(/\s+/).map(p => p.trim()).filter(p => p.length);
    }

    if (parts.length < 4) {
        alert('Please enter 4 values: recipient number, amount, recipient number, current balance (comma-separated).');
        return;
    }

    const name = parts[0].toUpperCase();
    const amount = parts[1];
    const number = parts[2];
    const balance = parts[3];

    addMessage(name, amount, number, balance);

    // store last transaction for emergency reporting
    lastTransaction = { amount, balance };

    // Clear form
    event.target.reset();
});

function generateRandomMessages(count) {
    const names = ['JOHN DOE', 'JANE SMITH', 'MIKE JOHNSON', 'SARAH WILSON', 'DAVID BROWN', 'EMMA DAVIS', 'CHRIS MILLER', 'LISA GARCIA', 'TOM ANDERSON', 'RACHEL MARTINEZ'];
    const numbers = ['0712345678', '0723456789', '0734567890', '0745678901', '0756789012', '0767890123', '0778901234', '0789012345', '0790123456', '0701234567'];

    for (let i = 0; i < count; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAmount = Math.floor(Math.random() * 5000) + 100;
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const randomBalance = (Math.random() * 10000 + 1000).toFixed(1);

        addMessage(randomName, randomAmount, randomNumber, randomBalance);
    }
}

function addMessage(name, amount, number, balance) {
    const tid1 = generateRandomTID();
    const tid2 = generateRandomTID();

    // Get current date and time
    const now = new Date();
    const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)}`;
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Format the message
    const message = `${tid1}. Ksh ${amount} sent to ${name} ${number} on ${date} at ${time}. Fee: Ksh 0. Bal: Ksh ${parseFloat(balance).toFixed(1)}. Receiving TID: ${tid2}.`;

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;

    // Add to chat body
    document.querySelector('.chat-body').appendChild(messageElement);

    // Scroll to bottom
    document.querySelector('.chat-body').scrollTop = document.querySelector('.chat-body').scrollHeight;
}

function generateRandomTID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}