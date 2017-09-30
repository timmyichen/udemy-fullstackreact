const passport = require('passport');

const { host } = require('../config/.keys');

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect(`${host}/surveys`);
    }
  );
  
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
  
  app.get('/api/logout', (req, res) => {
    if (req.user) {
      console.log(`user with email ${req.user.userEmail} logged out`)
      req.logout();
      res.redirect(`${host}/`);
    }  
  })
};