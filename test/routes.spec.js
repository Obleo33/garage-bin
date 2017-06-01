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

    describe('GET /api/v1/garage/:id', () => {
      it('shoud return the specified item', (done) => {
        chai.request(server)
        .get('/api/v1/garage/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body[0].id.should.equal(1);
          response.body[0].name.should.equal('christmass decorations');
          response.body[0].reason.should.equal('summer');
          response.body[0].cleanliness.should.equal('Dusty');
          done();
        });
      });
      it('shoud return 404 if the item does not exist', (done) => {
        chai.request(server)
        .get('/api/v1/garage/4')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
      it('shoud return 404 for a sad path', (done) => {
        chai.request(server)
        .get('/api/v1/garage/tacos')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('POST /api/v1/garage', () => {
      it('should add an item to the garage database', (done) => {
        chai.request(server)
        .post('/api/v1/garage')
        .send({
          id: 4,
          name: 'car',
          reason: 'home',
          cleanliness: 'Sparkling',
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.id.should.equal(4);
          response.body.name.should.equal('car');
          response.body.reason.should.equal('home');
          response.body.cleanliness.should.equal('Sparkling');
          done();
        });
      });
      it('should return 422 if your post is missing data', (done) => {
        chai.request(server)
        .post('/api/v1/garage')
        .send({
          id: 4,
          name: 'car',
          cleanliness: 'Sparkling',
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
      });
    });

    describe('PATCH /api/v1/garage/:id', () => {
      it('should update an item in the garage', (done) => {
        chai.request(server)
        .get('/api/v1/garage/1')
        .end((error, response) => {
          response.body[0].id.should.equal(1);
          response.body[0].name.should.equal('christmass decorations');
        });

        chai.request(server)
        .patch('/api/v1/garage/1')
        .send({
          name: 'tacos',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.id.should.equal(1);
          response.body.name.should.equal('tacos');
          done();
        });
      });
      it('should return 500 if the attribute does not exist', (done) => {
        chai.request(server)
        .patch('/api/v1/garage/1')
        .send({
          tacos: 'tacos',
        })
        .end((error, response) => {
          response.should.have.status(500);
          done();
        });
      });
    });

    describe('DELETE /api/v1/garage/:id', () => {
      it('should delete the selected item', (done) => {
        chai.request(server)
        .delete('/api/v1/garage/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.equal('item removed from garage');
          done();
        });
      });
      it('should return 404 if the item does not exist', (done) => {
        chai.request(server)
        .delete('/api/v1/garage/4')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });
  });
});
