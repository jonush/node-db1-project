const express = require('express');

const knex = require('../data/dbConfig');

const router = express.Router();

router.get('/', (req,res) => {
  knex
    .select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json({ data: accounts });
    })
    .catch(err => {
      console.log('GET /', err);
      res.status(500).json({ error: "Could not retrieve the accounts" });
    })
});

router.get('/:id', (req,res) => {
  const { id } = req.params;
  knex
    .select('*')
    .from('accounts')
    .where({ id })
    .then(account => {
      if(account[0]) {
        res.status(200).json({ data: account });
      } else {
        res.status(404).json({ error: `There is no account with id ${id}` });
      }
    })
    .catch(err => {
      console.log('GET /:id', err);
      res.status(500).json({ error: `Account with id ${id} could not be retrieved` });
    })
});

router.post('/', (req,res) => {
  knex('accounts')
    .insert(req.body)
    .then(account => {
      if(req.body.name === '' || req.body.budget < '') {
        res.status(400).json({ error: "Account must have a name and a budget" });
      } else {
        res.status(201).json({ data: req.body });
      }
    })
    .catch(err => {
      console.log('POST /', err);
      res.status(500).json({ error: "Account could not be created" })
    })
});

router.put('/:id', (req,res) => {
  const { id } = req.params;
  knex('accounts')
    .where({ id })
    .update(req.body)
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: "Account successfully updated" });
      } else {
        res.status(400).json({ error: "There were no updates to the account" });
      }
    })
    .catch(err => {
      console.log('PUT /:id', err);
      res.status(500).json({ error: "There was an error updating the account" });
    })
});

router.delete('/:id', (req,res) => {
  const { id } = req.params;
  knex('accounts')
    .where({ id })
    .del()
    .then(account => {
      res.status(200).json({ message: "Account was successfully deleted" });
    })
    .catch(err => {
      console.log('DELETE /:id', err);
      res.status(500).json({ error: "There was error deleting the account" });
    })
});

module.exports = router;