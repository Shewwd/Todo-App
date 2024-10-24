import { useState } from 'react'
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';
import TodoItem from '../models/TodoItem';
import Draggable from './Draggable';

interface Props {
    class?: string,
    numItems: number,
    setNumItems: (num: number) => void
};

const Board = (props: Props) => {
    const [items, setItems] = useState<TodoItem[]>([]);

    const lists = [
        "todo",
        "inprogress",
        "completed"
    ];

    const dragEnd = (event: DragEndEvent) => {
        const itemIdx = parseInt(event.active.id.toString()) - 1;
    
        // Create a new array by mapping over the current items and updating the dragged item
        const newItemList = items.map((item, index) => {
            if (index === itemIdx) {
                return {
                    ...item, // Copy the existing item properties
                    listName: event.over?.id as UniqueIdentifier // Update the list name
                };
            }
            return item;
        });
    
        // Set the updated array in state
        setItems(newItemList);
    };
    

    const addItem = (listName: UniqueIdentifier) => {
        const newItem: TodoItem = {
            listName: listName,
            element: (
                <Draggable id={props.numItems} key={props.numItems}>
                    This is Todo list item {props.numItems}
                </Draggable>
            )
        };

        props.setNumItems(props.numItems + 1);
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