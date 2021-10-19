import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Grid,
  Image,
} from "semantic-ui-react";
import "./Register.css";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import DatePicker from "react-datepicker";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import "react-datepicker/dist/react-datepicker.css";
import validator from "validator";

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
  const [birthDay, setbirthDay] = useState(new Date());
  const [emailError, setEmailError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkValid, setCheckValid] = useState("");

  useEffect(() => {
    console.log(process.env);
    setCaptchaKey(process.env.CAPTCHA_PUBLIC_KEY);
  }, []);

  const registerUser = (event) => {
    event.preventDefault();
    if (
      email &&
      password &&
      confirmPassword &&
      passwordError.length === 0 &&
      confirmError.length === 0 &&
      emailError.length === 0
    ) {
      axios
        .post(`${API_HOST}/api/user/register`, {
          Email: email,
          Password: password,
          cf_password: confirmPassword,
          Birthday: birthDay,
          Firstname: firstName,
          Lastname: lastName,
        })
        .then(function (res) {
          if (res.status === 201) {
            alert("Đăng ký thành công");
          }
        })
        .catch(function (error) {
          setEmailError("Email đã tồn tại");
        });
    } else {
      setCheckValid("Vui lòng kiểm tra lại các trường thông tin đã điền.");
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
            <Card className="registerCard">
              <Card.Header className="register_card_header">
                TẠO TÀI KHOẢN MỚI
              </Card.Header>
              <Form className="login__form">
                <Form.Field required>
                  <label>E-mail</label>
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
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (event.target.value.length < 8) {
                        setPasswordError("Mật khẩu phải dài hơn 8 kí tự");
                      } else {
                        setPasswordError("");
                      }
                    }}
                  />
                  {passwordError.length > 0 && (
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      <i className="exclamation circle icon"></i>
                      {passwordError}
                    </span>
                  )}
                </Form.Field>
                <Form.Field required>
                  <label>Xác nhận lại mật khẩu</label>
                  <input
                    placeholder="Xác nhận lại mật khẩu"
                    type="password"
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      if (event.target.value != password) {
                        setConfirmError("Mật khẩu xác nhận không trùng khớp");
                      } else {
                        setConfirmError("");
                      }
                    }}
                  />
                  {confirmError.length > 0 && (
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      <i className="exclamation circle icon"></i>
                      {confirmError}
                    </span>
                  )}
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
                    selected={birthDay}
                    onChange={(date) => setbirthDay(date)}
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
                  {checkValid.length > 0 && (
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      <i className="exclamation circle icon"></i>
                      {checkValid}
                    </span>
                  )}
                </Form.Field>
                <Form.Field>
                  <Button color="blue" type="submit" onClick={registerUser}>
                    Đăng Ký Tài Khoản
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
