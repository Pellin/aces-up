const express = require('express');
const hbs = require('hbs');

const port = process.env.PORT || 3000;

let app = express();

app.set('view engine', 'hbs');

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
  });
});

app.get('/experiment', (req, res) => {
  res.render('experiment.hbs', {
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
