import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({ card, id, listId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "card",
      listId,
    },
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white p-3 mb-3 rounded-md shadow-md cursor-grab
        ${isDragging ? "opacity-70 shadow-2xl scale-105 border-2 border-blue-500" : "border border-gray-200"}
        transition duration-150 ease-in-out
      `}
    >
      <h4 className="font-semibold text-gray-800">{card.title}</h4>
      <p className="text-xs text-gray-500 mt-1">ID: {card.id}</p>
    </div>
  );
};

export default Card;
