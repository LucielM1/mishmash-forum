const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('landing'));

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    {name: 'Lima Escape', image: 'https://assets.bedful.com/images/dc19eff2f146a2303c37874b9e19dd58c34806f6/large/image.jpg'},
    {name: 'Quinta de Odelouca', image: 'https://assets.bedful.com/images/ded7e9c062946a33cab609942b07e5f27007ccfe/large/image.jpg'},
    {name: 'O Tamanco', image: 'https://assets.bedful.com/images/5f805ebd5909e46dca67e9ec538bf051720886fa/large/image.jpg'}
  ];
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(3000, () => console.log('Yelp Camp server listening on port 3000'));
