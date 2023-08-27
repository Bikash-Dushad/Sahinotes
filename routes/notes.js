const notesController = require("../controllers/notes_controller");
const express = require('express');
const router = express.Router();

router.get('/note1', notesController.notesController);                                 // This is route . matlab jis link pe kam karwana hai

router.get('/note2', notesController.notesController2);

module.exports = router;
