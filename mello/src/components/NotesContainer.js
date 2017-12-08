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
            selectedMessageId: undefined
        };
    }

    handleKeyPress = (event) => {
        if (event.charCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            this.props.dbRef.push({
                user: "Jenny Liang",
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

    // toggle = () => {
    toggle = (noteId) => {
        // this.setState({ isModalOpen: !this.state.isModalOpen });
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            selectedMessageId: noteId
        });
    }

    handleOnChange = (event) => {
        this.setState({ message: event.target.value });
    }

    delete = () => {
        // this.setState({ isModalOpen: !this.state.isModalOpen });
        this.ref.child(this.state.selectedMessageId).remove()
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
                height: "70vh",
                overflow: "scroll"
            },
            navbar: {
                margin: 0,
                borderRadius: 0
            }
        });

        let noteItems = null;

        if (this.props.messages !== undefined) {
            noteItems = Object.keys(this.props.messages).map((note) => {
                let tempNote = this.props.messages[note];
                return <NoteItem dbRef={this.props.dbRef} key={note} noteId={note} note={tempNote} toggle={this.toggle} updateMsg={this.updateSelectedMessage} />;
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
        if (event.charCode == 13) {
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
            }
        });

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
                                />
                            </Row>
                            {/* <small> Jenny Liang, 9:00 AM </small> */}
                            <small>
                                {this.props.note.user} {this.props.note.time} {this.props.note.edited && "(Edited)"}
                            </small>
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
            <ButtonGroup size="sm" className={css(!this.props.display && styles.hide)}>
                <Button
                    onClick={this.props.handleEdit}
                    className={css(styles.hover)}
                >
                    Edit
                </Button>
                <Button
                    // onClick={this.props.toggle(this.props.noteId)}
                    // onClick={this.props.toggle}
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
            messageContent: this.props.note.message
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
                <Col sm={9}>
                    {this.props.note.message}
                </Col>
                <Col sm={3}>
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