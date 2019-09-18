const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Celeb = require('../models/celebrity');



router.get('/', (req, res, next) => {
  Movie.find()
  .then((allMoviesArray) => {
    res.render('movies/index', {allMovies: allMoviesArray});
  })
  .catch((err) =>{
    next(err);
  })
})


router.get('/new', (req, res, next) => {

  Celeb.find()
  .then((allCelebs)=>{
    console.log(allCelebs);
    res.render('movies/newMovie', {allCelebs: allCelebs});
  })
})

router.post('/new', (req, res, next) => {
  let addMovie = {
    title: req.body.theTitle,
    genre: req.body.theGenre,
    plot: req.body.thePlot,
    stars: req.body.theStars
  }


  Movie.create(addMovie)
  .then((result) =>{
    res.redirect('/movies');
  })
  .catch((err) =>{
    res.render('movies/new');
  })

})




router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  Movie.findById(id).populate('stars')
  .then((movieData) =>{
      res.render('movies/details', {movie: movieData});
  })
  .catch((err) => {
    next(err);  
  })
})



router.post('/:id/delete', (req, res, next) => {
  let id = req.params.id;

  Movie.findByIdAndRemove(id)
  .then((result) =>{
    res.redirect('/movies');
  })
  .catch((err) =>{
    next(err);
  })
})


router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;

  Movie.findById(id)
  .then((theMovie) =>{

    Celeb.find()
    .then((allCelebs)=>{

      console.log(allCelebs);
      res.render('movies/editMovie', {movie: theMovie, celebs: allCelebs});
    })

  })
  .catch((err)=>{
    next(err);
  })
})


router.post('/:id', (req, res, next) => {
  
  let id = req.params.id;

  let updateMovie = {
    title: req.body.theTitle,
    genre: req.body.theGenre,
    plot: req.body.thePlot,
    stars: req.body.theStars
  }

  console.log(req.body.theStars);

  Movie.findByIdAndUpdate(id, updateMovie)
  .then((data) =>{
    res.redirect('/movies')
  })
  .catch((err)=>{
    next(err);
  })
})


module.exports = router;