import {useState} from "react";
import {Alert, Button, Card, Col, Form, Row} from "react-bootstrap";

function ProductSearch(props) {
    const [id, setId] = useState("");
    const [error, setError] = useState();
    const handleSubmit = (event) => {
        event.preventDefault();
        if(id !== "") {
            props.searchProductById(id).catch((err) => {
                setError(err)
            });
        }
    }
    return (
        <Card body={true}>
            <Card.Title>
                Product Search
                <small className="text-body-secondary float-end">GET /api/products/productId</small>
            </Card.Title>
            <Form onSubmit={handleSubmit} noValidate={true}>
                <Row>
                    <Col xs={12} md={7} className={"text-center"}>
                        <Form.Control type={"text"} placeholder={"Insert Product Id"} value={id} required={true}
                                      onChange={(ev) => setId(ev.target.value)}/>
                    </Col>
                    <Col xs={12} md={5} className={"text-center"}>
                        <Button variant={"success"}
                                type={"submit"}
                                onClick={handleSubmit}
                                className={"me-3"}
                        >
                            <i className="bi bi-search"/> Search
                        </Button>
                        <Button variant={"outline-danger"} id={"delete-btn"}
                                onClick={() => {
                                    props.setProductSearch("");
                                    setId("");
                                }}>
                            <i className={"bi bi-backspace-fill"}/> Clear
                        </Button>
                    </Col>
                </Row>
            </Form>

            <div>
                {props.productSearch && (
                    <Alert variant="success" className={"mt-3"} id={"search-result"}>
                        <Row>
                            <Col xs={4}>
                                <p className={"fw-bold"}>ID: </p>
                            </Col>
                            <Col xs={8}>
                                <p className={"fw-bold"}>Name:</p>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={4}>
                                <p>{props.productSearch.id}</p>
                            </Col>
                            <Col xs={8}>
                                <p>{props.productSearch.name}</p>

                            </Col>
                        </Row>

                    </Alert>
                )}
                {error && props.productSearch === undefined && (
                    <Alert variant="danger" className={"mt-3"} id={"search-result"}>
                        {error["detail"]}
                    </Alert>
                )}
            </div>
        </Card>
    );
}

export default ProductSearch;