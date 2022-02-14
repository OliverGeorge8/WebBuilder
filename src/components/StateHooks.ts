import { useContext } from "react";
import { BuilderContext } from "../main/Builder";

export const useStateManagement = () => {
  const { events, deleteBlock, addEvent } = useContext(BuilderContext);

  const undo = () => {
    const event = events.pop();

   let index =  events.findIndex((event)=> event.type.startsWith("undo"));
   index = index == -1 ? events.length -1 : index - 1
         
   if (event?.type == "ADD") {
      deleteBlock(event.block.id);
    } else if (event?.type == "Update") {
    } else if (event?.type == "DELETE") {
    } else if (event?.type == "") {
    }

  };

  const redo = () => {
    let index = -1;
    for (let i = 0; i < events.length; i++) {
      if (events[i].type.startsWith("undo")) {
        index = i;
      }
    }
    if (index != -1) {
      const event = events[index];
      //@ts-ignore
      addEvent({ type: event.type.split(":")[1], block: event.block });
    }
  };

  return { undo, redo };
};
