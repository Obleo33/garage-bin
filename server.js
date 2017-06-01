const environment = process.env.NODE_ENV || 'development';

const express = require('express');
const bodyParser = require('body-parser');
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'garage-bin';

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/api/v1/garage', (request, response) => {
  database('garage').select()
  .then(items => response.status(200).json(items))
  .catch(error => response.status(500).send(error));
});

app.get('/api/v1/garage/:id', (request, response) => {
  database('garage').where({ id: request.params.id }).select()
  .then((item) => {
    if (item.length) {
      response.status(200).json(item);
    } else {
      response.sendStatus(404);
    }
  })
  .catch(error => response.status(404).send(error));
});

app.post('/api/v1/garage', (request, response) => {
  const validItem = ['name', 'reason', 'cleanliness'].every(prop => request.body.hasOwnProperty(prop));
  const item = request.body;

  if (validItem) {
    database('garage').insert(item, ['id', 'name', 'reason', 'cleanliness'])
      .then(item => response.status(201).json(item[0]))
      .catch(error => response.sendStatus(422));
  } else {
    response.sendStatus(422);
  }
});

app.patch('/api/v1/garage/:id', (request, response) => {
  const keys = Object.keys(request.body);
  database('garage').where({ id: request.params.id }).update(request.body, ['id', ...keys])
  .then((updated) => {
    if (updated.length) {
      response.status(200).send(updated[0]);
    } else {
      response.sendStatus(404);
    }
  })
  .catch(error => response.status(500).send(error));
});

app.delete('/api/v1/garage/:id', (request, response) => {
  database('garage').where({ id: request.params.id }).select()
    .then((item) => {
      if (item.length) {
        database('garage').where({ id: request.params.id }).del()
        .then(() => response.status(200).send('item removed from garage'))
        .catch(error => response.status(500).send(error));
      } else {
        response.sendStatus(404);
      }
    })
    .catch(error => response.status(500).send(error));
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
