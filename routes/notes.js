const notesController = require("../controllers/notes_controller");
const express = require('express');
const router = express.Router();

router.post('/upload', notesController.uploadNotes);                                 // This is route . matlab jis link pe kam karwana hai

module.exports = router;
