import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

interface Props extends React.PropsWithChildren {
    id: UniqueIdentifier
}

const Droppable = (props: Props) => {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });

    const style = {
        opacity: isOver ? 1 : 0.5,
    };
    
    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
};

export default Droppable;