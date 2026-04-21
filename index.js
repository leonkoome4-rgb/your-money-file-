document.addEventListener('DOMContentLoaded', function() {
    generateRandomMessages(10);
});

document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const input = document.getElementById('dataInput').value;
    const parts = input.split(',').map(part => part.trim());

    if (parts.length !== 4) {
        alert('Please enter exactly 4 values separated by commas: Name, Amount, Number, Balance');
        return;
    }

    const name = parts[0].toUpperCase();
    const amount = parseFloat(parts[1]);
    const number = parts[2];
    const balance = parseFloat(parts[3]);

    if (isNaN(amount) || isNaN(balance)) {
        alert('Amount and Balance must be numbers');
        return;
    }

    addMessage(name, amount, number, balance);

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

// Add a toggle for Safaricom-styled mode
let safaricomMode = false;

document.addEventListener('DOMContentLoaded', function() {
    // Set default mode to Airtel
    const modeIndicator = document.getElementById('modeIndicator');
    modeIndicator.textContent = 'Mode: Airtel';
});

document.getElementById('toggleMode').addEventListener('click', function() {
    safaricomMode = !safaricomMode;
    console.log('Safaricom Mode:', safaricomMode); // Debug log
    document.body.classList.toggle('safaricom-mode', safaricomMode);

    // Update mode indicator
    const modeIndicator = document.getElementById('modeIndicator');
    modeIndicator.textContent = safaricomMode ? 'Mode: Safaricom' : 'Mode: Airtel';
});

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

    // Get current date and time
    const now = new Date();
    const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)}`;
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Calculate transaction fee
    const fee = calculateMpesaSendFee(amount);

    // Format the message
    let message;
    if (safaricomMode) {
        message = `${tid1} Confirmed. Ksh${amount.toLocaleString()}.00 sent to ${name} <span class="recipient-number">${number}</span> on ${date} at ${time}. New M-PESA balance is Ksh${parseFloat(balance).toFixed(2).toLocaleString()}. Transaction cost, Ksh${fee.toLocaleString()}.00.  Amount you can transact within the day is 475,500.00. Earn interest daily on Ziidi MMF,Dial *334#`;
    } else {
        message = `${tid1}. Ksh ${amount.toLocaleString()} sent to ${name} <span class="recipient-number">${number}</span> on ${date} at ${time}. Fee: Ksh ${fee.toLocaleString()}. Bal: Ksh ${parseFloat(balance).toFixed(1).toLocaleString()}. Receiving TID: ${tid1}.`;
    }

    console.log('Generated Message:', message); // Debug log

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = message;

    // Add to chat body
    document.querySelector('.chat-body').appendChild(messageElement);
}

function generateRandomTID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}