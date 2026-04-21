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


import turtle
t = turtle.Turtle()
t.foward(400)
