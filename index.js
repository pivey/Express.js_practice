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

const errorObj = {
  noID: 'The requested id does not exist, please try again'
}

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

  fs.readFile(db, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let obj = JSON.parse(data);
      const foundPerson = obj.population.find((e) => e.id === parseInt(req.params.id));
      !foundPerson || foundPerson === undefined ? res.status(404).send(errorObj.noID) : res.send(foundPerson);
    }
  });
});

function validateInput(newPerson) {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    job: Joi.string().min(2).max(30).required(),
    city: Joi.string().min(2).max(30).required()
  }
  return Joi.validate(newPerson, schema);
}

app.post('/api/population', (req, res) => {

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

  //const result = validateInput(newPerson);
  const {
    error
  } = validateInput(newPerson);
  //result.error ? res.status(400).send(result.error.details[0].message) : res.send(newPerson);
  error ? res.status(400).send(error.details[0].message) : res.send(newPerson);

});

app.put('/api/population/:id', (req, res) => {

  fs.readFile(db, 'utf8', (err, data) => {
    if (!data) {
      console.log(err);
      console.log('Error with database');
    } else {
      let obj = JSON.parse(data);

      let foundPerson = obj.population.find((e) => e.id === parseInt(req.params.id));
      !foundPerson || foundPerson === undefined ? res.status(404).send(errorObj.noID) : 
    
      foundPerson.name = req.body.name;
      foundPerson.lastName = req.body.lastName;
      foundPerson.job = req.body.job;
      foundPerson.city = req.body.city;

      obj.population.splice( obj.population.indexOf(foundPerson), 1, foundPerson);

      fs.writeFile(db,  JSON.stringify(obj), 'utf8', (err) => {
        if (err) throw err;
        console.log('could not write to file');
      })

      const {
        error
      } = validateInput(req.body);
  
      error ? res.status(400).send(error.details[0].message) : res.send(foundPerson);
    }
  });
});

app.delete('/api/population/:id', (req, res) => {

  fs.readFile(db, 'utf8', (err, data) => {
    if (!data) {
      console.log(err);
      console.log('Error with database');
    } else {
      let obj = JSON.parse(data);

      let foundPerson = obj.population.find((e) => e.id === parseInt(req.params.id));
      !foundPerson || foundPerson === undefined ? res.status(404).send(errorObj.noID) : 
    

      res.send(obj.population.splice( obj.population.indexOf(foundPerson), 1));

      fs.writeFile(db,  JSON.stringify(obj), 'utf8', (err) => {
        if (err){ throw err;}
        console.log('could not write to file');
      })
    }
  }); 
});

app.listen(port, () => console.log(`**** server is running on port ${port} ****`));
