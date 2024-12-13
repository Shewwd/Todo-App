import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../AppContext';
import { Button, Spinner } from 'react-bootstrap';
import TodoItem from '../models/TodoItem';
import AddItemModal from './AddItemModal';
import TodoItemCard from './TodoItemCard';

const TodoList = () => {
    const context = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    useEffect(() => {
        GetTodoItems();
    }, [])

    async function GetTodoItems() {
        setLoading(true);
        try { 
            const items = await TodoItem.GetTodoItems(context.DataProvider);
            setTodoItems(items);
        } catch (error) {
            console.error('Error Getting Todo Items:', error)
        }

        setTimeout(() => {
            setLoading(false);
        }, 250);  // 500ms delay to ensure the spinner is visible for a bit
    }

    async function HandleCreateTodoItem(newItem: TodoItem) {
        try {
            await TodoItem.CreateTodoItem(newItem, context.DataProvider);
        } catch (error) {
            console.error("Error Creating Todo Item:", error);
        }
        GetTodoItems();
    }

    async function HandleDeleteTodoItem(id: number) {
        try {
            await TodoItem.DeleteItem(id, context.DataProvider);
        } catch(error) {
            console.error('Error Deleting Todo Item:', error)
        }
        GetTodoItems();
    }

    return (
        <div className='d-flex flex-grow-1'>
            <AddItemModal show={showAddItemModal} close={() => setShowAddItemModal(false)} saveItem={HandleCreateTodoItem}/>
            <div className='d-flex flex-column col m-2'>
                <div className='text-center'>
                    <h3 className='text-uppercase text-muted'>TODO</h3>
                </div>
                <div className='d-flex flex-column flex-grow-1 p-3 border rounded-3 shadow-sm bg-light'>
                    {loading ? 
                        <div className='justify-self-center align-self-center'>
                            <Spinner />
                        </div>
                    :
                        <>
                            <div className='d-flex flex-column gap-2'>
                                {todoItems?.map(todoItem => 
                                    <TodoItemCard todoItem={todoItem} deleteTodoItem={HandleDeleteTodoItem} key={`todo-item-${todoItem.ID}`} />
                                )}
                            </div>
                            <Button onClick={() => {setShowAddItemModal(true)}} className='btn mt-auto px-5'>Add Item</Button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
};

export default TodoList;