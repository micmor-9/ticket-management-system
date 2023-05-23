import {useState} from "react";
import {Alert, Button, Card, Col, Form, Row} from "react-bootstrap";

function ProfileSearch(props) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState();
    const handleSubmit = (event) => {
        event.preventDefault();
        if(email !== "") {
            props.searchProfileByEmail(email).catch((err) => {
                setError(err)
            })
        }
    }
    return (
        <Card body={true}>
            <Card.Title>
                Profile Search
                <small className="text-body-secondary float-end">GET /api/profiles/email</small>
            </Card.Title>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col xs={12} md={7} className={"text-center"}>
                        <Form.Control type={"text"} placeholder={"Insert Profile Email"} value={email}
                                      onChange={(ev) => setEmail(ev.target.value)}/>
                    </Col>
                    <Col xs={12} md={5} className={"text-center"}>
                        <Button variant={"success"}
                                onClick={handleSubmit}
                                className={"me-3"}
                        >
                            <i className="bi bi-search"/> Search
                        </Button>
                        <Button variant={"outline-danger"} id={"delete-btn"}
                                onClick={() => {
                                    props.setProfileSearch("");
                                    setEmail("");
                                    setError()
                                }}>
                            <i className={"bi bi-backspace-fill"}/> Clear
                        </Button>
                    </Col>
                </Row>
            </Form>

            <div>
                {props.profileSearch && (
                    <Alert variant="success" className={"mt-3"} id={"search-result"}>
                        <Row>
                            <Col xs={6}>
                                <p className={"fw-bold"}>Email</p>
                            </Col>
                            <Col xs={3}>
                                <p className={"fw-bold"}>Name</p>
                            </Col>
                            <Col xs={3}>
                                <p className={"fw-bold"}>Surname</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <p>{props.profileSearch.email}</p>
                            </Col>
                            <Col xs={3}>
                                <p>{props.profileSearch.name}</p>
                            </Col>
                            <Col xs={3}>
                                <p>{props.profileSearch.surname}</p>
                            </Col>
                        </Row>

                    </Alert>
                )}
                {error && props.profileSearch === undefined && (
                    <Alert variant="danger" className={"mt-3"} id={"search-result"}>
                        {error["detail"]}
                    </Alert>
                )}
            </div>
        </Card>
    );
}

export default ProfileSearch;