const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


async function generateHashedPassword() {
const saltRounds = 10;
return bcrypt.hash('coder123', saltRounds);
}


// Genera un array de objetos con formato similar a un documento Mongo
async function generateUsers(amount = 50) {
if (typeof amount !== 'number' || amount <= 0) amount = 50;
const hashed = await generateHashedPassword();
const roles = ['user', 'admin'];


const users = [];
for (let i = 0; i < amount; i++) {
const first_name = faker.name.firstName();
const last_name = faker.name.lastName();
const email = faker.internet.email(first_name, last_name).toLowerCase();
const age = faker.datatype.number({ min: 18, max: 80 });
const role = roles[Math.floor(Math.random() * roles.length)];


users.push({
_id: new mongoose.Types.ObjectId(),
first_name,
last_name,
email,
age,
password: hashed,
role,
pets: []
});
}
return users;
}


// Genera mascotas simples (no persistidas). Puede adaptarse al schema Pet
function generatePets(amount = 20) {
const species = ['dog', 'cat', 'hamster', 'bird', 'rabbit'];
const pets = [];
for (let i = 0; i < amount; i++) {
pets.push({
_id: new mongoose.Types.ObjectId(),
name: faker.animal.type() + '-' + faker.datatype.number({min:1,max:999}),
species: species[Math.floor(Math.random() * species.length)],
age: faker.datatype.number({ min: 0, max: 15 }),
owner: null
});
}
return pets;
}


module.exports = { generateUsers, generatePets };