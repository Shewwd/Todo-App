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

    return (
        <button className='btn btn-outline-primary' style={{ transform: CSS.Translate.toString(transform) }} key={props.id} ref={setNodeRef} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
};

export default Draggable;