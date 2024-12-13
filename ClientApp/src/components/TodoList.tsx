import { useContext, useEffect, useState } from 'react'
import TodoItem from '../models/TodoItem';
import AddItemModal from './AddItemModal';
import { Button } from 'react-bootstrap';
import TodoItemCard from './TodoItemCard';
import { AppContext } from '../AppContext';

const TodoList = () => {
    const context = useContext(AppContext);
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    useEffect(() => {
        GetTodoItems();
    })

    async function GetTodoItems() {
        try {
            const items = await TodoItem.GetTodoItems(context.DataProvider);
            setTodoItems(items);
        } catch (error) {
            console.error('Error Getting Todo Items:', error)
        }
    }

    async function handleCreateTodoItem(newItem: TodoItem) {
        try {
            const createdItem = await TodoItem.CreateTodoItem(newItem, context.DataProvider);
            setTodoItems((prevItems) => [...prevItems, createdItem]);
        } catch (error) {
            console.error("Error Creating Todo Item:", error);
        }
    }

    async function handleDeleteTodoItem(id: number) {
        try {
            await TodoItem.DeleteItem(id, context.DataProvider);
            setTodoItems(todoItems.filter((todoItem) => {return todoItem.ID !== id}));
        } catch(error) {
            console.error('Error Deleting Todo Item:', error)
        }
    }

    return (
        <div className='d-flex flex-grow-1'>
            <AddItemModal show={showAddItemModal} close={() => setShowAddItemModal(false)} saveItem={handleCreateTodoItem}/>
            <div className='d-flex flex-column col m-2'>
                <div className='text-center'>
                    <h3 className='text-uppercase text-muted'>TODO</h3>
                </div>
                <div className='d-flex flex-column flex-grow-1 p-3 border rounded-3 shadow-sm bg-light'>
                    <Button onClick={() => {setShowAddItemModal(true)}} className='btn mb-2 px-5'>Add Item</Button>
                    <div className='d-flex flex-column gap-2'>
                        {todoItems?.map(todoItem => 
                            <TodoItemCard todoItem={todoItem} deleteTodoItem={handleDeleteTodoItem} key={`todo-item-${todoItem.ID}`} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TodoList;