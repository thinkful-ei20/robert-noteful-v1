'use strict';

const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const app = express();
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  let {searchTerm} = req.query;
  if (searchTerm) {
    let response = data.filter(notes => notes.title.includes(searchTerm));
    res.json(response);
  } else {
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  let {id} = req.params;
  let response = data.find(item => item.id === Number(id));
  res.json(response);
});


app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
