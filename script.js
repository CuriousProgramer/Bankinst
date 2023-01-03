'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const usd = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let user = 'Steven Thomas Williams';
const arr = [];
const createUser = function(accounts){
  accounts.forEach((acc)=>{
    acc.username = acc.owner.toLowerCase().split(' ').map((mov)=>{
      return mov[0];
    }).join('');
  })
}
createUser(accounts);

const displayMovements = function (movements, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;
  movs.forEach(function(mov, i){

    

    const type = mov > 0 ? 'deposit': 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date"> Date </div>
    <div class="movements__value">${Math.abs(mov)} $</div>
  </div>`;
  containerMovements.insertAdjacentHTML('afterbegin',html);
  })
}




const calcDisplayBalance = function(acc){
  const balance = acc.movements.reduce(function(acc,mov){
    return acc + mov;
  })
  labelBalance.textContent = `${balance} $`;
  acc.balance = balance;
  return balance;
}

const calcDisplaySummary = function(movements){
  const income = movements.filter((mov) => mov > 0).reduce((acc , mov) => acc + mov);
  labelSumIn.textContent = `${income} $`;

  const out = movements.filter((mov) => mov < 0).reduce((acc,mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)} $`;

  const interest = movements.filter((mov) => mov > 0)
  .map((mov) => (mov * 1.2) / 100 )
  .filter((int) => int > 1)
  .reduce((acc,int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} $`;

  return interest;  
}





// createUser(accounts);

// console.log(accounts);

// const balance = movements.reduce((acc,curr)=>{
//   return acc + curr;
// })

// console.log(balance);

// const a = movements.find(mov => mov < 0);
// console.log(a);

// const accout = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(accout);


const UpdateUI = function(currentAccount){
  displayMovements(currentAccount.movements);
    // Displaying Balance
    calcDisplayBalance(currentAccount);
    // Displaying Summary
    calcDisplaySummary(currentAccount.movements);
}


let currentAccount;

btnLogin.addEventListener('click',function(e){
  // Prevent form from submitting
  e.preventDefault();
  console.log("Hello");

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount.pin === Number(inputLoginPin.value)){
    console.log("Login");
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    // Displaying movements
    displayMovements(currentAccount.movements);
    // Displaying Balance
    calcDisplayBalance(currentAccount);
    // Displaying Summary
    calcDisplaySummary(currentAccount.movements);
  }
  else{
    console.log("Galat panga le rha jani!!!");
  }

})





btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const currentBalance = currentAccount.movements.reduce((acc,mov) => acc + mov);
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(acc => acc.username == inputTransferTo.value);
  if(amount > 0 && recieverAccount && amount < currentAccount.balance && recieverAccount?.username !== currentAccount.username){
    console.log("Valid Transfer");
    currentAccount.movements.push(-amount);
  recieverAccount.movements.push(amount);

  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount.movements);
  }
  else{
    console.log("Pehle itna paisa laaa!!!");
  }
  
  const a = "2390 $";
  console.log(currentAccount);
  
})


btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount >0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);

    UpdateUI(currentAccount);
  }
  
})



btnClose.addEventListener('click', function(e){
  e.preventDefault();
  console.log(currentAccount.balance);
  if(inputCloseUsername.value == currentAccount.username && Number(inputClosePin.value) == currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username == currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(`${index} wale account ko bnd kr do`);
  }
  
})



//const totalBalance = accounts.map(acc => acc.movements).flat().reduce((acc,mov) => acc+mov);
//console.log(totalBalance);

movements.sort((a,b) => {
  if(a > b) return 1;
  if(b > a) return -1;
});

console.log(movements);

let sorted = true;
btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})




labelBalance.addEventListener('click', function(){
  const UImov = Array.from(document.querySelectorAll('.movements__value'));
  console.log(UImov.map(mov => Number(mov.textContent.replace('$', ''))));
  
})


const totalDeposits = accounts.map(acc => acc.movements).flat().filter(mov => mov > 1000).length;  
console.log(totalDeposits);




// console.log(sconst sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
//   return sums;
// }, {deposits: 0, withdrawals: 0});
// console.log(sums);

// const title = 'this is a nice title';

// const sub = title.split(' ').map(mov => mov[0].toUpperCase()+mov.slice(1));
// ub);


// const arr3 = [1,2,3,4,5];

// console.log(arr3);


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
  ];


dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 *28;
  
});

dogs.forEach(dog => {
  let okayFood;
  if(dog.curFood > (dog.recommendedFood * 0.90) && dog.curFood < (dog.recommendedFood * 1.10)) okayFood = true;
  else okayFood = false;

  dog.okayFood = okayFood;
})

const sarahDog = dogs.find(mov => mov.owners.includes('Sarah'));
console.log(sarahDog);

sarahDog.curFood > sarahDog.recommendedFood ? console.log("Zyad khata") : console.log("Tek khata");

const ownersEatTooMuch = dogs.filter(mov => mov.curFood > mov.recommendedFood).map(mov => mov.owners).flat();
const ownersEatTooLitle = dogs.filter(mov => mov.curFood < mov.recommendedFood).map(mov => mov.owners).flat();
console.log(ownersEatTooMuch, ownersEatTooLitle);

let ownersMuchStr = ``;

ownersEatTooMuch.forEach(mov => {
  ownersMuchStr += `${mov} `;
})

ownersMuchStr += 'eat too much';
console.log(ownersMuchStr);

dogs.forEach(mov => {
  console.log(`This dog is eating ${mov.okayFood} amount of food`);
})

const okay = dogs.filter(dog => dog.okayFood == true);

const obj = {
  name: 'farhan',
  age: 17,
}

for (const [i,j] of Object.entries(obj)) {
    console.log(i,j);
} 





