const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

const campgrounds = [
  {name: 'Lima Escape', image: 'https://assets.bedful.com/images/6fd79c8c1b3b86f027e63828d0bd23ded43bf7ef/large/image.jpg'},
  {name: 'Quinta de Odelouca', image: 'https://assets.bedful.com/images/1f41572ff57832b06dc41c328bf65932fb56b5e4/large/image.jpg'},
  {name: 'Le Clos du Lac', image: 'http://mb.web.sapo.io/c6b2e340412aab2a4a70738c7458f9c68b51ec56.jpg&W=1680&H=790&delay_optim=1&tv=2'},
  {name: 'Camp Liza, Bovec', image: 'http://mb.web.sapo.io/87d91086a354b7763146cacc935fbc67e0b9957b.jpg&W=1024&H=683&delay_optim=1&tv=2'},
  {name: 'Camping Cala Llevadó', image: 'https://assets.bedful.com/images/010b542c87931cb797f29fcf65320afe580db192/large/image.jpg'},
  {name: 'Lima Escape', image: 'https://assets.bedful.com/images/6fd79c8c1b3b86f027e63828d0bd23ded43bf7ef/large/image.jpg'},
  {name: 'Quinta de Odelouca', image: 'https://assets.bedful.com/images/1f41572ff57832b06dc41c328bf65932fb56b5e4/large/image.jpg'},
  {name: 'Le Clos du Lac', image: 'http://mb.web.sapo.io/c6b2e340412aab2a4a70738c7458f9c68b51ec56.jpg&W=1680&H=790&delay_optim=1&tv=2'},
  {name: 'Camp Liza, Bovec', image: 'http://mb.web.sapo.io/87d91086a354b7763146cacc935fbc67e0b9957b.jpg&W=1024&H=683&delay_optim=1&tv=2'},
  {name: 'Camping Cala Llevadó', image: 'https://assets.bedful.com/images/010b542c87931cb797f29fcf65320afe580db192/large/image.jpg'}
];

// ROUTES
app.get('/', (req, res) => res.render('landing'));

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/campgrounds', urlencodedParser, (req, res) => {
  if (!req.body) {
    return res.sendStatus('400');
  }
  const name = req.body.name;
  const image = req.body.image;
  // add new campground
  campgrounds.push({name, image});
  res.redirect('campgrounds');
});

// START SERVER
app.listen(3000, () => console.log('Yelp Camp server listening on port 3000'));
