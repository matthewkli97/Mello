import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card, ListGroupItem, ListGroup, ListGroupItemHeading, Row, Col } from 'reactstrap';

import firebase from 'firebase/app'

export default class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: {}
        }
    }

    componentDidMount() {
        let ref = firebase.database().ref("tasks").child(this.props.currentUser.uid);

        ref.on("value", (snapshot) => {
            this.setState({ tasks: snapshot.val() });
        });
    }

    render() {

        let items = Object.keys(this.state.tasks);

        const order = {
            '0' : 1,
            '1' : 0,
            '2' : 2
        }

        items.sort((a, b) => {
            console.log(order[this.state.tasks[a].progress])
            if(order[this.state.tasks[a].progress] < order[this.state.tasks[b].progress]) {
                return -1;
            } else if(order[this.state.tasks[a].progress] > order[this.state.tasks[b].progress]) {
                return 1;
            } else if(this.state.tasks[a].priority - this.state.tasks[b].priority !== 0) {
                return this.state.tasks[b].priority - this.state.tasks[a].priority ;
            } else {
                return this.state.tasks[a].date - this.state.tasks[b].date;
            }
        })


        let taskItems = items.map((task, index) => {
            let tempTask = this.state.tasks[task];
            tempTask.id = task;

            return <TaskItem currentUser={this.props.currentUser} key={index} task={tempTask} />
        });

        return (
            <ListGroup>
                {taskItems}
            </ListGroup>
        );
    }
}

class TaskItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            taskStatus: 1
        };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    toggleTask() {
        this.setState({ taskStatus: this.state.taskStatus + 1 });
    }

    changeProgress() {
        let taskRef = firebase.database().ref("tasks").child(this.props.currentUser.uid);

        let tempTask = this.props.task;
        tempTask.progress = (tempTask.progress + 1) % 3;

        taskRef.child(this.props.task.id).set(tempTask);
    }

    render() {
        const progressColor = ["primary", "warning", "success"];
        const progressText = ["TODO", "In Progress", "Completed"];
        const iconPriority = ["fa-arrow-down", "fa-minus", "fa-arrow-up"];

        const styles = {
            button: {
                width: "100%"
            },
            inline: {
                display: "inline"
            },
            box: {
                marginTop: 10
            },
            icon: {
                marginLeft: 10,
                marginRight: 10,
                colors: {
                    '0' : { color: "blue" },
                    '1' : { color: "yellow" },
                    '2' : { color: "red" }
                }
                
            },
            wrap: {
                wordWrap: "break-word"
            }
        }

        let listItems = Object.keys(this.props.task.requirements).map((key, index) => {
            return <li key={index}>{this.props.task.requirements[key]}</li>
        })

        let priorityValue = () => {
            if (this.props.task.priority === 1)
                return <i className="fa fa-arrow-down" style={{ ...styles.icon, ...styles.low }} aria-hidden="true"></i>
            else if (this.props.task.priority === 2)
                return <i className="fa fa-minus" style={{ ...styles.icon, ...styles.medium }} aria-hidden="true"></i>
            else
                return <i className="fa fa-arrow-up" style={{ ...styles.icon, ...styles.high }} aria-hidden="true"></i>
        }

        return (
            <ListGroupItem tag="a" action>
                <Row>
                    <Col>
                        <Button color={progressColor[this.props.task.progress]} onClick={() => this.changeProgress()}
                            size="sm"><span style={styles.scale}>{progressText[this.props.task.progress]}</span></Button>
                    </Col>
                    <Col style={{ textAlign: "right" }}>asdfas</Col>
                </Row>
                <Row style={{ marginTop: 10 }} onClick={() => this.toggle()}>
                    <Col xs={10} md={11}>
                        <ListGroupItemHeading style={{ ...styles.inline, ...styles.wrap }}>{this.props.task.taskName}</ListGroupItemHeading>
                    </Col>
                    <Col xs={2} md={1}>
                        <span style={{ float: "right" }}>
                            <i className={"fa " + iconPriority[this.props.task.priority]} style={{ ...styles.icon, ...styles.icon.colors[this.props.task.priority] }} aria-hidden="true"></i>
                        </span>
                    </Col>
                </Row>
                <div>
                    <Collapse
                        isOpen={this.state.collapse}
                        style={styles.box}
                    >
                        <Card>
                            <CardBody>
                                Subtasks
                                <ol>
                                    {listItems}
                                </ol>
                            </CardBody>
                        </Card>
                    </Collapse>
                </div>
            </ListGroupItem>
        );
    }
}

