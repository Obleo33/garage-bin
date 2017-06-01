/* eslint-env node, mocha */
process.env.NODE_ENV = 'test';

const environment = 'test';
const configuration = require('../knexfile')[environment];
const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('knex')(configuration);
const server = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('garage-bin testing', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      database.seed.run()
      .then(() => {
        done();
      });
    });
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('API routes', () => {
    describe('GET /api/v1/garage', () => {
      it('should return all items in the garage', (done) => {
        chai.request(server)
        .get('/api/v1/garage')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.have.length(3);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('reason');
          response.body[0].should.have.property('cleanliness');
          done();
        });
      });
    });
  });
});
