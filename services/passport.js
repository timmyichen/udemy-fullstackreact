const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const keys = require('../config/.keys');

MongoClient.connect(keys.mongoURI, (err, db) => {
  if (err) console.log(err.stack);
  console.log('successfully connected to db for auth');
  
  passport.serializeUser((user, done) => {
    console.log(`serializing user with id of ${user._id}`)
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    db.collection('users').findOne({ _id: ObjectID(id) }, (err, user) => {
      if (err) console.log(err.stack);
      console.log(`deserializing user with id of ${user._id}`)
      done(null, user);
    });
  });
  
  passport.use(new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    }, (accessToken, refreshToken, profile, done) => {
      const userObj = {
        userID: profile.id,
        userEmail: profile.emails[0].value,
      };
      db.collection('users').findOne({ userID: profile.id }, (err, doc) => {
        if (err) console.log(err.stack);
        if (!doc) {
            db.collection('users').insertOne(userObj, (err, res) => {
            if (err) console.log(err.stack);
            console.log(`user registered with email ${userObj.userEmail}`);
            done(null, res.ops[0]);
          });
        } else {
          console.log(`user with email ${userObj.userEmail} logged in`);
          done(null, doc);
        }
      });
    }
  ));
});