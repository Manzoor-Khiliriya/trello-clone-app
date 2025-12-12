import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import List from "./List";
import Card from "./Card";
import { fetchBoard, moveCard, addList, findCardByTag } from "../api/boardApi";

const Board = () => {
  const [boardData, setBoardData] = useState({ lists: [] });
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [tag, setTag] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const data = await fetchBoard();
        setBoardData({ lists: data.lists || [] });
      } catch (err) {
        console.error(err);
        setError("Failed to load board data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, []);

  const findList = (id) => boardData.lists.find((list) => list.id === id);

  const handleDragStart = (event) => {
    const { active } = event;
    const card = boardData.lists
      .flatMap((list) =>
        (list.cards || []).map((card) => ({ ...card, listId: list.id }))
      )
      .find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over || active.id === over.id) return;

    const activeList = findList(active.data.current?.listId);
    const overList = findList(over.data.current?.listId || over.id);
    if (!activeList || !overList) return;

    const sourceListId = activeList.id;
    const destinationListId = overList.id;
    const activeIndex = (activeList.cards || []).findIndex(
      (c) => c.id === active.id
    );
    const overIndex = (overList.cards || []).findIndex((c) => c.id === over.id);
    const cardToMove = activeList.cards?.[activeIndex];
    if (!cardToMove) return;

    if (sourceListId === destinationListId) {
      // Reorder within same list
      const newCards = arrayMove(activeList.cards, activeIndex, overIndex);
      setBoardData((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === sourceListId ? { ...list, cards: newCards } : list
        ),
      }));
      try {
        await moveCard({
          sourceListId,
          destinationListId,
          cardId: cardToMove.id,
          sourceIndex: activeIndex,
          destinationIndex: overIndex,
        });
      } catch (err) {
        console.error(err);
        setError("Reordering failed. Refreshing board...");
        const data = await fetchBoard();
        setBoardData({ lists: data.lists || [] });
      }
    } else {
      // Move between lists
      const newBoardData = JSON.parse(JSON.stringify(boardData));
      const newActiveList = newBoardData.lists.find(
        (l) => l.id === sourceListId
      );
      const newOverList = newBoardData.lists.find(
        (l) => l.id === destinationListId
      );
      const [movedCard] = newActiveList.cards.splice(activeIndex, 1);
      const insertIndex =
        overIndex === -1 || overIndex === undefined
          ? newOverList.cards?.length || 0
          : overIndex;
      newOverList.cards.splice(insertIndex, 0, movedCard);
      setBoardData(newBoardData);
      try {
        await moveCard({
          sourceListId,
          destinationListId,
          cardId: cardToMove.id,
          sourceIndex: activeIndex,
          destinationIndex: insertIndex,
        });
      } catch (err) {
        console.error(err);
        setError("Moving card failed. Refreshing board...");
        const data = await fetchBoard();
        setBoardData({ lists: data.lists || [] });
      }
    }
  };

  const handleDragCancel = () => setActiveCard(null);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    setAddingList(true);
    try {
      const updatedBoard = await addList(newListTitle);
      setBoardData({ lists: updatedBoard.lists || [] });
      setNewListTitle("");
    } catch (err) {
      console.error(err);
      alert("Failed to add list.");
    } finally {
      setAddingList(false);
    }
  };

  const handleTagSearch = async () => {
    const tagValue = tag.trim();
    if (!tagValue) return;
    try {
      const data = await findCardByTag(tagValue);
      setBoardData({ lists: data.lists || [] });
    } catch (err) {
      setError("Tag search failed. Please try again.");
    }
  };

  // Render
  if (loading) return <div className="text-gray-600">Loading board...</div>;
  if (error) return <div className="text-red-600 font-bold">{error}</div>;
  if (!boardData?.lists?.length)
    return <div className="text-gray-600">No lists available.</div>;

  return (
    <>
      {/* Add new list */}
      <div className="flex space-x-2 py-2">
        <input
          type="text"
          placeholder="New list title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          className="p-2 rounded border w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleAddList}
          disabled={addingList}
          className="bg-green-500 cursor-pointer text-white px-3 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {addingList ? "Adding..." : "Add List"}
        </button>
      </div>

      {/* Tag search */}
      <div className="flex space-x-2 py-2">
        <input
          type="text"
          placeholder="Search by tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="p-2 rounded border w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleTagSearch}
          className="bg-blue-500 cursor-pointer text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Board lists */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-row flex-wrap gap-6 overflow-x-auto py-2">
          {boardData.lists.map((list) => (
            <List
              key={list.id}
              list={list}
              boardData={boardData}
              setBoardData={setBoardData}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && (
            <Card
              card={activeCard}
              id={activeCard.id}
              listId={activeCard.listId}
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Board;
