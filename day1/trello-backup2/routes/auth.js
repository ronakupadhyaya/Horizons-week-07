var router = require('express').Router();
module.exports = function(passport) {

    router.get('/auth/trello', passport.authenticate('trello'));

    router.get('/auth/trello/callback', passport.authenticate('trello', {failureRedirect: '/'}),
        function(req, res) {
            res.redirect('/boards')
            }
        );

    return router;
};