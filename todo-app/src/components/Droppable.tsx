import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import TodoItem from "../models/TodoItem";
import Draggable from "./Draggable";

interface Props extends React.PropsWithChildren {
    listName: UniqueIdentifier,
    class?: string,
    addItem: (newItem: TodoItem) => void
}

const Droppable = (props: Props) => {
    const {isOver, setNodeRef} = useDroppable({
        id: props.listName,
    });

    const addItem = () => {
        const newItem: TodoItem = {
            listName: props.listName,
            element: (
                <Draggable id='draggable'>
                    This is a test
                </Draggable>
            )
        };

        props.addItem(newItem);
    };
    
    return (
        <div>
            {props.listName}
            <div ref={setNodeRef} style={{ opacity: isOver ? 1 : 0.5 }} className={props.class}>
                <button onClick={() => {addItem()}}>Add Item</button>
                {props.children}
            </div>
        </div>
    );
};

export default Droppable;