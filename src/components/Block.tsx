import { ReactNode } from "react";
import { useDrag } from "react-dnd";

export interface IBlock {
  id: string;
  title: string;
  icon?: ReactNode;
  options?: any;
  render: (options: any) => ReactNode;
}

interface props {
  children?: any;
  title: string;
  type: string;
  icon?: ReactNode;
  render: (options: any) => ReactNode;
}
const Block: React.FC<props> = ({ children, title, render }) => {
  const [{}, dragRef] = useDrag(
    () => ({
      type: "Block",
      item: { title, render },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 1 : 1,
      }),
    }),
    []
  );
  return children ? (
    children
  ) : (
    <div
      ref={dragRef}
      className=" w-20 p-5 shadow-md hover:shadow-lg rounded-md  "
    >
      <span>{title}</span>
    </div>
  );
};

export default Block;
