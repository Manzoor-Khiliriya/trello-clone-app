const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/', boardController.getBoardData);
router.post('/card/move', boardController.moveCardData);
router.post('/card', boardController.addCard);
router.post('/list', boardController.addList);
router.get(`/card/search`, boardController.findByTag);


module.exports = router;
