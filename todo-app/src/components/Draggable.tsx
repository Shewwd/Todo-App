import React from 'react';
import {UniqueIdentifier, useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface Props extends React.PropsWithChildren {
    id: UniqueIdentifier
};

const Draggable = (props: Props) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
    });

    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    };

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
};

export default Draggable;