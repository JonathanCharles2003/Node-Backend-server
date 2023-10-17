const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {// / or /index (.html) is optional
    //
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;