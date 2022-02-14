import {IBlock} from "./Block";

export default interface Event {
  type: "ADD" | "DELETE" | "Update";
  block: IBlock;
}
