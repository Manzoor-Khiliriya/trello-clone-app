const boardData = require('../data/BoardData');

exports.getBoardData = (req, res) => {
  try {
    const data = boardData.getBoard();
    return res.json({ success: true, board: data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.moveCardData = (req, res) => {
  try {
    const { sourceListId, destinationListId, cardId, sourceIndex, destinationIndex } = req.body;

    if (!sourceListId || !destinationListId || cardId == null || sourceIndex == null || destinationIndex == null) {
      return res.status(400).json({ error: "Missing required move parameters." });
    }

    const srcIdx = parseInt(sourceIndex, 10);
    const destIdx = parseInt(destinationIndex, 10);

    if (isNaN(srcIdx) || isNaN(destIdx)) {
      return res.status(400).json({ error: "Indices must be valid numbers." });
    }

    const updatedBoard = boardData.moveCard(
      sourceListId,
      destinationListId,
      cardId,
      srcIdx,
      destIdx
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: "Card or list not found during move operation." });
    }

    return res.json({ success: true, board: updatedBoard });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.addCard = (req, res) => {
  try {
    const { listId, title } = req.body;
    if (!listId || !title) {
      return res.status(400).json({ error: "Missing listId or title." });
    }

    const board = boardData.getBoard();
    const list = board.lists.find((l) => l.id === listId);
    if (!list) return res.status(404).json({ error: "List not found." });

    const newCardId = (Math.random() * 100000).toFixed(0);

    const newCard = { id: newCardId, title };
    list.cards.push(newCard);

    return res.json({ success: true, board });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.addList = (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Missing title." });

    const board = boardData.getBoard();
    const newListId = "list_" + (Math.random() * 100000).toFixed(0);

    const newList = { id: newListId, title, cards: [] };
    board.lists.push(newList);

    return res.json({ success: true, board });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.findByTag = (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) {
      return res.status(400).json({ error: "Tag query parameter is required." });
    }
    const board = boardData.getBoard();
    const cardsWithTag = [];
    board.lists.forEach(list => {
      list.cards.forEach(card => {
        if (card.tags && card.tags.includes(tag)) {
          cardsWithTag.push(card);
        }
      });
    });
    return res.status(200).json({ data: cardsWithTag })
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }

} 
