import { useState } from 'react'
import TodoItem from '../models/TodoItem';
import DroppableList from './droppable/DroppableList';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import AddItemModal from './AddItemModal';
  
interface Props {
    numItems: number,
    setNumItems: (num: number) => void
};

const Board = (props: Props) => {
    const [items, setItems] = useState<TodoItem[]>([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

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

    return (
        <div className='d-flex flex-grow-1'>
            <AddItemModal show={showAddItemModal} close={() => setShowAddItemModal(false)} saveItem={()=>{}}></AddItemModal>
            <DndContext onDragEnd={dragEnd} modifiers={[restrictToWindowEdges]}>
                {/* <DroppableTrash/> */}
                {lists.map((listName) =>
                    <DroppableList listName={listName} key={listName} addItemModalTrigger={() => setShowAddItemModal(true)}>
                        {items?.filter(item => item.listName === listName).map(item => item.element)}
                    </DroppableList>
                )}
                {/* <DroppableTrash/> */}
            </DndContext>
        </div>
    )
};

export default Board;