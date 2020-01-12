import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { IoIosArrowBack } from "react-icons/io";
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
    this.showDefault = this.showDefault.bind(this);
  }

  navigateAfterAuthenticated() {
    this.props.history.push("/notes");
  }

  signInGoogle() {
    let self = this;
    firebase.default
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
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
      });
  }

  signInEmail(email, password) {
    let self = this;
    firebase.default
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
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
    });
  }

  handleLogin(e) {
    e.preventDefault();
    let email = this.refs.loginEmailField.value;
    let password = this.refs.loginPasswordField.value;
    this.signInEmail(email, password);
  }

  handleRegister(e) {
    e.preventDefault();
    let self = this;
    let email = this.refs.registerEmailField.value;
    let password = this.refs.registerPasswordField.value;
    let confirm = this.refs.registerPasswordConfirmField.value;
    // TODO: error handling
    if (password !== confirm) return;
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
    googleProvider = new firebase.default.auth.GoogleAuthProvider();
  }

  render() {
    return (
      <div>
        <Container>
        <Row className="justify-content-md-center" >
        <Card className="m-5">
          {this.state.displayMode === LoginStateEnum.default ? (
            <Card.Body>
              <h3 className="text-center ml-5 mr-5 mt-5">Sign In</h3>
              <h4 className="text-center m-4" style={{color: "grey"}}><small>Access your notes anywhere</small></h4>
              <Container>
                <Row className="m-2">
                  <Button variant="outline-primary" size="lg" block onClick={this.signInGoogle}>
                    <Image className="m-1" style={{height: 25}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"/>
                      Google
                  </Button>
                </Row>
                <Row className="m-2">
                  <Button variant="outline-primary" size="lg" block onClick={this.showEmailLogin}>Email</Button>
                </Row>
                <Row className="m-2">
                  <Button variant="outline-primary" size="lg" block onClick={this.showRegister}>Register</Button>
                </Row>
              </Container>
            </Card.Body>
          ) : this.state.displayMode === LoginStateEnum.login ? (
            <Card.Body>
              <Button className="mb-3" variant="outline-primary" onClick={this.showDefault}><IoIosArrowBack/></Button>
              <Form onSubmit={this.handleLogin}>
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
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
            </Card.Body>
          ) : (
            <Card.Body>
              <Button className="mb-3" variant="outline-primary" onClick={this.showDefault}><IoIosArrowBack/></Button>
              <Form onSubmit={this.handleRegister}>
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
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    ref="registerPasswordConfirmField"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
        </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(LoginPage);
