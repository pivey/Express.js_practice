const express = require('express');
const app = express();
const port = process.env.port || 3001;
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const Bear = require('./models/bear');
const bodyParser = require('body-parser');

/******************* middleware ****************************/

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/******************* MongoDB ****************************/

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'db';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

// Connect to the db
mongoose.connect("mongodb://localhost:27017/db", {
  useNewUrlParser: true
}, function (err, db) {
  if (err) {
    console.log("connection failed");
  } else if (!err) {
    console.log('connection established');
  }
});

// ************************** Router middleware, mentioned it before defining routes.

router.use((req, res, next) => {
  console.log('/' + req.method);
  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes();
  console.log('we have lift off: ', time);
  next();
});

// router.use("/user/:id", function (req, res, next) {
//   if (req.params.id == 0) {
//     res.json({
//       "message": "You must pass ID other than 0"
//     });
//   } else next();
// });

/***************** Provide all routes here, this is for Home page *****************/

app.get('/', (req, res) => res.send('Well done you found the first page!!'));
app.get('/', (req, res) => res.set('content-Type', 'text/html'));

/********************************** Endpoints *************************************/

router.route('/bears')
  .post(function (req, res) {

    var bear = new Bear();
    bear.name = req.body.name;

    bear.save(function (err) {
      if (err)
        res.send(err);

      res.json({
        message: 'Bear created!' + ' ' + bear
      });
    });

  })

  .get(function (req, res) {
    Bear.find(function (err, bears) {
      if (err) res.send(err);
      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  .get(function (req, res) {
    Bear.findById(req.params.bear_id, function (err, bear) {
      if (err)
        res.send(err);
      res.json(bear);
    });
  })

  .put(function (req, res) {

    Bear.findById(req.params.bear_id, function (err, bear) {

      if (err)
        res.send(err);

      bear.name = req.body.name;

      bear.save(function (err) {
        if (err)
          res.send(err);

        res.json({
          message: 'Bear updated!' + ' ' + bear
        });
      });

    });
  })

  .delete(function (req, res) {
    Bear.remove({
      _id: req.params.bear_id
    }, function (err, bear) {
      if (err)
        res.send(err);

      res.json({
        message: 'Successfully deleted'
      });
    });
  });


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


app.listen(port, () => console.log(`**** server is running on port ${port} ****`));
