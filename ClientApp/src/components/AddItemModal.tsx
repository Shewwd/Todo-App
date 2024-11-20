import { Button, Form, Modal } from "react-bootstrap";

interface Props {
    show: boolean,
    close: () => void,
    saveItem: () => void
}

const AddItemModal = (props: Props) => {

    const handleClose = () => props.close();

    return (
        <Modal show={props.show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add TODO Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Item Name" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button onClick={handleClose}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddItemModal;