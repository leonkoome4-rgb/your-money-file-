// // function greet(name,callback) 
// // {console.log ("hello"+name);
// //     callback();
// // }
// // function saybye() {console.log("goodbye");}
// // greet("john", saybye);
// // // grades 
// // function allPassed(grades) {
// //   // Your code here:
// function allPassed(grades) {
// return grades.every(grade => grade >= 60);
// }
// let grade1= [70, 85, 90];    
// let grade2= [40, 85, 90];
// console.log(allPassed(grade1)); // true
// console.log(allPassed(grade2)); // false
 
// // Test: allPassed([70, 85, 90]) -> true | allPassed([40, 85, 90]) -> false
// const users = [
//   { id: 1, status: 'member' },
//   { id: 2, status: 'admin' },
//   { id: 3, status: 'member' }
// ];

// function findAdmin(userList) {
//     return users.find (users=> users.status === 'admin');

//   // Your code here:

// }

// console.log(findAdmin(users));
// // Test: findAdmin(users) should return { id: 2, status: 'admin' }


// const expenses = [
//   { title: 'Rent', amount: 1000 },
//   { title: 'Groceries', amount: 200 },
//   { title: 'Internet', amount: 50 }
// ];
// function calculateTotal(items) {

// return expenses.reduce((total, expense) => total + expense.amount, 0);
//   // Your code here:
// }
// console.log(calculateTotal(expenses));

// // Test: calculateTotal(expenses) should return 1250


// import turtle
// t = turtle.Turtle()
// t.foward(400);

const loginBtn = document.getElementById('loginBtn');
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const openLoginBtn = document.getElementById('openLoginBtn');
const chatOutput = document.getElementById('output');
const typeTabs = document.querySelectorAll('.type-tab');
const transactionPanels = document.querySelectorAll('.transaction-panel');

const formatMoney = (value) => {
  return Number(value).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatShortMoney = (value) => {
  return Number(value).toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const showLogin = () => {
  loginOverlay.style.display = 'flex';
};

const hideLogin = () => {
  loginOverlay.style.display = 'none';
};

const setMode = (mode) => {
  loginForm.dataset.mode = mode;

  typeTabs.forEach((tab) => {
    const isActive = tab.dataset.type === mode;
    tab.classList.toggle('active', isActive);
  });

  transactionPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === mode;
    panel.classList.toggle('active', isActive);
  });
};

typeTabs.forEach((tab) => {
  tab.addEventListener('click', () => setMode(tab.dataset.type));
});

loginBtn.addEventListener('click', showLogin);
openLoginBtn.addEventListener('click', showLogin);
loginOverlay.addEventListener('click', (event) => {
  if (event.target === loginOverlay) {
    hideLogin();
  }
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const mode = loginForm.dataset.mode || 'send-money';
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  const time = date.toLocaleTimeString('en-KE', { hour: 'numeric', minute: '2-digit' });

  let message = '';

  if (mode === 'paybill') {
    const reference = document.getElementById('paybillRef').value.trim();
    const business = document.getElementById('paybillBusiness').value.trim();
    const accountNumber = document.getElementById('paybillAccount').value.trim();
    const amount = Number(document.getElementById('paybillAmount').value || 0);
    const balance = Number(document.getElementById('paybillBalance').value || 0);
    const cost = Number(document.getElementById('paybillCost').value || 0);
    const dailyLimit = Number(document.getElementById('paybillLimit').value || 0);

    message = `
      <strong>${reference}</strong> Confirmed. Ksh${formatMoney(amount)} sent to ${business} for account ${accountNumber} on ${formattedDate} at ${time}<br>
      New M-PESA balance is Ksh${formatMoney(balance)}. Transaction cost, Ksh${formatMoney(cost)}. Amount you can transact within the day is ${formatShortMoney(dailyLimit)}. See all your balances now <a href="https://saf.cx/kWQpy" class="mpesa-link" target="_blank" rel="noreferrer">https://saf.cx/kWQpy</a>
    `;
  } else {
    const recipient = document.getElementById('recipientName').value.trim();
    const phone = document.getElementById('recipientPhone').value.trim();
    const amount = Number(document.getElementById('sendAmount').value || 0);
    const balance = Number(document.getElementById('sendBalance').value || 0);
    const cost = Number(document.getElementById('sendCost').value || 0);
    const dailyLimit = Number(document.getElementById('sendLimit').value || 0);

    const shortPhone = phone.replace(/^254/, '0');

    message = `
      <strong>MPESA</strong> Confirmed. Ksh${formatMoney(amount)} sent to ${recipient} ${shortPhone} on ${formattedDate} at ${time}<br>
      New M-PESA balance is Ksh${formatMoney(balance)}. Transaction cost, Ksh${formatMoney(cost)}. Amount you can transact within the day is ${formatShortMoney(dailyLimit)}. See all your balances now <a href="https://saf.cx/MPESA" class="mpesa-link" target="_blank" rel="noreferrer">https://saf.cx/MPESA</a>
    `;
  }

  chatOutput.innerHTML = message;
  hideLogin();
  loginForm.reset();
  setMode('send-money');
});

setMode('send-money');
