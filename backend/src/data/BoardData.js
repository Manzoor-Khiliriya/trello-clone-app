let boardData = {
    lists: [
        { id: 'todo', title: 'Todo', cards: [
            { id: '1', title: 'Setup project environment' },
            { id: '2', title: 'Design API endpoints' },
        ]},
        { id: 'in-progress', title: 'In Progress', cards: [
            { id: '3', title: 'Implement card movement logic' },
            { id: '4', title: 'Build Express backend' },
        ]},
        { id: 'done', title: 'Done', cards: [
            { id: '5', title: 'Build React + Vite ui' },
            { id: '6', title: 'Write up project plan' },
        ]},
    ]
};

const getBoard = () => boardData;

const moveCard = (sourceListId, destinationListId, cardId, sourceIndex, destinationIndex) => {
    const sourceList = boardData.lists.find(l => l.id === sourceListId);
    const destinationList = boardData.lists.find(l => l.id === destinationListId);

    if (!sourceList || !destinationList) return null;

    if (sourceList.cards[sourceIndex]?.id !== cardId) {
        sourceIndex = sourceList.cards.findIndex(c => c.id === cardId);
        if (sourceIndex === -1) return null;
    }

    const [movedCard] = sourceList.cards.splice(sourceIndex, 1);

    destinationIndex = Math.max(0, Math.min(destinationIndex, destinationList.cards.length));

    destinationList.cards.splice(destinationIndex, 0, movedCard);

    return boardData;
};

module.exports = { getBoard, moveCard };
