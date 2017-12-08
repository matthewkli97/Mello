import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Modal } from "./Modal";
import {
    Container,
    CardBody,
    Card,
    ListGroupItem,
    ListGroup,
    Navbar,
    Input,
    ButtonGroup,
    Button,
    Row,
    Col
} from 'reactstrap';

export default class NotesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            message: "",
            selectedMessageId: undefined
        };
    }

    componentDidMount() {
        // this.ref 
        //     = firebase.database()
        //         .ref("messages/" + this.props.match.params.meetingId)
        //         .orderByChild("time");

        // this.ref.on("value", function(snapshot) {
        //     this.setState({ conversations: snapshot.val() });
        //   });
    }

    handleKeyPress = (event) => {
        if (event.charCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            // this.ref.push({ 
            //    user: this.user.displayName, 
            //    message: this.state.message,  
            //    time: firebase.database.ServerValue.TIMESTAMP,
            //    edited: false
            // }).catch((error) => console.log(error.message))
            this.setState({ message: "" });
        }
    }

    updateSelectedMessage = (message) => {
        this.setState({ selectedMessageId: message });
    }

    toggle = () => {
    // toggle = (noteId) => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
        // this.setState({ 
        //     isModalOpen: !this.state.isModalOpen,
        //     selectedMessageId: noteId
        // });
    }

    handleOnChange = (event) => {
        this.setState({ message: event.target.message }); 
    }

    delete = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
        // this.ref.child(this.state.selectedMessageId).remove()
        //    .then(() => this.setState({ isModalOpen: !this.state.isModalOpen }));
    }

    render() {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8];
        let taskItems = arr.map((task, index) => {
            let tempTask = arr[task];

            return <NoteItem key={index} task={tempTask} toggle={this.toggle} updateMsg={this.updateSelectedMessage} />;
        });

        const styles = StyleSheet.create({
            textarea: {
                height: "15vh",
                display: "fixed"
            },
            listGroup: {
                height: "70vh",
                overflow: "scroll"
            },
            navbar: {
                margin: 0,
                borderRadius: 0
            }
        });

        return (
            <div>
                <Navbar color="primary" className={css(styles.navbar)} />
                <ListGroup className={css(styles.listGroup)}>
                    {taskItems}
                </ListGroup>
                <Container>
                    <Input
                        placeholder="Enter a message..."
                        type="textarea"
                        onChange={this.handleOnChange}
                        onKeyPress={this.handleKeyPress}
                        className={css(styles.textarea)}
                    />
                </Container>
                <Modal isOpen={this.state.isModalOpen} onClose={() => this.toggle()}>
                    <h2>Are you sure you want to delete this post?</h2>
                    <p><Button id='close' onClick={() => this.toggle()}>Close</Button></p>
                    <p><Button id='delete' onClick={() => this.delete()}>Delete</Button></p>
                </Modal>
            </div>
        );
    }
}

class NoteItem extends Component {
    constructor(props) {
        super(props);
        // this.key = Object.keys(this.props.note)[0];
        this.state = {
            edit: false,
            display: false,
        }
    }

    handleMouseEnter = () => {
        this.setState({ display: true });
    }

    handleMouseLeave = () => {
        this.setState({ display: false });
    }

    handleEdit = () => {
        this.setState({ edit: true });
    }

    handleKeyPress = (event) => {
        if (event.charCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            // this.props.ref.child(this.key)
            //    .set({ edited: true })
            //    .then(() => {
            //        this.setState({ edit: false });
            //    })
            //    .catch((error) => console.log(error.message));
            this.setState({ edit: false });
        }
    }

    render() {
        return (
            <ListGroupItem
                tag="a"
                action
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <Container>
                    <Card>
                        <CardBody>
                            <Row>
                                <NoteContent
                                    edit={this.state.edit}
                                    display={this.state.display}
                                    handleEdit={this.handleEdit}
                                    handleEnter={this.handleKeyPress}
                                    handleChange={this.handleChange}
                                    toggle={this.props.toggle}
                                    updateMsg={this.props.updateMsg}
                                    // noteId={this.key}
                                />
                            </Row>
                            <small> Jenny Liang, 9:00 AM </small>
                            {/* <small> 
                                {this.props.note.displayName} {this.props.note.time} {this.props.note.edited && (Edited)} 
                                </small> */}
                        </CardBody>
                    </Card>
                </Container>
            </ListGroupItem>
        );
    }
}

class Buttons extends Component {
    render() {
        const styles = StyleSheet.create({
            hide: {
                display: "none"
            },
            hover: {
                ":hover": {
                    backgroundColor: "rgb(250,250,250)"
                }
            }
        });

        return (
            <ButtonGroup size="md" className={css(!this.props.display && styles.hide)}>
                <Button
                    onClick={this.props.handleEdit}
                    className={css(styles.hover)}
                >
                    Edit
                </Button>
                <Button
                    // onClick={this.props.toggle(this.props.noteId)}
                    onClick={this.props.toggle}
                    className={css(styles.hover)}
                >
                    Delete
                </Button>
            </ButtonGroup>
        );
    }
}

class NoteContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: "TEST"
        }
    }

    handleChange = (event) => {
        this.setState({ messageContent: event.target.value });
    }

    render() {
        let display = this.props.edit ?
            <Input
                placeholder="Enter a message..."
                type="textarea"
                value={this.state.messageContent}
                onKeyPress={this.props.handleEnter}
                onChange={this.handleChange}
            /> :
            <div>
                <Col sm={10}>
                    <ul>
                        <li>During meetings, we take notes.</li>
                        <ul>
                            <li> WOW! </li>
                        </ul>
                        <li>During meetings, we take notes.</li>
                        <li>During meetings, we take notes.</li>
                        <li>During meetings, we take notes.</li>
                    </ul>
                </Col>
                <Col sm={2}>
                    <Buttons
                        display={this.props.display}
                        handleEdit={this.props.handleEdit}
                        toggle={this.props.toggle}
                        updateMsg={this.props.updateMsg}
                        noteId={this.props.noteId}
                    />
                </Col>
            </div>;
        return (
            display
        );
    }
}