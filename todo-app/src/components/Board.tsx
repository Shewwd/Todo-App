import { useState } from 'react'
import Draggable from './Draggable';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';

const Board = () => {
    const [parent, setParent] = useState<UniqueIdentifier | null>(null);

    const lists = [
        "todo",
        "inprogress",
        "completed"
    ];

    const draggable = (
        <Draggable id="draggable">
          Go ahead, drag me.
        </Draggable>
    );

    return (
        <>
            <DndContext onDragEnd={(item: DragEndEvent) => setParent(item.over ? item.over.id : null)}>
                {!parent ? draggable : null}
                {lists.map((listName) => {
                    return (
                        <Droppable id={listName}>
                            {parent === listName ? draggable : 'Drop here'}
                        </Droppable>
                    );
                })}
            </DndContext>
        </>
    )
};

export default Board;