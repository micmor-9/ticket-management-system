import {useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";

/* TODO */
function Profiles(props) {
    const [profile, setProfile] = useState({email: "", name: "", surname: ""})
    const [upProfile, setUpProfile] = useState({email: "", name: "", surname: ""})
    return (
        <>
            {<SearchByEmail upProfile={upProfile} setUpProfile={setUpProfile} profile={profile}
                            profiles={props.profiles} setProfile={setProfile}
                            searchProfileByEmail={props.searchProfileByEmail} addProfile={props.addProfile}
                            updateProfile={props.updateProfile}/>}
        </>
    )
}

function SearchByEmail(props) {
    const [op, setOp] = useState("")
    const [email, setEmail] = useState("")
    const handleSubmit = (event) => {
        event.preventDefault();
        props.searchProfileByEmail(email);
    }
    const handleSubmitPost = (event) => {
        event.preventDefault();
        props.addProfile(props.profile);
    }
    const handleSubmitPut = (event) => {
        event.preventDefault();
        props.updateProfile(props.upProfile);
    }

    return (
        <>
            <Row>
                <Col>
                    Search a profile
                </Col>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Col>
                            <Form.Label>
                                <Form.Control type="email" placeholder="Insert an email" value={email}
                                              onChange={event => setEmail(event.target.value)}></Form.Control>
                            </Form.Label>
                        </Col>
                        <Col>
                            <Button className="mb-3" variant="primary" type="submit">Search</Button>
                        </Col>
                    </Form>
                </Col>
                <Row>
                    <div className={"card"}>
                        <div className={"card-header"}>
                            {props.profiles.email}
                        </div>
                        <ul className={"list-group-item"}>
                            {props.profiles.name}
                        </ul>
                        <ul className={"list-group-item"}>
                            {props.profiles.surname}
                        </ul>
                    </div>
                </Row>
            </Row>
            <Row>
                <Col>Post a profile</Col>
                <Col>
                    <Form onSubmit={handleSubmitPost}>
                        <Col>
                            <Form.Label onChange={event => setOp("post")}>
                                <Form.Control type="email" placeholder="Insert an email" value={props.profile.email}
                                              onChange={event => props.setProfile((prev) => ({
                                                  ...prev,
                                                  "email": event.target.value
                                              }))}/>
                                <Form.Control type="string" placeholder="Insert a name" value={props.profile.name}
                                              onChange={event => props.setProfile((prev) => ({
                                                  ...prev,
                                                  "name": event.target.value
                                              }))}/>
                                <Form.Control type="string" placeholder="Insert a surnname"
                                              value={props.profile.surname}
                                              onChange={event => props.setProfile((prev) => ({
                                                  ...prev,
                                                  "surname": event.target.value
                                              }))}/>
                            </Form.Label>
                        </Col>
                        <Col>
                            <Button className="mb-3" variant="primary" type="submit">Post</Button>
                        </Col>
                    </Form>
                </Col>
                <Row> {props.message} </Row>
            </Row>
            <Row>
                <Col>Update a profile</Col>
                <Col>
                    <Form onSubmit={handleSubmitPut}>
                        <Col>
                            <Form.Label>
                                <Form.Control type="email" placeholder="Insert an email" value={props.upProfile.email}
                                              onChange={event => props.setUpProfile((prev) => ({
                                                  ...prev,
                                                  "email": event.target.value
                                              }))}/>
                                <Form.Control type="string" placeholder="Insert a name" value={props.upProfile.name}
                                              onChange={event => props.setUpProfile((prev) => ({
                                                  ...prev,
                                                  "name": event.target.value
                                              }))}/>
                                println(upProfile.name);
                                <Form.Control type="string" placeholder="Insert a surname"
                                              value={props.upProfile.surname}
                                              onChange={event => props.setUpProfile((prev) => ({
                                                  ...prev,
                                                  "surname": event.target.value
                                              }))}/>
                            </Form.Label>
                        </Col>
                        <Col>
                            <Button className="mb-3" variant="primary" type="submit">Put</Button>
                        </Col>
                    </Form>
                </Col>
            </Row>
            <Row>{props.message}</Row>

        </>
    )
}

export default Profiles;