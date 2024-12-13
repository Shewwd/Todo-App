import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import TodoItem from "../models/TodoItem";

interface Props {
    show: boolean,
    close: () => void,
    saveItem: (newItem: TodoItem) => void
}

const AddItemModal = (props: Props) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    function clearForm() {
        setName("");
        setDescription("");
    }

    function handleClose() {
        clearForm();
        props.close();
    };

    function handleSave(event: React.FormEvent) {
        event.preventDefault();  // Prevent page reload

        if (!validateForm()) {
            return;
        }

        const newItem = new TodoItem(-1, name!, description!);
        props.saveItem(newItem);

        handleClose();
    };

    function validateForm(): boolean {
        if (name.trim() === "") {
            alert("Item Name is required.");
            return false;
        }

        if (description.trim() === "") {
            alert("Item Description is required.");
            return false;
        }

        return true;
    }

    return (
        <Modal show={props.show} onHide={handleClose} centered backdrop="static">
            <Form onSubmit={handleSave}>
                <Modal.Header closeButton>
                    <Modal.Title>Add TODO Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Item Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Item Description</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Item Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button type='submit'>Save</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default AddItemModal;