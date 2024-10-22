import { useState } from 'react'
import Draggable from './components/Draggable';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Board from './components/Board';

const App = () => {
    const [parent, setParent] = useState<UniqueIdentifier | null>(null);

    const draggable = (
        <Draggable id="draggable">
          Go ahead, drag me.
        </Draggable>
    );    

    function handleDragEnd({over}: DragEndEvent) {
        setParent(over ? over.id : null);
    }
    

    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>
                {!parent ? draggable : null}
                <Board id="droppable">
                    {parent === "droppable" ? draggable : 'Drop here'}
                </Board>
            </DndContext>
        </>
    )
}

export default App
