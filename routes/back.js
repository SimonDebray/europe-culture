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

/* GET back office users. */
router.get('/users', function(req, res, next) {
  res.render('back-users', { title: 'Mon super back office' });
});

module.exports = router;
