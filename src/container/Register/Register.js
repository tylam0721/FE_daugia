import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Grid,
  GridRow,
  Image,
} from "semantic-ui-react";
import "./Register.css";
import { auth } from "../../Firebase/FirebaseConfig";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function Register() {
  //router
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    console.log(process.env);
    setCaptchaKey(process.env.CAPTCHA_PUBLIC_KEY);
  }, []);

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
  };

  return (
    <div className="login">
      <Container>
        <Grid centered columns={2} doubling stackable>
          <Grid.Column>
            <h2>Tạo tài khoản mới</h2>

            <Card className="registerCard">
              <Form className="login__form">
                <Form.Field required>
                  <label>E-mail</label>
                  <input
                    placeholder="Email"
                    type="email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Mật khẩu</label>
                  <input
                    placeholder="Mật khẩu"
                    type="Password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Xác nhận lại mật khẩu</label>
                  <input
                    placeholder="Xác nhận lại mật khẩu"
                    type="password"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <Form.Field>
                          <label>Họ và tên đệm </label>
                          <input
                            placeholder="Họ và tên đệm"
                            type="text"
                            onChange={(event) =>
                              setFirstName(event.target.value)
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <Form.Field>
                          <label>Tên</label>
                          <input
                            placeholder="Tên"
                            type="text"
                            onChange={(event) =>
                              setLastName(event.target.value)
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
                <Form.Field>
                  <label>Ngày sinh</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </Form.Field>
                {/* <ReCAPTCHA
                  sitekey={process.env.CAPTCHA_PUBLIC_KEY}
                  onChange={onCheckCaptcha}
                /> */}
                <Form.Field>
                  <div>
                    Đã có tài khoản ?{" "}
                    <i className="hand point right outline icon"></i>
                    <a href="/login">Đăng Nhập</a>
                  </div>
                </Form.Field>

                <Form.Field>
                  <Button color="green" type="submit" onClick={loginUser}>
                    Đăng Ký
                  </Button>
                </Form.Field>
              </Form>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default Register;
