const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./services/passport');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

const keys = require('./config/.keys');

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);
billingRoutes(app);
surveyRoutes(app);

if (process.env.NODE_ENV === 'production') {
  //express serves up production assets (static files)
  app.use(express.static('client/build'));

  //express handles unrecognized routes
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

MongoClient.connect(keys.mongoURI, (err, db) => {
  if (err) {
    console.log(`Failed to connect to the database. ${err.stack}`);
  }
  app.locals.db = db;
  console.log('successfully connected to db on server start')
  
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  });
});