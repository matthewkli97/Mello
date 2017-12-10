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

import firebase from 'firebase/app';
import 'firebase/database';

export default class NotesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            message: "",
            selectedMessageId: undefined,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.chatRef = firebase.database().ref("messages/" + this.props.meetingId);

        this.chatRef.on('value', (snapshot) => {
            this.setState({ messages: snapshot.val(), loading: false });
        });
    }

    componentWillUnmount() {
        this.chatRef.off();
    }

    handleKeyPress = (event) => {
        if (event.charCode == 13 && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();

            this.chatRef.push({
                user: this.props.currentUser.displayName,
                message: this.state.message,
                time: firebase.database.ServerValue.TIMESTAMP,
                edited: false
            }).catch((error) => console.log(error.message))

            this.setState({ message: "" });
        }
    }

    updateSelectedMessage = (message) => {
        this.setState({ selectedMessageId: message });
    }
    toggle = (noteId) => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            selectedMessageId: noteId
        });
    }

    handleOnChange = (event) => {
        this.setState({ message: event.target.value });
    }

    delete = () => {
        this.chatRef.child(this.state.selectedMessageId).remove()
            .then(() => this.setState({ isModalOpen: !this.state.isModalOpen }));
    }

    render() {
        const styles = StyleSheet.create({
            textarea: {
                height: "15vh",
                display: "fixed",
                position: "relative",
                width: "100%"
            },
            container: {
                position: "relative",
                width: "100%"
            },
            listGroup: {
                height: "48vh",
                overflow: "scroll"
            },
            navbar: {
                height: "5vh",
                margin: 0,
                borderRadius: 0
            }
        });

        let noteItems = null;

        if (this.state.messages !== undefined && this.state.messages !== null) {
            noteItems = Object.keys(this.state.messages).map((note) => {
                let tempNote = this.state.messages[note];
                return <NoteItem dbRef={this.chatRef} key={note} noteId={note} note={tempNote} toggle={this.toggle} updateMsg={this.updateSelectedMessage} toggleModal={this.props.toggleModal} currentUser={this.props.currentUser} />;
            });
        }

        return (
            <div>
                <Navbar color="primary" className={css(styles.navbar)} />
                <ListGroup className={css(styles.listGroup)}>
                    {noteItems}
                </ListGroup>
                <Container className={css(styles.textarea)}>
                    <Input
                        placeholder="Enter a message..."
                        type="textarea"
                        value={this.state.message}
                        onChange={this.handleOnChange}
                        onKeyPress={this.handleKeyPress}
                        className={css(styles.textarea)}
                    />
                </Container>
                <DeleteModal
                    isModalOpen={this.state.isModalOpen}
                    toggle={this.toggle}
                    delete={this.delete}
                />
            </div>
        );
    }
}

class DeleteModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.isModalOpen} onClose={() => this.props.toggle()}>
                <h2>Are you sure you want to delete this post?</h2>
                <p><Button id='close' onClick={() => this.props.toggle()}>Close</Button></p>
                <p><Button id='delete' onClick={() => this.props.delete()}>Delete</Button></p>
            </Modal>
        );
    }
}

class NoteItem extends Component {
    constructor(props) {
        super(props);
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
        if (event.charCode == 13 && !event.shiftKey && event.target.value !== "") {
            event.preventDefault();
            event.stopPropagation();
            this.props.dbRef.child(this.props.noteId)
                .set({
                    edited: true,
                    message: event.target.value,
                    time: this.props.note.time,
                    user: this.props.note.user
                })
                .then(() => {
                    this.setState({ edit: false });
                })
                .catch((error) => console.log(error.message));
        }
    }

    render() {
        const styles = StyleSheet.create({
            container: {
                width: "100%",
            },
            smallText: {
                fontWeight: "300"
            }
        });
        let moment = require('moment');
        let time = moment(this.props.note.time + "", "x").fromNow();
        let displayButtons = this.props.currentUser !== undefined && this.props.currentUser !== null;
        if (displayButtons) {
            displayButtons = this.props.currentUser.displayName === this.props.note.user;
        }

        return (
            <ListGroupItem
                tag="a"
                action
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <Container className={css(styles.container)}>
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
                                    note={this.props.note}
                                    noteId={this.props.noteId}
                                    toggleModal={this.props.toggleModal}
                                    displayButtons={displayButtons}
                                />
                            </Row>
                            <small className={css(styles.smallText)}>
                                {this.props.note.user}, {time}. {this.props.note.edited && "(Edited)"}
                            </small>
                        </CardBody>
                    </Card>
                </Container>
            </ListGroupItem>
        );
    }
}

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.toggleFn = null;
    }

    componentWillMount() {
        this.toggleFn = this.props.toggle;
    }
    render() {
        const styles = StyleSheet.create({
            hide: {
                display: "none"
            },
            hover: {
                ":hover": {
                    backgroundColor: "rgb(250,250,250)",
                    color: "black"
                }
            }
        });

        return (
            <ButtonGroup size="sm" className={css(!this.props.display && styles.hide)}>
                {this.props.displayButtons &&
                    <ButtonGroup>
                        <Button
                            onClick={this.props.handleEdit}
                            className={css(styles.hover)}
                        >
                            Edit
                    </Button>
                        <Button
                            onClick={() => this.toggleFn(this.props.noteId)}
                            className={css(styles.hover)}
                        >
                            Delete
                    </Button>
                    </ButtonGroup>
                }
                <Button
                    onClick={() => this.props.toggleModal(this.props.htmlCode)}
                    className={css(styles.hover)}
                >
                    New Task
                </Button>
            </ButtonGroup>
        );
    }
}

class NoteContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: this.props.note.message
        }
    }

    handleChange = (event) => {
        this.setState({ messageContent: event.target.value });
    }

    getHTMLCode() {
        let Remarkable = require('remarkable');
        let md = new Remarkable();
        let content = md.render(this.props.note.message);

        let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        let links = content.match(regex);

        if (links != null) {
            links.forEach(link => {
                let newLink = "<a href='" + link + "' target='_blank'>" + link + "</a>";
                content = content.replace(link, newLink);
            });
        }
        return content;
    }

    render() {
        const styles = StyleSheet.create({
            textContent: {
                height: "15vh"
            },
            chatText: {
                fontWeight: "300",
                fontSize: "1.25em",
                paddingBottom: "1em",
            },
        });

        let content = this.getHTMLCode();

        let display = this.props.edit ?
            <Input
                className={css(styles.textContent)}

                placeholder="Enter a message..."
                type="textarea"
                value={this.state.messageContent}
                onKeyPress={this.props.handleEnter}
                onChange={this.handleChange}
            /> :
            <div style={{ width: "100%" }}>
                <Col xs={9} className={css(styles.chatText)} dangerouslySetInnerHTML={{ __html: content }}></Col>
                <Col xs={3}>
                    <Buttons
                        display={this.props.display}
                        handleEdit={this.props.handleEdit}
                        toggle={this.props.toggle}
                        updateMsg={this.props.updateMsg}
                        noteId={this.props.noteId}
                        toggleModal={this.props.toggleModal}
                        htmlCode={content}
                        displayButtons={this.props.displayButtons}
                    />
                </Col>
            </div>;
        return (
            display
        );
    }
}