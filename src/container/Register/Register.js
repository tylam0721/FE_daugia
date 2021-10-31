import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Grid,
  Image,
  Input,
  Message,
  Icon,
  Label,
} from "semantic-ui-react";
import "./Register.css";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import DatePicker from "react-datepicker";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import "react-datepicker/dist/react-datepicker.css";
import validator from "validator";
import * as moment from "moment";
import "moment/locale/nl";

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
      setCheckValid('');
      axios
        .post(`${API_HOST}/api/register/create`, {
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
            history.push('/');
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
              <Form className="attached fluid segment login__form">
                <Form.Field required>
                  <label>E-mail</label>
                  <Input
                    icon="at"
                    iconPosition="left"
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
                    <Label basic color="red" pointing>
                      {emailError}
                    </Label>
                  )}
                </Form.Field>
                <Form.Field required>
                  <label>Mật khẩu</label>
                  <Input
                    icon="lock"
                    iconPosition="left"
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
                    <Label basic color="red" pointing>
                      {passwordError}
                    </Label>
                  )}
                </Form.Field>
                <Form.Field required>
                  <label>Xác nhận lại mật khẩu</label>
                  <Input
                    icon="lock"
                    iconPosition="left"
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
                    <Label basic color="red" pointing>
                      {confirmError}
                    </Label>
                  )}
                </Form.Field>
                <Form.Field>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Họ và tên đệm </label>
                      <Input
                        icon="user"
                        iconPosition="left"
                        placeholder="Họ và tên đệm"
                        type="text"
                        onChange={(event) => setFirstName(event.target.value)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Tên</label>
                      <Input
                        placeholder="Tên"
                        type="text"
                        onChange={(event) => setLastName(event.target.value)}
                      />
                    </Form.Field>
                  </Form.Group>
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
                  {checkValid.length > 0 && (
                <Message negative>
                <Message.Header>Vui lòng kiểm tra lại các trường thông tin</Message.Header>
                <p>Các trường có chứa dấu * là các trường bắt buộc</p>
              </Message>
                  )}
                </Form.Field>
                <Form.Field>
                  <Button color="blue" type="submit" onClick={registerUser}>
                    Đăng Ký Tài Khoản
                  </Button>
                </Form.Field>
              </Form>
              <Message attached="bottom" info>
                <Icon name="help" />
                Đã có tài khoản?&nbsp;<a href="/login">Đăng nhập tại đây</a>
              </Message>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default Register;
