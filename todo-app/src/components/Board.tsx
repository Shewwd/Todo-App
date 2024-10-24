import { useState } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Droppable from './Droppable';
import TodoItem from '../models/TodoItem';

interface Props {
    class?: string
};

const Board = (props: Props) => {
    const [items, setItems] = useState<TodoItem[]>();

    const lists = [
        "todo",
        "inprogress",
        "completed"
    ];

    const dragEnd = (item: DragEndEvent) => {
        console.log(item);
    };

    const addItem = (newItem: TodoItem) => {
        setItems((prevItems = []) => [...prevItems, newItem])

        return newItem;
    };

    return (
        <>
            <div className={props.class}>
                <DndContext onDragEnd={dragEnd}>
                    {lists.map((listName) =>
                        <Droppable listName={listName} key={listName} class='d-flex flex-column border p-1 h-100' addItem={addItem}>
                            {items?.filter(item => item.listName === listName).map(item => item.element)}
                        </Droppable>
                    )}
                </DndContext>
            </div>
        </>
    )
};

export default Board;