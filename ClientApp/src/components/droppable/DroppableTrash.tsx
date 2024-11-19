import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

const DroppableTrash = () => {
    const {setNodeRef} = useDroppable({
        id: 'Trash' as UniqueIdentifier,
    });
    
    return (
        <div className='d-flex flex-column align-items-center justify-content-center flex-grow-1 col bg-danger opacity-75' ref={setNodeRef}>
            <img src='./icon-trash.svg' />
        </div>
    );
};

export default DroppableTrash;