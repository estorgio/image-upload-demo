const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');

const indexRoutes = require('./routes/index');

const dbConnect = require('./utils/db');

dbConnect();

const app = express();

app.use(expressSession({
  name: '_fileuploader',
  secret: 'dguahweriughaerhn',
  resave: false,
  saveUninitialized: false,
}));

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

app.use('/', indexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(`Unable to bind app to port ${port}`);
    return;
  }
  console.log(`App has been started on port ${port}`);
});
