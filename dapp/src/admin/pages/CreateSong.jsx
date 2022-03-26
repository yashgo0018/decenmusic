import { createRef, useState } from "react";
import { Button, Container, Form, Image, Input, Message, TextArea } from "semantic-ui-react";
import iconDevx from "../../assets/icon-devx.svg"

function CreateSong() {
    const posterFileRef = createRef();
    const musicFileRef = createRef();
    const [selectedPoster, setSelectedPoster] = useState();
    const [selectedMusic, setSelectedMusic] = useState();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPosterPicked, setIsPosterPicked] = useState(false);
    const [isMusicPicked, setIsMusicPicked] = useState(false);

    function posterFileChange(e) {
        if (!e.target.files[0].type.includes('image/')) {
            alert("Invalid Poster Format");
            return;
        }
        setSelectedPoster(e.target.files[0]);
        setIsPosterPicked(true);
    }

    function musicFileChange(e) {
        if (!e.target.files[0].type.includes('audio/')) {
            alert("Invalid Music Format");
            return;
        }
        setSelectedMusic(e.target.files[0]);
        setIsMusicPicked(true);
    }

    function submit(e) {
        e.preventDefault();
        if (!(isMusicPicked && isPosterPicked)) return;

    }

    return <div>
        <Container text>
            <p>Upload Song</p>
            <Form onSubmit={submit}>
                <Form.Group widths={'equal'}>
                    <Form.Field
                        control={Input}
                        label="Name"
                        placeholder="Song Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Field
                    control={TextArea}
                    label="Description"
                    placeholder="Song Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Form.Group widths={'equal'}>

                    <Button
                        content="Choose Poster Image"
                        labelPosition="left"
                        fluid
                        color={isPosterPicked ? "green" : false}
                        icon="image"
                        onClick={() => posterFileRef.current.click()}
                    />
                    <Button
                        content="Choose Music File"
                        labelPosition="left"
                        icon="music"
                        color={isMusicPicked ? "green" : false}
                        fluid
                        onClick={() => musicFileRef.current.click()}
                    />
                </Form.Group>
                <Form.Group>
                    <Button
                        content="Upload"
                        fluid
                        type="submit"
                    />
                </Form.Group>
                <input
                    ref={musicFileRef}
                    type="file"
                    hidden
                    onChange={musicFileChange}
                />
                <input
                    ref={posterFileRef}
                    type="file"
                    hidden
                    onChange={posterFileChange}
                />
            </Form>
        </Container>
    </div>
}

export default CreateSong;