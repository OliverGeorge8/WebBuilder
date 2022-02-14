import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { v4 } from "uuid";
import update from 'immutability-helper'
import { useBuilderContext } from "./Builder";
import Component from "../components/Component";

interface props {
  children?: any;
}

const Canvas: React.FC<props> = ({ children }) => {
  const { blocks, addBlock, deleteBlock, setBlocks,setSelectedBlock } = useBuilderContext();
  const [collectedProps, drop] = useDrop(() => ({
    accept: ["Block"],
    hover: (item, monitor) => {},
    drop: (item: any, monitor) => {
      const id = v4();
      addBlock({ ...item, id });
    },
    canDrop: (item: any, monitor) => {
      return true;
    },
  }));

  const move = useCallback((dragIndex: number, hoverIndex: number) => {
    setBlocks((blocks) =>update(blocks, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, blocks[dragIndex]],
      ],
    })
  );
  }, []);

  const renderComponent = useCallback((block, i) => {
    return <Component key={block.id} block={block} move={move} index={i} />;
  }, []);
  return (
    <div ref={drop} className="p-5 space-y-3">
      {blocks.map((block, i) => {
        return renderComponent(block, i);
      })}
    </div>
  );
};

export default Canvas;
