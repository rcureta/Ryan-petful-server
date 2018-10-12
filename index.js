'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const app = express();
const Queue = require('./queueClass');

const dogQueue = new Queue();
dogQueue.enqueue({
  imageURL: 'https://i.imgur.com/Kkd0E1m.jpg',
  imageDescription: 'A chihuahua/pincer mix.',
  name: 'Mia',
  sex: 'female',
  age: 3,
  breed: 'Chihuahua',
  story: 'Stupid.'
});
dogQueue.enqueue({
  imageURL: "https://i.imgur.com/DHi2NiO.jpg",
  imageDescription: 'twin brother of Mia and definitely not an excuse to use another image of the same dog',
  name: "Miangelo",
  sex: "male",
  age: 4,
  breed: "Pincer",
  story: "Dumb."
});


const catQueue = new Queue();

catQueue.enqueue({
  imageURL: 'https://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg',
  imageDescription: 'This cat is kinda scary, to be honest.',
  name: 'Dog',
  sex: 'Female',
  age: 5,
  breed: 'Probably a lynx',
  story: 'Stray for Probably a good reason like look at those teeth'
});

catQueue.enqueue({
  imageURL: 'https://news.nationalgeographic.com/content/dam/news/2018/05/17/you-can-train-your-cat/02-cat-training-NationalGeographic_1484324.adapt.676.1.jpg',
  imageDescription: 'So tiny!',
  name: 'Small',
  sex: 'Male',
  age: 7,
  breed: 'Yellow',
  story: 'Was too small to love'
});

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cat', (req, res, next) => {
  console.log('Reached Cat GEt endpoint>>>>>>');
  return res.json(catQueue.peek());

});


app.delete('/api/cat', (req, res, next) => {
  catQueue.dequeue();
  return res.json();
});


app.get('/api/dog', (req, res, next) => {
  return res.json(dogQueue.peek());

});

app.delete('/api/dog', (req, res, next) => {
  dogQueue.dequeue();
  return res.json();
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
