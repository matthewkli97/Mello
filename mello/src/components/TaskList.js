import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card, ListGroupItem, ListGroup, ListGroupItemHeading, Row, Col } from 'reactstrap';


export default class TaskList extends Component {

    render() {

        let tasks = {
            asdf: {
                taskName: "finisasdfasdfsad asdf  asdfas fds afsddfsdfssdfasd fasdsd  sddf sdf a sd sd",
                member: 12389123,
                progress: 0,
                memberAsignedTo: 8912312389,
                dueDate: 1512035796473,
                requirements: {
                    1: "hello",
                    2: "asdf"
                },
                taskTrue: true,
                priority: 1
            },
            a12e: {
                taskName: "finishApp",
                member: 12389123,
                progress: 1,
                memberAsignedTo: 8912312389,
                dueDate: 1512035796473,
                requirements: {
                    1: "hello",
                    2: "asdf"
                },
                taskTrue: true,
                priority: 2
            },
            a34e4: {
                taskName: "finishApp",
                member: 12389123,
                progress: 2,
                memberAsignedTo: 8912312389,
                dueDate: 1512035796473,
                requirements: {
                    1: "hello",
                    2: "asdf"
                },
                taskTrue: true,
                priority: 3
            }
        }

        let taskItems = Object.keys(tasks).map((task, index) => {
            let tempTask = tasks[task];
            tempTask.id = task;

            return <TaskItem key={index} task={tempTask} />
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

    render() {
        const progressColor = ["primary", "warning", "success"];
        const progressText = ["TODO", "In Progress", "Completed"];

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
                marginRight: 10
            },
            low: {
                color: "blue",
            },
            medium: {
                color: "yellow",
            },
            high: {
                color: "red"
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
                        <Button color={progressColor[this.props.task.progress]} onClick={() => this.toggleTask()}
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
                            {priorityValue()}
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

