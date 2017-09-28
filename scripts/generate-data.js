#!/usr/bin/env node

const fs = require('fs');
const faker = require('faker');
const db = require('../database');

fs.unlinkSync(__dirname + '/../database/db.json');
db.instance.read();
db.instance.defaults({ customers: [], orders: [] }).write();

console.log(' ✓ Database cleared!');

// Create customers
for (var i = 0; i < 100; i++) {
    db.insertCustomer({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        joined: faker.date.past(),
    });
}

console.log(' ✓ Customers created!');

// Create orders.
db.getAllCustomers().forEach((customer) => {
    const orderQuantity = Math.ceil(Math.random() * 5);
    for (var i = 0; i < orderQuantity; i++) {
        const order = {
            status: faker.helpers.randomize([true, false]),
            details: [],
            paidAt: faker.date.past(),
            customerId: customer.id,
        };
        const detailsQuantity = Math.ceil(Math.random() * 5);
        for (var j = 0; j < detailsQuantity; j++) {
            order.details.push({
                line: j + 1,
                description: faker.commerce.productName(),
                price: +faker.commerce.price(),
                quantity: faker.random.number({ max: 10})
            });
            order.total = order.details.reduce((p, c) => p + c.price, 0);
        }
        db.insertOrder(order);
    }
});

console.log(' ✓ Orders created!');
console.log(' ✓ Data generated!')