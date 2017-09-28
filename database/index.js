'use strict';

const low = require('lowdb');
const lodashId = require('lodash-id');
const FileSync = require('lowdb/adapters/FileSync');

// Setup lowdb.
const adapter = new FileSync(__dirname + '/db.json');
const db = low(adapter);

db._.mixin(lodashId);

function all(key) {
    return db.get(key).value();
}

function get(key, id) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Not a number: ' + id);
    return db.get(key).getById(parsedId).value();
}

function insert(key, data) {
    const lastInserted = db.get(key).maxBy('id').value();
    const nextId = lastInserted ? lastInserted.id + 1 : 1;
    data.id = nextId;
    db.get(key).push(data).write();
    return data;
}

function update(key, id, partial) {
    db.get(key).updateById(id, partial).write();
    return get(key, id)
}

function remove(key, id) {
    const data = get(key, id);
    db.get(key).removeById(id).write();
    return data;
}

function replace(key, id, data) {
    db.get(key).replaceById(id, data).write();
    return get(key, id);
}

function filter(key, condition) {
    return db.get(key).filter(condition).value();
}

module.exports = {
    instance: db,
    // Customer related methods.
    getAllCustomers: () => all('customers'),
    getCustomerById: (id) => get('customers', id),
    insertCustomer: (customer) => insert('customers', customer),
    updateCustomer: (id, customer) => update('customers', id, customer),
    deleteCustomer: (id) => remove('customers', id),
    replaceCustomer: (id, customer) => replace('customers', id, customer),
    // Order related methods.
    getAllOrders: () => all('orders'),
    getOrderById: (id) => get('orders', id),
    insertOrder: (order) => insert('orders', order),
    updateOrder: (id, order) => update('orders', id, order),
    deleteOrder: (id) => remove('orders', id),
    replaceOrder: (id, order) => replace('orders', id, order),
    // Extra.
    getOrdersByCustomerId: (id) => filter('orders', { customerId: +id }),
    searchCustomers: (query) => filter('customers', query),
    searchOrders: (query) => filter('orders', query),
};