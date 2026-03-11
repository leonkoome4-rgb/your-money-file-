document.addEventListener('DOMContentLoaded', function() {
    generateRandomMessages(10);
});

document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.toUpperCase();
    const amount = document.getElementById('amount').value;
    const number = document.getElementById('number').value;
    const balance = document.getElementById('balance').value;

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