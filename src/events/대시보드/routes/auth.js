const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/kakao', passport.authenticate('kakao'), async (req, res) => {
    if (!req.user) {
        res.redirect('/')
    } else {
        res.redirect('/')
    }
});

router.get('/google', passport.authenticate('google'), async function (req, res) {
    if (!req.user) {
        res.redirect('/')
    } else {
        res.redirect('/')
    }
})

module.exports = router;