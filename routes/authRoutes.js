const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));
  
  app.get('/auth/google/callback', passport.authenticate('google'));
  
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
  
  app.get('/api/logout', (req, res) => {
    if (req.user) {
      console.log(`user with email ${req.user.userEmail} logged out`)
      req.logout();
      res.send(req.user);
    } else {
      res.send('no one is logged in!')
    }
  })
};