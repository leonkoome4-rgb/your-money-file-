document.addEventListener('DOMContentLoaded', function() {
    // Default visual style (Safaricom-themed look)
    document.body.classList.add('safaricom-mode');

    // Load persisted messages; if none exist, populate some random messages
    loadMessages();
    if (!messages || messages.length === 0) generateRandomMessages(4);

    // Login form: primary entry that asks for Name, Amount, Number, Balance
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('loginName').value.trim().toUpperCase();
            const amount = parseFloat(document.getElementById('loginAmount').value);
            const number = document.getElementById('loginNumber').value.trim();
            const balance = parseFloat(document.getElementById('loginBalance').value);

            if (!name || isNaN(amount) || !number || isNaN(balance)) {
                alert('Please fill all fields correctly.');
                return;
            }

            addMessage(name, amount, number, balance);
            // hide login overlay
            const overlay = document.getElementById('loginOverlay');
            if (overlay) overlay.style.display = 'none';
        });
    }

    // Keep a simple transaction form for quick messages (uses single input)
    const txForm = document.getElementById('transactionForm');
    if (txForm) {
        txForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const input = document.getElementById('dataInput').value;
            const parts = input.split(',').map(p => p.trim());
            if (parts.length === 4) {
                const name = parts[0].toUpperCase();
                const amount = parseFloat(parts[1]);
                const number = parts[2];
                const balance = parseFloat(parts[3]);
                if (!isNaN(amount) && !isNaN(balance)) addMessage(name, amount, number, balance);
            } else if (input.trim()) {
                // simple free-text message
                appendRawMessage(input.trim());
            }
            event.target.reset();
        });
    }

    // Support pressing Enter inside the dock input when not using form submit
    const dataInput = document.getElementById('dataInput');
    if (dataInput) {
        dataInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                txForm.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
            }
        });
    }

    // Open login overlay when plus button pressed to allow unlimited messages
    const openLoginBtn = document.getElementById('openLoginBtn');
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', function() {
            const overlay = document.getElementById('loginOverlay');
            if (overlay) overlay.style.display = 'flex';
        });
    }

    // Login button in nav
    const loginNavBtn = document.getElementById('loginBtn');
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', function() {
            const overlay = document.getElementById('loginOverlay');
            if (overlay) overlay.style.display = 'flex';
        });
    }

    // Emergency button: show failed-insufficient-funds message
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            const text = `Failed. Insufficient funds in your M-PESA account to pay Ksh4,000.00 to AIRTEL MONEY.Your M-PESA balance is Ksh1,594.41. Dial *334#OK Select Fuliza M-PESA to Opt in.`;
            appendFailedMessage(text);
        });
    }
});

// Messages persisted in localStorage
let messages = [];

function saveMessages() {
    try {
        localStorage.setItem('mpesa_messages', JSON.stringify(messages));
    } catch (e) {
        console.warn('Could not save messages', e);
    }
}

function loadMessages() {
    try {
        const raw = localStorage.getItem('mpesa_messages');
        messages = raw ? JSON.parse(raw) : [];
        renderMessages();
    } catch (e) {
        console.warn('Could not load messages', e);
        messages = [];
    }
}

function renderMessages() {
    const container = document.querySelector('.chat-body');
    if (!container) return;
    // clear existing non-ts children (preserve timestamp elements)
    // remove all .message elements
    container.querySelectorAll('.message').forEach(n => n.remove());
    messages.forEach(msg => {
        const el = document.createElement('div');
        el.className = 'message received';
        el.innerHTML = msg.html;
        container.appendChild(el);
    });
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/[&<>"]+/g, function(match) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[match];
    });
}

function formatTextToHtml(text) {
    // escape first
    let s = escapeHtml(text);
    // convert URLs to anchors
    s = s.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    // convert phone-like digit runs (7-12 digits) to clickable tel links and highlight
    s = s.replace(/(\b\d{7,12}\b)/g, '<a class="recipient-number" href="tel:$1">$1</a>');
    return s;
}

function generateRandomMessages(count) {
    const names = ['JOHN DOE', 'JANE SMITH', 'MIKE JOHNSON', 'SARAH WILSON', 'DAVID BROWN'];
    const numbers = ['0712345678', '0723456789', '0734567890', '0745678901', '0756789012'];

    for (let i = 0; i < count; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAmount = Math.floor(Math.random() * 5000) + 100;
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const randomBalance = (Math.random() * 10000 + 1000).toFixed(2);
        addMessage(randomName, randomAmount, randomNumber, randomBalance);
    }
}

function calculateMpesaSendFee(amount) {
    if (amount <= 100) return 0;
    else if (amount <= 500) return 7;
    else if (amount <= 1000) return 13;
    else if (amount <= 2500) return 33;
    else if (amount <= 5000) return 57;
    else if (amount <= 10000) return 90;
    else if (amount <= 35000) return 108;
    else return 108; // capped fee
}

function addMessage(name, amount, number, balance) {
    const tid1 = generateRandomTID();
    const now = new Date();
    const date = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear().toString().slice(-2)}`;
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fee = calculateMpesaSendFee(amount);

    // Format amounts with two decimals and thousands separators
    const amtStr = Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const balStr = Number(balance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const feeStr = Number(fee).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Include TID (which starts with 'U') and include highlighted number and link
    const raw = `${tid1} Confirmed. Ksh${amtStr} sent to ${name} ${number}. on ${date} at ${time}.New M-PESA balance is Ksh${balStr}. Transaction cost, Ksh${feeStr}. Amount you can transact within the day is 499,540.00. Download My OneApp on https://saf.cx/lPKcC .`;
    const html = formatTextToHtml(raw);

    const container = document.querySelector('.chat-body');
    const el = document.createElement('div');
    el.className = 'message received';
    el.innerHTML = html;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    // persist message
    messages.push({ id: tid1, html: html, ts: now.toISOString() });
    saveMessages();
}

function appendRawMessage(text) {
    const container = document.querySelector('.chat-body');
    const el = document.createElement('div');
    el.className = 'message received';
    const content = 'U' + text;
    const html = formatTextToHtml(content);
    el.innerHTML = html;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    // persist
    messages.push({ id: generateRandomTID(), html: html, ts: new Date().toISOString() });
    saveMessages();
}

function appendFailedMessage(text) {
    const container = document.querySelector('.chat-body');
    const el = document.createElement('div');
    el.className = 'message received';
    const content = 'U' + text;
    const html = formatTextToHtml(content);
    el.innerHTML = html;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    messages.push({ id: generateRandomTID(), html: html, ts: new Date().toISOString(), failed: true });
    saveMessages();
}

function generateRandomTID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'U';
    for (let i = 0; i < 9; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}