const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const db = './db.json';
const port = process.env.port || 3001;
const dataFromDB = require('./db.json');
const Joi = require('@hapi/joi');
const API_caller = require('./API_caller');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/******************************************************************/
                    
/*
  **** API notes ****

  when making an HTTP POST request The values are sent in the request body, 
  in the format that the content type specifies. Usually the content type is 
  application/x-www-form-urlencoded, so the request body uses the same format 
  as the query string:

  eg. parameter=value&also=another

  express.urlencoded() and express.json() are middleware, which we use in order to parse 
  the body parameter of request that was sent from the client. when you do not have these 
  middleware employed you do not have parsed body param in your req.body.
*/

/*************************************************/ 

// even though you prefix /api to the router at the bottom of the page you still need to add /api to reach the desired page when using this routing. 

router.get('/', (req, res) => {
  res.json({
    "message": "first page rendered",
  });
});

router.get("/user/:id", function (req, res) {
  res.json({
    "message": "Hello " + req.params.id
  });
});

router.get('/breeds', async (req, res) => {
  const call = await API_caller.make_API_call('https://dog.ceo/api/breeds/image/random')
    .then(res => {
      return 'here\'s a picture of a dog: ' + JSON.stringify(res.data.message);
    });

  res.send(call);
});

// ************************************************ API Endpoints ********************************************************

const errorObj = {
  noID: 'The requested id does not exist, please try again'
}

// app.get('/', (req, res) => res.send('Home page'));

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
  const schema = Joi.object().keys({
    id: Joi.number(),
    name: Joi.string().trim().min(2).max(30).required(),
    // name: Joi.string().trim().min(2).max(30).valid('nick').required().label('only mad decent guys are allowed'),
    lastName: Joi.string().trim().min(2).max(30).required(),
    email: Joi.string().trim().email().required(),
    address: Joi.string().trim().regex(/^[\w\d\s\-\.\,]*$/i).max(30).required()
  })
  // return Joi.validate(newPerson, schema);
  return Joi.validate(newPerson, schema, {
    abortEarly: false
  });
}

app.post('/api/population', (req, res) => {

  const newPerson = {
    id: dataFromDB.population.length + 1,
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
  }

  const {
    error
  } = validateInput(newPerson);

  if (error) {
    const errObj = {};
    for (let i = 0; i < error.details.length; i += 1) {
      errObj[i] = error.details[i].message;
    }
    res.status(404).send(errObj);
  } else {
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

    res.send(newPerson);
  }

});

app.put('/api/population/:id', (req, res) => {

  fs.readFile(db, 'utf8', (err, data) => {
    if (!data) {
      console.log(err);
      console.log('Error with database');
    } else {
      let obj = JSON.parse(data);
      let foundPerson = obj.population.find((e) => e.id === parseInt(req.params.id));
      const {
        error
      } = validateInput(req.body);

      console.log(error);

      if (error) {
        const errObj = {};
        for (let i = 0; i < error.details.length; i += 1) {
          errObj[i] = error.details[i].message;
        }
        res.status(404).send(errObj);
      } else {
        foundPerson.name = req.body.name;
        foundPerson.lastName = req.body.lastName;
        foundPerson.email = req.body.email;
        foundPerson.address = req.body.address;

        obj.population.splice(obj.population.indexOf(foundPerson), 1, foundPerson);

        fs.writeFile(db, JSON.stringify(obj), 'utf8', (err) => {
          if (err) throw err;
          console.log('could not write to file');
        })

        res.send(foundPerson);
      }
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


        res.send(obj.population.splice(obj.population.indexOf(foundPerson), 1));

      fs.writeFile(db, JSON.stringify(obj), 'utf8', (err) => {
        if (err) {
          throw err;
        }
        console.log('could not write to file');
      })
    }
  });
});

/**************************** Error routing and router prefixing ************************/

app.use("/api", router);

// handle 404 errors 
app.use(function (req, res, next) {
  return res.status(404).send({
    message: 'Route' + req.url + ' Not found.'
  });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({
    error: err
  });
});

/**************************** Listening server ************************/

app.listen(port, () => console.log(`**** server is running on port ${port} ****`));
