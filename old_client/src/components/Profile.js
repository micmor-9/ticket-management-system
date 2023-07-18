import {useState} from "react";
import {Form} from "react-bootstrap";

/* TODO */
function Profiles(props) {
    const [profile, setProfile] = useState("");

    return (
        <>
            {!profile && <SearchByEmail profile={profile} setProfile={setProfile}/>}
        </>
    )
}

function SearchByEmail(props) {
    const [id, setId] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Label>
                    <Form.Control type="email" placeholder="insert email" value={id}
                                  className={"border-margin"}
                                  onChange={(ev) => setId(ev.target.value)}/>
                </Form.Label>
            </Form>

        </>
    );
}


export default Profiles;