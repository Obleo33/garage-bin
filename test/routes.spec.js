process.env.NODE_ENV = 'test';

const environment = 'test';
const configuration = require('../knexfile')[environment];
const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('knex')(configuration);
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp)
