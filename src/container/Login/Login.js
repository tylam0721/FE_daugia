import React, { useState, Component } from "react";
import { Container, Card, Form, Button, Grid } from "semantic-ui-react";
import "./Login.css";
import { useHistory, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "../../Common/Alert";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import jwt from "jwt-decode";
import { useStateValue } from "../../StateProvider/StateProvider";
import validator from "validator";

function Login() {
  const [, dispatch] = useStateValue();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState("");
  const loginUser = (event) => {
    // test modal:


    event.preventDefault();
    localStorage.clear();
    if (email && password) {
      axios
        .post(`${API_HOST}/api/auth`, {
          Email: email,
          Password: password,
        })
        .then(function (res) {
          // handle success
          console.log(res);
          localStorage.setItem("accessToken", res?.data?.accessToken);
          localStorage.setItem("refreshToken", res?.data?.refreshToken);
          history.push("/");
          setUserInfo(res?.data?.accessToken);
          // <Redirect to='/'/>
          // setUserInfo(res?.data?.accessToken);
        })
        .catch(function (error) {
          // handle error
          setAlertStatus(true);
          setAlertType('error');
          setAlertTitle('Đăng nhập thất bại');
          console.log(error);
        })
    } else {
      setAlertStatus(true);
      setAlertType('error');
      setAlertTitle('Đăng nhập thất bại');
    }
  };

  const setUserInfo = (accessToken) => {
    if(accessToken != null)
    {
      // use login in
      const user = jwt(accessToken); // decode your token here
      console.log(user);

      // set USER global state:
      dispatch({ type: "SET_USER", user: user });
    }
    else{
      // remove USER global state:
      dispatch({ type: "SET_USER", user: null });
    }
  }

  return (
    <div className="login">
      <Alert
        status={alertStatus}   // true or false
        type={alertType}   // success, warning, error, info
        title={alertTitle}   // title you want to display
        setIsAlert={setAlertStatus}
      />

      <Container>
        <Grid centered columns={3} doubling stackable>
          <Grid.Column>
            <Card className="card">
              <Card.Header className="card_header">ĐĂNG NHẬP</Card.Header>
              <Form className="login__form">
                <Form.Field required>
                  <label>Email</label>
                  <input
                    placeholder="Email"
                    type="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (validator.isEmail(event.target.value)) {
                        setEmailError("");
                      } else {
                        setEmailError("Email không hợp lệ");
                      }
                    }}
                  />
                  {emailError.length > 0 && (
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      <i className="exclamation circle icon"></i>
                      {emailError}
                    </span>
                  )}
                </Form.Field>
                <Form.Field required>
                  <label>Mật khẩu</label>
                  <input
                    placeholder="Mật khẩu"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Field>
                <div className="center">
                  <Button
                    className="button-3"
                    color="green"
                    type="submit"
                    onClick={loginUser}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </Form>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default Login;
