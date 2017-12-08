import React, { Component } from 'react';
import { TextField, IconButton, Paper, Grid, CircularProgress, Typography, Hidden } from 'material-ui';
import firebase from 'firebase/app';
import CompleteIcon from 'material-ui-icons/Done';
import CancelIcon from 'material-ui-icons/Clear';
import DeleteIcon from 'material-ui-icons/DeleteForever';
import { Button } from 'reactstrap';
import Time from 'react-time';
import ReactMarkdown from 'react-markdown';

export default class NoteChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            loading: true,
            pictures: {},
            names: {},
            thread: null
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        console.log(this.props.meetingId)
        this.chatRef = firebase.database().ref("meetings/" + this.props.meetingId);

        this.chatRef.on('value', (snapshot) => {
            this.setState({ thread: snapshot.val(), loading: false });
        });
    }

    componentWillUnmount() {
        this.chatRef.off();
    }

    updateMessage(event) {
        this.setState({ message: event.target.value });
    }

    postMessage() {
        if (this.state.message.length > 0) {
            /* TODO: add a new Chirp to the database */
            let newMessage = {
                text: this.state.message,
                userId: this.props.currentUser.uid,
                userName: this.props.currentUser.displayName,
                userPhoto: this.props.currentUser.photoURL,
                time: firebase.database.ServerValue.TIMESTAMP
            }

            this.chatRef.child("chat").push(newMessage);
            this.chatRef.child("newest").update(newMessage);

            this.setState({ message: "" }); //empty out post for next time
        }
    }

    handleDelete(id) {
        this.chatRef.child("chat").child(id).remove()
            .catch((err) => console.log(err.message));
    }

    handleUpdate(id, message) {
        this.chatRef.child("chat").child(id).update({ text: message })
            .catch((err) => console.log(err.message));
    }

    handleSubmit(event) {
        if (event.keyCode === 13) {
            this.postMessage();
        }
    }

    render() {

        const classes = {
            textField: {
                width: "65%"
            },
            inputDiv: {
                left:"50%",
                width: "60%",
                position: "fixed",
                bottom: 50,
                paddingBottom: 30,
                backgroundColor: "white",
            },
            image: {
                width: "50%",
                maxWidth: "300px",
                marginBottom: 30
            },
            messageDiv: {
                paddingTop: 50,
                paddingBottom: 100,
                width: "100%",
                display: "block",
                textAlign: "center"
            }
        }

        if (this.state.loading) {
            return (
                <div style={classes.messageDiv}>
                    <CircularProgress className={classes.progress} size={50} />
                </div>
            )
        } else if (this.state.thread === null) {
            return (
                <div style={classes.messageDiv}>
                    <img style={classes.image} alt="warning sign" src="https://firebasestorage.googleapis.com/v0/b/chat-b9230.appspot.com/o/warning.png?alt=media&token=a3e4ef7d-550d-46b5-b941-f89e4a47a1c2" />
                    <h1>Uh oh, no thread found!</h1>
                    <h2>¯\_(ツ)_/¯</h2>
                </div>
            )
        }

        return (
            <div>
                <MessageList names={this.state.names} pictures={this.state.pictures}
                    chat={this.state.thread.chat} currentUser={this.props.currentUser}
                    handleDelete={(id) => this.handleDelete(id)}
                    handleUpdate={(id, text) => this.handleUpdate(id, text)} />
                <div style={classes.inputDiv}>
                    <TextField style={classes.textField} value={this.state.message}
                        onChange={(e) => this.updateMessage(e)} onKeyDown={(e) => this.handleSubmit(e)} /> {"  "}
                    <Button color={"primary"} disabled={this.state.message.length < 1} onClick={() => this.postMessage()}>Send</Button>
                </div>
            </div>
        )
    }
}

class MessageList extends Component {
    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        const classes = {
            image: {
                width: "50%",
                maxWidth: "300px",
                marginBottom: 30
            },
            messageDiv: {
                paddingBottom: 100,
                width: "100%",
                display: "block",
                textAlign: "center"
            }
        }

