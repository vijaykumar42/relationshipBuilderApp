const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require('ejs')

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/relationShipDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const relationshipSchema = new mongoose.Schema({
  personOne: String,
  personTwo: String,
  relationShip: String
})

const Relationship = mongoose.model("Relationship", relationshipSchema)



app.get('/', (req, res) => {
  Relationship.find({}, (err, relationShipData) => {
    if (err) {
      console.log(err);
    } else {
      console.log(relationShipData);
      res.render('index', {
        relationShipData: relationShipData
      });
    }
  })
})

app.post('/addToTable', (req, res) => {
  console.log(req.body);
  Relationship.create({
    personOne: req.body.personOne,
    personTwo: req.body.personTwo,
    relationShip: req.body.relationShip
  }, (err) => {
    console.log(err);
  })
  res.redirect('/')
})

app.post('/updateTags', (req, res) => {
  console.log(req.body);
  const filter = {
    personOne: req.body.personOne,
    personTwo: req.body.personTwo,
  }
  const update = {
    relationShip: req.body.relationShip
  }
  Relationship.findOneAndUpdate(filter, update, {
    new: true
  }, (err) => {
    console.log(err);
  })
  res.redirect('/')
})

const port = 3000;
app.listen(port, (req, res) => {
  console.log("yeah port is running...");
})
