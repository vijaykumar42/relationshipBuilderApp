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

const DBUrl = process.env.MONGO_URL || "mongodb://localhost:27017/tagDB";
mongoose.connect(DBUrl, {
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
        res.render('index', {
          relationShipData: relationShipData
        });
      }

  })
})

app.post('/addToTable', (req, res) => {
  // console.log(req.body);
  Relationship.create({
    personOne: req.body.personOne.toLowerCase(),
    personTwo: req.body.personTwo.toLowerCase(),
    relationShip: req.body.relationShip
  }, (err) => {
    console.log(err);
  })
  res.redirect('/')
})

app.post('/updateTags', (req, res) => {
  // console.log(req.body);
  const filter = {
    personOne: req.body.personOne.toLowerCase(),
    personTwo: req.body.personTwo.toLowerCase(),
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

app.post('/degreeOfSeperation', (req, res) => {
  console.log(req.body);
  const x = req.body.personOne.toLowerCase();
  const y = req.body.personTwo.toLowerCase();
  console.log(x, y);
  const query = {
    personOne: x
  }


  Relationship.find(query, (err, data) => {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      Relationship.find({
        personOne: data[i].personTwo
      }, (err, data1) => {
        console.log(data1);
        for (var i = 0; i < data1.length; i++) {
          if (data1[i].personTwo == y) {
            console.log(x + " > " + data1[i].personOne + " > " + data1[i].personTwo);
            let degreeData = {
              first: x,
              second: data1[i].personOne,
              third: data1[i].personTwo
            }
            console.log(degreeData);
              Relationship.find({}, (err, relationShipData) => {
                if(err){
                  console.log(err);
                }
            res.render('result', {
              relationShipData: relationShipData,
              degreeData:degreeData
            });
            })

          }

          for (var i = 0; i < data1.length; i++) {
            Relationship.find({
              personOne: data1[i].personTwo
            }, (err, data2) => {
              console.log(data2 + " inner loop");
              for (var i = 0; i < data2.length; i++) {
                if (data2[i].personTwo == y) {
                  console.log(x + " > " + data1[i].personOne + " > " + data2[i].personOne + " > " + data2[i].personTwo);
                  let degreeData = {
                    first: x,
                    second: data1[i].personOne,
                    third: data2[i].personOne,
                    fourth: data2[i].personTwo
                  }
                  console.log(degreeData);
                  Relationship.find({}, (err, relationShipData) => {
                    if(err){
                      console.log(err);
                    }
                  res.render('result', {
                    relationShipData: relationShipData,
                    degreeData:degreeData
                  });
                  })
                }
              }
            })
          }
        }
      })
    }
  })

})



const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("yeah port is running...");
})
