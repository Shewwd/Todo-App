import { useState } from 'react'
import TodoItem from '../models/TodoItem';
import Draggable from './Draggable';
import DroppableList from './droppable/DroppableList';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
  
interface Props {
    numItems: number,
    setNumItems: (num: number) => void
};

const Board = (props: Props) => {
    const [items, setItems] = useState<TodoItem[]>([]);

    const lists = [
        "Todo"
    ];

    const dragEnd = (event: DragEndEvent) => {
        if(event.over !== null && lists.indexOf(event.over.id.toString()) !== -1){
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
        } else {
            // delete the item
        }
        
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

        createTodoItem(props.numItems + 1);

        props.setNumItems(props.numItems + 1);
        setItems((prevItems = []) => [...prevItems, newItem])

        return newItem;
    };

    const createTodoItem = async (ID: number) => {
        const response = await fetch('https://special-yodel-gw6jq76x7rp3v549-8080.app.github.dev/todoitem', {
            method: 'POST',
            body: JSON.stringify({ 'id': ID }), // string or object
            headers: { 'Content-Type': 'application/json' }
          })
        const json = await response.json();
        console.log(json);
    }

    return (
        <div className='d-flex flex-grow-1'>
            <DndContext onDragEnd={dragEnd} modifiers={[restrictToWindowEdges]}>
                {/* <DroppableTrash/> */}
                {lists.map((listName) =>
                    <DroppableList listName={listName} addItem={addItem} key={listName}>
                        {items?.filter(item => item.listName === listName).map(item => item.element)}
                    </DroppableList>
                )}
                {/* <DroppableTrash/> */}
            </DndContext>
        </div>
    )
};

export default Board;