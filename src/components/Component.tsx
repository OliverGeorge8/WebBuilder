import { DuplicateIcon, TrashIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord, Identifier } from "dnd-core";

import { v4 } from "uuid";
import { useBuilderContext } from "../main/Builder";
import { IBlock } from "./Block";
import { render } from "@testing-library/react";

interface props {
  children?: any;
  block: IBlock;
  move: (dragIndex: number, hoverIndex: number) => void;
  index: number;
}
interface DragItem {
  index: number;
  id: string;
  type: string;
}
const Component: React.FC<props> = ({ block, move, index }) => {
  const { blocks, addBlock, deleteBlock, setSelectedBlock, selectedBlock } =
    useBuilderContext();
  const [showHelpers, setShowHelpers] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "Component",
    collect(monitor: any) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      move(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "Component",
    item: () => {
      return { id: block.id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      onClick={() => {
        setSelectedBlock(block);
      }}
      onMouseEnter={() => {
        setShowHelpers(true);
      }}
      onMouseLeave={() => {
        setShowHelpers(false);
      }}
    >
      <div
        className={`justify-between   p-1  ${
          showHelpers || selectedBlock?.id == block.id ? "flex" : "hidden"
        } ${selectedBlock?.id == block.id ? "bg-blue-500" : "bg-gray-300"}`}
      >
        <div className="text-white">{block.title}</div>
        <div>
          <TrashIcon
            className="w-5 h-5 inline text-white cursor-pointer"
            onClick={() => {
              deleteBlock(block.id);
            }}
          />
          <DuplicateIcon
            className="w-5 h-5 inline text-white cursor-pointer"
            onClick={() => {
              addBlock({ ...block, id: v4() });
            }}
          />
        </div>
      </div>
      <div
        className={`hover:border-2  ${
          selectedBlock?.id == block.id
            ? "hover:border-blue-500 border-2 border-blue-500"
            : "hover:border-gray-300"
        }`}
      >
        {block.render(null)}
      </div>
    </div>
  );
};

export default Component;
