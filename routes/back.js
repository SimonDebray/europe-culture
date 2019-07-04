var express = require('express');
var db = require("../firebase/firestore");
var router = express.Router();

/* GET back office dashboard. */
router.get('/', function(req, res, next) {
  res.render('back', { title: 'Mon super back office' });
});

/* GET back office questions. */
router.get('/questions', function(req, res, next) {
  
  let citiesRef = db.collection('parameters');
  let allQuestions = citiesRef.get()
    .then(snapshot => {
      let data = {};
      
      snapshot.forEach(doc => {
        data[doc.id] = doc.data();
      });
      
      res.render('back-questions', {
        countries : data.questionsCountries,
        types: data.questionTypes,
        categories: data.questionCategories,
        giga: "QSDF",
        title: "Mon super back office !"
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
});

/* GET back office questions. */
router.post('/questions/new', function(req, res, next) {
  
  if (Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  
  let file = req.files.card,
    path = '/cards/' + req.files.card.name,
    direct = './cards/' + req.files.card.name;
  
  // Use the mv() method to place the file somewhere on your server
  file.mv(direct, function(err) {
    if (err)
      return res.status(500).send(err);
  
    req.body.card = path;
  
    let addDoc = db.collection(req.body.country).add(
      req.body
    ).then(ref => {
      console.log('Added document with ID: ', ref.id);
    });
  });
  res.redirect("back/questions")
});

/* GET back office users. */
router.get('/users', function(req, res, next) {
  res.render('back-users', { title: 'Mon super back office' });
});

module.exports = router;
