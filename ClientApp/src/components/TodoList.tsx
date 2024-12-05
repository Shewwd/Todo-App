import { useEffect, useState } from 'react'
import TodoItem from '../models/TodoItem';
import AddItemModal from './AddItemModal';
import { Button } from 'react-bootstrap';
import TodoItemCard from './TodoItemCard';

const TodoList = () => {
    const [items, setItems] = useState<TodoItem[]>([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    useEffect(() => {
        GetTodoItems();   
    }, [])

    const CreateTodoItem = async (item: TodoItem) => {
        try {
            const response = await fetch('http://localhost:8080/todoitem', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item)
            });
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
        
            const newItem: TodoItem = await response.json();
            setItems((prevItems) => [...prevItems, newItem]);
          } catch {
            console.error(`Error Creating Todo Item`);
          }        
    }

    const GetTodoItems = async () => {
        try {
            const response = await fetch('http://localhost:8080/todoitem');
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const items: TodoItem[] = await response.json();
            setItems(items);
        } catch {
            console.error('Error Getting Todo Items')
        }
    }

    const DeleteItem = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/todoitem/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            setItems(items.filter((item) => {return item.ID !== id}));
        } catch {
            console.error('Error Getting Todo Items')
        }
    }

    return (
        <div className='d-flex flex-grow-1'>
            <AddItemModal show={showAddItemModal} close={() => setShowAddItemModal(false)} saveItem={CreateTodoItem}></AddItemModal>

            <div className='d-flex flex-column col m-2'>
                <div className='text-center'>
                    <h3 className='text-uppercase text-muted'>TODO</h3>
                </div>
                <div className='d-flex flex-column flex-grow-1 p-3 border rounded-3 shadow-sm bg-light'>
                    <Button onClick={() => {setShowAddItemModal(true)}} className='btn mb-2 px-5'>Add Item</Button>
                    <div className='d-flex flex-column gap-2'>
                        {items?.map(item => 
                            <TodoItemCard item={item} deleteItem={DeleteItem} key={`todo-item-${item.ID}`} />
                        )}
                    </div>
                </div>
            </div>          
        </div>
    )
};

export default TodoList;