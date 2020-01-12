import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { withRouter } from "react-router-dom";

import * as firebase from "firebase/app";
import "firebase/auth";

const LoginStateEnum = Object.freeze({ default: 1, login: 2, register: 3 });
let googleProvider = null;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayMode: LoginStateEnum.default };
    this.signInGoogle = this.signInGoogle.bind(this);
    this.showEmailLogin = this.showEmailLogin.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.navigateAfterAuthenticated = this.navigateAfterAuthenticated.bind(
      this
    );
    this.signInEmail = this.signInEmail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.userIsAuthenticated = this.userIsAuthenticated.bind(this);
  }

  navigateAfterAuthenticated() {
    this.props.history.push("/notes");
  }

  signInGoogle() {
    let self = this;
    firebase.default
      .auth()
      .signInWithPopup(googleProvider)
      .then(function(result) {
        self.navigateAfterAuthenticated();
      })
      .catch(function(error) {
        // TODO: error handling
        console.log(error);
      });
  }

  signInEmail(email, password) {
    let self = this;
    firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function(result) {
        console.log(result);
        self.navigateAfterAuthenticated();
      })
      .catch(function(error) {
        // TODO: error handling
        console.log(error);
      });
  }

  handleLogin() {
    let email = this.refs.loginEmailField.value;
    let password = this.refs.loginPasswordField.value;
    this.signInEmail(email, password);
  }

  handleRegister() {
    let self = this;
    let email = this.refs.registerEmailField.value;
    let password = this.refs.registerPasswordField.value;
    firebase.default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        self.signInEmail(email, password);
      })
      .catch(function(error) {
        // TODO: error handling
        console.log(error);
      });
  }

  userIsAuthenticated() {
    let user = firebase.default.auth().currentUser;
    return user !== null;
  }

  showDefault() {
    this.setState({
      displayMode: LoginStateEnum.default
    });
  }

  showEmailLogin() {
    this.setState({
      displayMode: LoginStateEnum.login
    });
  }

  showRegister() {
    this.setState({
      displayMode: LoginStateEnum.register
    });
  }

  componentDidMount() {
    if (this.userIsAuthenticated()) {
      this.navigateAfterAuthenticated();
    }
    googleProvider = new firebase.default.auth.GoogleAuthProvider();
    firebase.default
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  render() {
    return (
      <div>
        <Card className="m-5">
          {this.state.displayMode === LoginStateEnum.default ? (
            <Card.Body>
              <h1>Sign In</h1>
              <Container>
                <Row className="m-2 justify-content-md-center">
                  <Button onClick={this.signInGoogle}>Google</Button>
                </Row>
                <Row className="m-2 justify-content-md-center">
                  <Button onClick={this.showEmailLogin}>Email</Button>
                </Row>
                <Row className="m-2 justify-content-md-center">
                  <Button onClick={this.showRegister}>Register</Button>
                </Row>
              </Container>
            </Card.Body>
          ) : this.state.displayMode === LoginStateEnum.login ? (
            <Card.Body>
              <h1>Email Sign In</h1>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    ref="loginEmailField"
                    type="email"
                    placeholder="Enter email"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    ref="loginPasswordField"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button variant="primary" onClick={this.handleLogin}>
                  Login
                </Button>
              </Form>
            </Card.Body>
          ) : (
            <Card.Body>
              <h1>Register</h1>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    ref="registerEmailField"
                    type="email"
                    placeholder="Enter email"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    ref="registerPasswordField"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button variant="primary" onClick={this.handleRegister}>
                  Register
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
      </div>
    );
  }
}

export default withRouter(LoginPage);
