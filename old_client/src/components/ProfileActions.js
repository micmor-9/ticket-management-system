import {Alert, Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import API from "../API";

export const ProfileActionsMode = {
    CREATE: 0,
    UPDATE: 1
}

export function ProfileActions(props) {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const handleClose = () => {
        setShow(false);
        props.setModalError("");
        setEmail();
        setName();
        setSurname();
    }
    const handleShow = () => setShow(true);

    const handleSubmit = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        const profile = {
            "email": email,
            "name": name,
            "surname": surname
        }
        props.setModalError("")

        if (props.action === ProfileActionsMode.CREATE)
            props.addProfile(profile)
        else
            props.updateProfile(profile)
    }

    const checkProfile = () => {
        if (email !== "") {
            API.getProfileByEmail(email).then((profile) => {
                setName(profile.name)
                setSurname(profile.surname)
                props.setModalError("")
            }).catch((err) => {
                setName()
                setSurname()
                props.setModalError(err)
            })
        }
    }
    return (
        <>
            <Button className={"me-4"} onClick={handleShow}>
                <i className="bi bi-person-add"/> {props.action === ProfileActionsMode.CREATE ? "Create" : "Update"} Profile
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.action === ProfileActionsMode.CREATE ? "Create" : "Update"} Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.action === ProfileActionsMode.CREATE && props.modalError && (
                        <Alert
                            variant={props.modalError.status === 409 || props.modalError.status === 400 ? "danger" : "success"}>
                            {props.modalError.status === 409 || props.modalError.status === 400 ? props.modalError.detail : "Profile created successfully!"}
                        </Alert>
                    )}
                    {props.action === ProfileActionsMode.UPDATE && props.modalError && (
                        <Alert
                            variant={props.modalError.status === 404 || props.modalError.status === 400 ? "danger" : "success"}>
                            {props.modalError.status === 404 || props.modalError.status === 400 ? props.modalError.detail : "Profile updated successfully!"}
                        </Alert>
                    )}
                    <Form id={"createProfileForm"} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="createProfileEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="info@example.com" required={true} value={email}
                                          onChange={(e) => setEmail(e.target.value)} onBlur={(e) => {
                                if (props.action === ProfileActionsMode.UPDATE)
                                    checkProfile()
                            }}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createProfileName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" required value={name}
                                          disabled={props.action === ProfileActionsMode.UPDATE && name === undefined ? true : false}
                                          onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createProfileSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text" required value={surname}
                                          disabled={props.action === ProfileActionsMode.UPDATE && surname === undefined ? true : false}
                                          onChange={(e) => setSurname(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" form={"createProfileForm"} type={"submit"}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}