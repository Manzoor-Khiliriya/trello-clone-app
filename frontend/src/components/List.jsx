import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";
import { addCard } from "../api/boardApi";

const List = ({ list, boardData, setBoardData }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: list.id,
    data: { type: "list" },
  });

  const cardIds = list.cards.map((card) => card.id);

  // State for "Add Card" UI
  const [adding, setAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;
    setSaving(true);
    try {
      const updatedBoard = await addCard({ listId: list.id, title: newCardTitle });
      setBoardData(updatedBoard);
      setNewCardTitle("");
      setAdding(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add card.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="bg-gray-200 w-80 p-3 rounded-lg flex-shrink-0"
      ref={setNodeRef}
    >
      <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2 border-gray-300">
        {list.title} ({list.cards.length})
      </h3>

      
      <div
        className={`min-h-12 transition duration-200 ease-in-out ${
          isOver ? "bg-blue-100 p-2 rounded-md" : "p-1"
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              id={card.id}
              index={index}
              listId={list.id}
            />
          ))}
        </SortableContext>
      </div>

      <div className="my-2">
        {adding ? (
          <div className="flex flex-col space-y-2">
            <textarea
              autoFocus
              rows={2}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddCard}
                disabled={saving}
                className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {saving ? "Adding..." : "Add Card"}
              </button>
              <button
                onClick={() => { setAdding(false); setNewCardTitle(""); }}
                className="px-3 py-1 cursor-pointer rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center cursor-pointer space-x-1 text-gray-600 hover:bg-gray-300 w-full p-2 rounded transition"
          >
            <span className="text-xl font-bold">+</span>
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default List;
