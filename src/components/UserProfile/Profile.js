import React, { useState, useEffect } from "react";

import 'antd/dist/antd.css';
import {
  Grid,
  Button,
  Icon,
  Form,
  Label,
  Header,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { Modal, Input, Space, notification } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import "./Profile.css"


function Profile() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [profile, setProfile] = useState('');
  const [birthDay, setbirthDay] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [oldpassword, setOldpassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [renewpassword, setreNewpassword] = useState('');
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setOldpassword('');
    setreNewpassword('');
    setNewpassword('');
  };

  const handleOk = () => {
    if (renewpassword !== newpassword) {
      openNotificationWrongReNew('error');
    } else {
      handleChangePassword();
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (user && user.userId) {
      axios
        .get(`${API_HOST}/api/user/info/${user.userId}`)
        .then(async (res) => {
          // handle success
          console.log(res.data);

          await setProfile(res.data);
          setbirthDay(new Date(res.data.Birthday));
          setEmail(res.data.Email);
          setFirstName(res.data.Firstname);
          setLastName(res.data.Lastname);
          setAdress(res.data.Adress);
          // <Redirect to='/'/>
          // setUserInfo(res?.data?.accessToken);
          setLoading(false);
        })
        .catch((error) => {
          // handle error
          history.push('/');
        });
    }
  }, [dispatch]);

  const AuthStr = "Bearer ".concat("");
  let config = {
    headers: {
      Authorization: AuthStr,
      "Content-Type": "application/json",
    },
  };

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "?????i m???t kh???u th???t b???i",
      description: "B???n ???? nh???p sai xin vui l??ng nh???p l???i",
    });
  };

  const openNotificationWrongReNew = (type) => {
    notification[type]({
      message: "?????i m???t kh???u th???t b???i",
      description: "B???n ???? nh???p kh??ng tr??ng m???t kh???u m???i v?? nh???p l???i m???t kh???u m???i",
    });
  };

  const openNotificationSuccess = (type) => {
    notification[type]({
      message: "Thao t??c th??nh c??ng",
      description: "B???n ???? l??u th??nh c??ng",
    });
  };

  const openNotificationSendSuccess = (type) => {
    notification[type]({
      message: "G???i y??u c???u th??nh c??ng",
      description: "B???n ???? g???i y??u c???u th??nh c??ng, vui l??ng ?????i admin ph?? duy???t",
    });
  };

  const openNotificationSenderror = (type) => {
    notification[type]({
      message: "G???i y??u c???u th???t b???i",
      description: "B???n ???? g???i y??u c???u th???t b???i, vui l??ng ki???m tra l???i",
    });
  };

  const handleChangePassword = () => {
    axios
      .put(`${API_HOST_DEV}/api/user/update-password/` + profile.id, {
        NewPassword: newpassword,
        OldPassword: oldpassword
      }, config)
      .then((response) => {
        openNotificationSuccess("success");
      })
      .catch((error) => {
        console.log("error " + error);
        openNotificationWithIcon("error");
      });
  };

  const handleSendReques = () => {
    axios
      .post(`${API_HOST_DEV}/api/user/request/upto-seller/` + profile.id, {}, config)
      .then((response) => {
        openNotificationSendSuccess("success");
      })
      .catch((error) => {
        console.log("error " + error);
        openNotificationSenderror("error");
      });
  };

  const updateInfo = (event) => {
    event.preventDefault();
      axios
        .put(`${API_HOST}/api/user/info/update`, {
          Id: profile.id,
          Email: email,
          Address: adress,
          Birthday: moment(birthDay).format("YYYY-MM-DD"),
          Firstname:firstName,
          Lastname: lastName
        })
        .then(function (res) {
          if (res.status === 201) {
            openNotificationSuccess('success');
            history.push("/profile");
          }
        })
        .catch(function (error) {
          
        });
  };

  return (
    <div>
      {loading ?
        (<Dimmer active inverted>
          <Loader size="large" className="home__loaderMessage">
            ??ang t???i...
          </Loader>
        </Dimmer>) : (<Grid columns={2}>
          <Grid.Row divided={true}>
            <Grid.Column fluid>
              <Header as="h2">
                <Icon name="settings" />
                <Header.Content>
                  Th??ng tin ng?????i d??ng
                  <Header.Subheader>Thi???t l???p th??ng tin c?? nh??n</Header.Subheader>
                </Header.Content>
              </Header>
              <Form fluid className="attached segment userform" style={{ boder: 'none' }}>
                <Form.Field inline >
                  <label>E-mail:</label> {profile.Email}
                </Form.Field>
                <Form.Field inline>
                  <Grid columns='two' divided style={{ marginLeft: '-35px' }}>
                    <Grid.Row>
                      <Grid.Column>
                        <label><b>M???t kh???u:</b> </label> ********
                      </Grid.Column>
                      <Grid.Column>
                        <Button color='blue' onClick={showModal}>Thay ?????i m???t kh???u</Button>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
                <Form.Field>
                  <Form.Field inline >
                    <label> Vai tr??: </label>
                    {profile.Scope === 'Seller' && (
                      <Label color={'blue'}> <Icon name='gem outline' /> {profile.Scope}</Label>
                    )}
                    {profile.Scope === 'Admin' && (
                      <Label color={'red'}> <Icon name='gem outline' /> {profile.Scope}</Label>
                    )}
                    {profile.Scope === 'Bidder' && (
                      <Label color={'Green'}> <Icon name='user outline' /> {profile.Scope}</Label>
                    )}
                  </Form.Field>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>H??? v?? t??n ?????m </label>
                      <Input type="text" 
                      placeholder={profile.Firstname}
                      onChange={(event) => setFirstName(event.target.value)}
                       />
                    </Form.Field>
                    <Form.Field>
                      <label>T??n</label>
                      <Input type="text" 
                      placeholder={profile.Lastname}
                      onChange={(event) => setLastName(event.target.value)}
                       />
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>email </label>  
                      <Input 
                      placeholder={profile.Email} 
                      onChange={(event) => setEmail(event.target.value)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>?????a ch???</label>  
                      <Input type="text" 
                      placeholder={profile.Adress}
                      onChange={(event) => setAdress(event.target.value)}
                      />
                    </Form.Field>
                  </Form.Group>
                </Form.Field>
                <Form.Field inline>
                  <label>Ng??y sinh: </label>
                  <DatePicker
                    selected={birthDay}
                    onChange={(date) => { setbirthDay(date) }}
                  />
                </Form.Field>
                <Button color='blue' onClick={updateInfo}>L??u c???p nh???t h??? s??</Button>

                {profile.Scope === 'Bidder' && (
                  <Button color='teal' onClick={handleSendReques}>G???i y??u c???u n??ng c???p l??n Seller</Button>
                )}
                <Modal title="?????i m???t kh???u" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                  <Space direction="vertical">
                    <p><b>Nh???p m???t kh???u c??</b></p>
                    <Input.Password
                      value={oldpassword}
                      onChange={(e) => setOldpassword(e.target.value)}
                      placeholder="input password" />
                    <p><b>Nh???p m???t kh???u m???i</b></p>
                    <Input.Password
                      value={newpassword}
                      onChange={(e) => setNewpassword(e.target.value)}
                      placeholder="input password"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <p><b>Nh???p l???i m???t kh???u m???i</b></p>
                    <Input.Password
                      value={renewpassword}
                      onChange={(e) => setreNewpassword(e.target.value)}
                      placeholder="input password"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Space>
                </Modal>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>)}
    </div>
  );
}
export default Profile;
