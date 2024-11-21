import { Button, Form, Modal } from "react-bootstrap";
import TodoItem from "../models/TodoItem";
import { useState } from "react";

interface Props {
    show: boolean,
    close: () => void,
    saveItem: (item: TodoItem) => void
}

const AddItemModal = (props: Props) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const clearForm = () => {
        setName("");
        setDescription("");
    }

    const handleClose = () => {
        clearForm();
        props.close();
    };

    const handleSave = () => {
        // Input validation
        if (name.trim() === "") {
            alert("Item Name is required.");
            return;
        }

        if (description.trim() === "") {
            alert("Item Description is required.");
            return;
        }

        // Create new TodoItem
        const item: TodoItem = {
            ID: -1, // Placeholder ID; real ID will be assigned in the backend
            Name: name!,
            Description: description!
        };

        // Pass the new item to the parent and reset state
        props.saveItem(item);
        handleClose(); // Close modal after saving
    };


    return (
        <Modal show={props.show} onHide={handleClose} centered backdrop="static">
            <Form onSubmit={handleSave}>
                <Modal.Header closeButton>
                    <Modal.Title>Add TODO Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Item Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Item Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter Item Description" value={description} onChange={(e) => setDescription(e.target.value)} />
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