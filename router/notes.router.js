'use strict';
const express = require('express');
const data = require('../db/notes');
const simDB = require('../db/simDB'); 
const notes = simDB.initialize(data);
const router = express.Router();

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then(list => res.json(list)) // responds with filtered array
    .catch(err => next(err)); // goes to error handler
});

router.get('/:id', (req, res, next) => {
  let { id } = req.params;
  id = Number(id);
  if (!id){
    return next();
  }
  notes.find(id)
    .then(item => res.json(item))
    .catch(err=> next(err)); // goes to error handler
});

router.put('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  notes.update(id, updateObj)
    .then(item=> {
      if (item) res.json(item);
      else next();
    })
    .catch(err=> next(err));
});

router.post('/', (req, res, next)=> {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next)=> {
  let {id} = req.params;
  notes.delete(id)
    .then(res.status(204).end())
    .catch(err => next(err));
});

module.exports = router;