        if (this.props.chat === undefined) {
            return (
                <div style={classes.messageDiv}>
                    <img style={classes.image} alt="warning sign" src="https://firebasestorage.googleapis.com/v0/b/chat-b9230.appspot.com/o/chat.png?alt=media&token=4ca2ce9a-4e81-4f63-a6aa-5eefd3790706" />
                    <h1>Nothing's here yet!</h1>
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>);
        }

        let messageIds = Object.keys(this.props.chat);

        messageIds.sort((a, b) => {
            return this.props.chat[a].time - this.props.chat[b].time;
        });

        let messageItems = messageIds.map((id, index) => {
            let message = this.props.chat[id];
            message.id = id;
            message.userPhoto = this.props.pictures[message.userId];
            message.userName = this.props.names[message.userId];

            return <MessageItem
                handleDelete={() => this.props.handleDelete(id)}
                handleUpdate={(message) => this.props.handleUpdate(id, message)}
                key={id}
                message={message}
                editable={this.props.currentUser.uid === message.userId}
                currentUser={this.props.currentUser}
            />;
        });

        return (
            <div style={classes.messageDiv}>{messageItems}<div style={{ float: "left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </div></div>
        )
    }
}

class MessageItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            message: this.props.message.text
        }
    }

    updateMessageState(event) {
        this.setState({ message: event.target.value });
    }

    handleClose() {
        this.setState({ editing: false, message: this.props.message.text });
    }

    render() {

        let message = this.props.message;

        const classes = {
            card: {
                minWidth: "100%",
                width: "auto",
                margin: 15,
                float: "left",
            },
            userMessage: {
                float: "right"
            },
            padding: {
                padding: "3%"
            },
            text: {
                textAlign: "left"
            },
            textField: {
                width: "60%"
            },
            icon: {
                width: "10%",
                paddingRight: 10,
                paddingLeft: 10,
                float: "right"
            },
            image: {
                maxWidth: 65,
                width: "100%",
                height: "auto"
            },
            imageCircle: {
                width: "100%",
                paddingTop: "100%",
                backgroundSize: "cover",
                display: "block",
                borderRadius: "50%",
                marginRight: "auto",
                marginLeft: "auto"
            }
        }

        if (message.userId === this.props.currentUser.uid) {
            classes.card = { ...classes.card, ...classes.userMessage };
        }

        return (
            <div style={classes.card}>
                <Paper>
                    <Grid container style={classes.padding}>
                        <Hidden only="xs">
                            <Grid item sm={2} md={1}>
                                {message.userPhoto &&

                                    <div style={{ ...classes.imageCircle, ...{ backgroundImage: 'url(' + message.userPhoto + ')' } }}
                                        role="img" alt={"profile image for " + message.userName}></div>
                                }
                                {!message.userPhoto &&

                                    <div style={{ ...classes.imageCircle, ...{ backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/chat-b9230.appspot.com/o/user.png?alt=media&token=d9e9621e-58fa-4c18-bd2d-c6d31b677a9d")' } }}
                                        role="img" alt={"profile image for " + message.userName}></div>
                                }
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={10} md={11}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography style={{ textAlign: "left" }}>{message.userId !== this.props.currentUser.uid && message.userName}
                                        {message.userId === this.props.currentUser.uid && "Me"} </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography style={{ textAlign: "right" }}><Time value={message.time} relative /></Typography>
                                </Grid>
                            </Grid>
                            <div style={classes.text}>
                                {this.state.editing &&
                                    <div><TextField multiline value={this.state.message}
                                        onChange={(e) => this.updateMessageState(e)} style={classes.textField} />
                                        <IconButton aria-label="Done" style={classes.icon} onClick={() => this.handleClose()}>
                                            <CancelIcon />
                                        </IconButton>
                                        <IconButton aria-label="Done" style={classes.icon} onClick={() => this.props.handleDelete()}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="Done" style={classes.icon} onClick={() => {() => this.props.handleUpdate(this.state.message), this.setState({ editing: false }) }}>
                                            <CompleteIcon />
                                        </IconButton>
                                    </div>
                                }
                                {!this.state.editing &&

                                    <div onClick={() => { this.setState({ editing: this.props.editable }) }}>
                                        <ReactMarkdown source={this.props.message.text} />
                                    </div>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </div >
        )
    }
}