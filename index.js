const express = require('express');
const app = express();
const fs = require('fs');
const db = './db.json';
const port = process.env.port || 3001;
const dataFromDB = require('./db.json');
const Joi = require('@hapi/joi');

app.use(express.json());
//./node_modules/nodemon/bin/nodemon.js express.js
//app.get('/', (req, res) => res.send('Hello world'));
//app.get('/', (req,res) => res.set('content-Type', 'text/html'));

app.get('/', (req, res) => res.send('Hello World'));

app.get('/api/population', (req, res) => {
  fs.readFile(db, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let obj = JSON.parse(data);
      res.send(obj);
    }
  });
});

app.get('/api/population/:id', (req, res) => {
  const errMessage = 'The requested id does not exist, please try again';
  fs.readFile(db, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let obj = JSON.parse(data);
      const foundPerson = obj.population.find((e) => e.id === parseInt(req.params.id));
      !foundPerson || foundPerson === undefined ? res.status(404).send(errMessage) : res.send(foundPerson);
    }
  });
});

app.post('/api/population', (req, res) => {

  const schema = {
    name: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    job: Joi.string().min(2).max(30).required(),
    city: Joi.string().min(2).max(30).required()
  }

  const newPerson = {
    id: dataFromDB.population.length + 1,
    name: req.body.name,
    lastName: req.body.lastName,
    job: req.body.job,
    city: req.body.city,
  }

  fs.readFile(db, 'utf8', readFileCB = (err, data) => {
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data);
      obj.population.push(newPerson); //add some data
      json = JSON.stringify(obj); //convert it back to json

      fs.writeFile(db, json, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!'); // write it to db
      })
    };
  });

  const result = Joi.validate(newPerson, schema)

  console.log(result.error.details);

  result.error ? res.status(400).send(result.error.details[0].message) : res.send(newPerson);
  
});

app.put('/api/population/:id', (req,res) => {
    const foundPerson = obj.population.find((e) => e.id === parseInt(req.params.id));
    !foundPerson || foundPerson === undefined ? res.status(404).send(errMessage) : res.send(foundPerson);

});



app.listen(port, () => console.log(`**** server is running on port ${port} ****`));
