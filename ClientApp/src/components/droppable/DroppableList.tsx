import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

interface Props extends React.PropsWithChildren {
    listName: UniqueIdentifier,
    addItem: (listName: UniqueIdentifier) => void
}

const DroppableList = (props: Props) => {
    const {setNodeRef} = useDroppable({
        id: props.listName,
    });
    
    return (
        <div className='d-flex flex-column col m-2'>
            <div className='text-center'>
                <h3 className='text-uppercase text-muted'>{props.listName}</h3>
            </div>
            <div className='d-flex flex-column flex-grow-1 p-3 border rounded-3 shadow-sm bg-light' ref={setNodeRef}>
                <button onClick={() => {props.addItem(props.listName)}} className='btn btn-sm btn-outline-secondary mb-2 px-5'>Add Item</button>
                {props.children}
            </div>
        </div>
    );
};

export default DroppableList;