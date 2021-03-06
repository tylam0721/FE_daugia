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

import {
  notification,
} from "antd";
import { NotificationTwoTone } from "@ant-design/icons";
import "./Register.css";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import DatePicker from "react-datepicker";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import "react-datepicker/dist/react-datepicker.css";
import validator from "validator";
import moment from "moment";
import config from "../../config/default.json";

function Register() {
  //router
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  var [captcha, setCaptcha] = useState(false);
  const [captchaKey, setCaptchaKey] = useState("");
  const [birthDay, setbirthDay] = useState(new Date());
  const [emailError, setEmailError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkValid, setCheckValid] = useState("");
  const [nameError, setNameError] = useState("");
  useEffect(() => {
    console.log(process.env);
    setCaptchaKey(process.env.CAPTCHA_PUBLIC_KEY);
  }, []);

  const openNotificationSuccess = (type) => {
    notification[type]({
      message: "Đăng kí tàu khoản thành công",
      description: "Bạn hãy check gmail để kích hoạt mã otp",
    });
  };

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
      setCheckValid("");
      axios
        .post(`${API_HOST}/api/register/create`, {
          Email: email,
          Password: password,
          cf_password: confirmPassword,
          Birthday: moment(birthDay).format("YYYY-MM-DD"),
          Firstname: firstName,
          Lastname: lastName,
        })
        .then(function (res) {
          if (res.status === 201) {
            openNotificationSuccess('success');
            history.push("/");
          }
        })
        .catch(function (error) {
          setEmailError("Email đã tồn tại");
        });
    } else {
      setCheckValid("Vui lòng kiểm tra lại các trường thông tin đã điền.");
    }
  };

  const onCheckCaptcha = () => {
    setCaptcha(true)
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
                    <Form.Field required>
                      <label>Tên</label>
                      <Input
                        placeholder="Tên"
                        type="text"
                        onKeyPress={(event) => {
                          if (
                            (event.charCode >= 65 && event.charCode <= 90) ||
                            (event.charCode >= 97 && event.charCode <= 122) ===
                            false
                          ) {
                            setNameError(
                              "Tên không được chứa chữ số, kí tự đặc biệt hoặc khoảng trắng"
                            );
                          } else {
                            setNameError("");
                          }
                        }}
                        onChange={(event) => {
                          setLastName(event.target.value);
                        }}
                      />
                      {nameError.length > 0 && (
                        <Label basic color="red" pointing>
                          {nameError}
                        </Label>
                      )}
                    </Form.Field>
                  </Form.Group>
                </Form.Field>
                <Form.Field>
                  <label>Ngày sinh</label>
                  <DatePicker
                    selected={birthDay}
                    onChange={(date) => { setbirthDay(date) }}
                  />
                </Form.Field>
               
                <Form.Field>
                  {checkValid.length > 0 && (
                    <Message negative>
                      <Message.Header>
                        Vui lòng kiểm tra lại các trường thông tin
                      </Message.Header>
                      <p>Các trường có chứa dấu * là các trường bắt buộc</p>
                    </Message>
                  )}
                </Form.Field>
                <ReCAPTCHA
                    sitekey={config.Captcha_Site_Key}
                    onChange={onCheckCaptcha}
                  />
                <Form.Field>
                  <Button color="blue" type="submit" onClick={registerUser} disabled={!captcha}>
                    Đăng Ký Tài Khoản
                  </Button>
                </Form.Field>
                <Form.Field>
                    <a href="/register/auth/facebook"> <Icon name="facebook" /> </a>
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
