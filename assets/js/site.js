console.log('hello??');

import saveData from './modules/localStorage.js';

import {readData, test} from './modules/localStorage.js';

// Save to localStorage
const person = {
  name: 'John Doe',
  age: 25
};

saveData('person', person);

// Read localstorage
const savedPerson = readData('person');
console.log('Saved person:', savedPerson);

// Test function from localStorage module
test();