import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

interface Props extends React.PropsWithChildren {
    listName: UniqueIdentifier,
    class?: string,
    addItem: (listName: UniqueIdentifier) => void
}

const Droppable = (props: Props) => {
    const {isOver, setNodeRef} = useDroppable({
        id: props.listName,
    });
    
    return (
        <div>
            {props.listName}
            <div ref={setNodeRef} style={{ opacity: isOver ? 1 : 0.5 }} className={props.class}>
                <button onClick={() => {props.addItem(props.listName)}}>Add Item</button>
                {props.children}
            </div>
        </div>
    );
};

export default Droppable;