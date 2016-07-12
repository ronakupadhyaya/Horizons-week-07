module.exports = function(passport) {
    router.get('/auth/trello',
      passport.authenticate('trello'));
    router.get('/auth/trello/callback',
      passport.authenticate('trello', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });
    router.get('/logout', function(req, res, next){
        req.logout();
        res.redirect('/login');
    });
    return router;
}
