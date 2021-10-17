import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Grid } from "semantic-ui-react";
import "./Register.css";
import { auth } from "../../Firebase/FirebaseConfig";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Register() {
  //router
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");

  useEffect(() => {
    console.log(process.env)
    setCaptchaKey(process.env.CAPTCHA_PUBLIC_KEY);
  }, [])

  const loginUser = (event) => {
    event.preventDefault();
    if (email && password) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((authUser) => {
          history.push("/");
        })
        .catch((error) => {
          alert(
            "Opps! something went wrong please check your console for more info"
          );
          console.error(error.message);
        });
    } else {
      alert("Please Enter all the fields");
    }
  };

  const onCheckCaptcha = (value) => {
    setCaptcha(value);
  }

  return (
    <div className="login">
      <Container>
        <Grid centered columns={2} doubling stackable>
          <Grid.Column>
            <h2>Tạo tài khoản mới</h2>

            <Card className="test">
              <Form className="login__form">
                <Form.Field required>
                  <label>E-mail</label>
                  <input
                    placeholder="First Name"
                    type="email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Password</label>
                  <input
                    placeholder="password"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Nhập lại password</label>
                  <input
                    placeholder="nhập lại password"
                    type="password"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </Form.Field>
                {/* <ReCAPTCHA
                  sitekey={process.env.CAPTCHA_PUBLIC_KEY}
                  onChange={onCheckCaptcha}
                /> */}
                <Button color="green" type="submit" onClick={loginUser}>
                  Login
                </Button>
              </Form>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default Register;
