const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: 'Quinta de Odelouca',
    image: 'https://assets.bedful.com/images/1f41572ff57832b06dc41c328bf65932fb56b5e4/large/image.jpg',
    description: 'Low-key camping in the Algarve’s forested mountain range, with excellent options for walking, biking and canoeing'
  },
  {
    name: 'Lima Escape',
    image: 'https://assets.bedful.com/images/6fd79c8c1b3b86f027e63828d0bd23ded43bf7ef/large/image.jpg',
    description: 'A Portuguese paradise for explorers, tree-lovers and anyone who likes the fresh air and sweet smell of an evergreen forest.'
  },
  {
    name: 'Le Clos du Lac',
    image: 'http://mb.web.sapo.io/c6b2e340412aab2a4a70738c7458f9c68b51ec56.jpg&W=1680&H=790&delay_optim=1&tv=2',
    description: 'This camsite is located in Saint-Apollinaire in the Hautes-Alpes, in Provence-Alpes-Côte d\'Azur, a popular destination in France thanks to its high levels of sunshine, the diversity of its landscapes and its cultural heritage. It is located at 50 m from the lake 1.'
  },
  {
    name: 'Camp Liza',
    image: 'http://mb.web.sapo.io/87d91086a354b7763146cacc935fbc67e0b9957b.jpg&W=1024&H=683&delay_optim=1&tv=2',
    description: 'Among the mountain peaks and green alpine pastures, you will find the Bovec Valley with the wonderful, emerald Soča river, joint by the crystal clear and wild Koritnica.'
  }
];

function seedDB () {
  // Remove all campgrounds
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
    }
    // Add initial campgrounds
    data.forEach(seed => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        }
        // Create comment
        Comment.create({
          text: 'This place is great, but I wish there was internet!',
          author: 'Maria'
        }, (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            // add comment to campground and save
            campground.comments.push(comment);
            campground.save();
          }
        });
      });
    });
  });
}

module.exports = seedDB;
