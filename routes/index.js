const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));    /* checks wheather it is starting with /user or /notes.
                                              if it is starting with /user it will go to user.js file. */
router.use('/notes', require('./notes'));

router.use('/auth', require('./auth'));

module.exports = router;