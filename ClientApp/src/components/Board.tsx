import { useState } from 'react'
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import Droppable from './Droppable';
import TodoItem from '../models/TodoItem';
import Draggable from './Draggable';

interface Props {
    numItems: number,
    setNumItems: (num: number) => void
};

const Board = (props: Props) => {
    const [items, setItems] = useState<TodoItem[]>([]);

    const lists = [
        "Todo",
        "In Progress",
        "Completed"
    ];

    const dragEnd = (event: DragEndEvent) => {
        const itemIdx = parseInt(event.active.id.toString()) - 1;
    
        const newItemList = items.map((item, index) => {
            if (index === itemIdx) {
                return {
                    ...item,
                    listName: event.over?.id as UniqueIdentifier
                };
            }
            return item;
        });
    
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
        <div className='d-flex mx-auto'>
            <DndContext onDragEnd={dragEnd}>
                {lists.map((listName) =>
                    <Droppable listName={listName} addItem={addItem} key={listName}>
                        {items?.filter(item => item.listName === listName).map(item => item.element)}
                    </Droppable>
                )}
            </DndContext>
        </div>
    )
};

export default Board;