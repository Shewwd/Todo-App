import { Accordion, Button } from "react-bootstrap";
import TodoItem from "../models/TodoItem";

interface Props {
    todoItem: TodoItem,
    deleteTodoItem: (id: number) => void
}

const TodoItemCard = (props: Props) => {

    function handleDelete() {
        if(confirm("Are you sure you want to delete this Todo Item?"))
            props.deleteTodoItem(props.todoItem.ID);
    }

    return (
        <Accordion>
            <Accordion.Header className="border">
                {props.todoItem.Name}
            </Accordion.Header>
            <Accordion.Body className="border">
                <div>
                    {props.todoItem.Description}
                </div>
                <div className="d-inline-flex w-100">
                    <Button className="btn-sm ms-auto" onClick={handleDelete}>Delete</Button>
                </div>
            </Accordion.Body>
        </Accordion>
    )
}

export default TodoItemCard;