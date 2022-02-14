import React, { useContext, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { IBlock } from "../components/Block";
import Event from "../components/Event";

interface props {
  children?: any;
}
export const BuilderContext = React.createContext<{
  blocks: IBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<IBlock[]>>;
  events: Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (event: Event) => void;
  selectedBlock?: IBlock;
  setSelectedBlock: React.Dispatch<React.SetStateAction<IBlock | undefined>>;
  addBlock: (block: IBlock) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, block: Partial<IBlock>) => void;
}>({
  blocks: [],
  setBlocks : ()=> null,
  events: [],
  addEvent: () => null,
  deleteEvent: () => null,
  setSelectedBlock: () => null,
  selectedBlock: undefined,
  addBlock: () => null,
  deleteBlock: () => null,
  updateBlock: () => null,
});

export const useBuilderContext = () => useContext(BuilderContext);
const Builder: React.FC<props> = ({ children }) => {
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<IBlock | undefined>(
    undefined
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderContext.Provider
        value={{
          selectedBlock,
          setSelectedBlock,
          blocks,
          setBlocks,
          events,
          addBlock: (block) => {
            setBlocks((blocks) => {
              const newArr = [...blocks];
              newArr.push(block);
              return newArr;
            });
            setEvents((events) => {
              const newArr = [...events];
              newArr.push({ type: "ADD", block });
              return newArr;
            });
          },
          deleteBlock: (id) => {
            setBlocks((blocks) => {
              const newArr = [...blocks];
              return newArr.filter((innerBlock) => innerBlock.id != id);
            });
          },
          updateBlock: (id, block) => {
            const newArr = [...blocks];
            const index = newArr.findIndex((block) => block.id == id);
            if (index != -1) {
              return newArr.splice(index, 1).splice(index, 0);
            }
            return newArr;
          },
          addEvent: (event) => {
            setEvents((events) => {
              const newArr = [...events];
              newArr.push({ ...event });
              return newArr;
            });
          },
          deleteEvent:()=>{

          }
        }}
      >
        {children}
      </BuilderContext.Provider>
    </DndProvider>
  );
};

export default Builder;
