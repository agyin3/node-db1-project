const knex = require('knex');

const configOptions = require('../knexfile').production;

module.exports = knex(configOptions);