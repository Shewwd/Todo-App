import { Accordion, Button } from "react-bootstrap";
import TodoItem from "../models/TodoItem";

interface Props {
    item: TodoItem,
    deleteItem: (id: number) => void
}

const TodoItemCard = (props: Props) => {

    const handleDelete = () => {
        if(confirm("Are you sure you want to delete this Todo Item?"))
            props.deleteItem(props.item.ID);
    }

    return (
        <Accordion>
            <Accordion.Header className="border">
                {props.item.Name}
            </Accordion.Header>
            <Accordion.Body className="border">
                <div>
                    {props.item.Description}
                </div>
                <div className="d-inline-flex w-100">
                    <Button className="btn-sm ms-auto" onClick={handleDelete}>Delete</Button>
                </div>
            </Accordion.Body>
        </Accordion>
    )
}

export default TodoItemCard;