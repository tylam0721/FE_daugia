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
import {  Modal, Input, Space, notification} from "antd"
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setOldpassword('');
    setreNewpassword('');
    setNewpassword('');
  };

  const handleOk = () => {
    if(renewpassword !== newpassword){
      openNotificationWrongReNew('error');
    }else{
      handleChangePassword();
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if(user && user.userId)
    {
      axios
      .get(`${API_HOST}/api/user/info/${user.userId}`)
      .then(async (res)=>{
        // handle success
        console.log(res.data);

        await setProfile(res.data);
        // <Redirect to='/'/>
        // setUserInfo(res?.data?.accessToken);
        setLoading(false);
      })
      .catch((error)=>{
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
      message: "Đổi mật khẩu thất bại",
      description: "Bạn đã nhập sai xin vui lòng nhập lại",
    });
  };

  const openNotificationWrongReNew = (type) => {
    notification[type]({
      message: "Đổi mật khẩu thất bại",
      description: "Bạn đã nhập không trùng mật khẩu mới và nhập lại mật khẩu mới",
    });
  };

  const openNotificationSuccess = (type) => {
    notification[type]({
      message: "Thao tác thành công",
      description: "Bạn đã đổi mật khẩu thành công",
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


  return (
    <div>
      {loading?  
      (<Dimmer active inverted>
      <Loader size="large" className="home__loaderMessage">
        Đang tải...
      </Loader>
    </Dimmer>):(  <Grid columns={2}>
      <Grid.Row divided={true}>
        <Grid.Column fluid>
          <Header as="h2">
            <Icon name="settings" />
            <Header.Content>
              Thông tin người dùng
              <Header.Subheader>Thiết lập thông tin cá nhân</Header.Subheader>
            </Header.Content>
          </Header>
          <Form fluid className="attached segment userform" style={{ boder: 'none'}}>
            <Form.Field inline >
              <label>E-mail:</label> {profile.Email}
            </Form.Field>
            <Form.Field inline>
            <Grid columns='two' divided style={{marginLeft: '-35px'}}>
            <Grid.Row>
            <Grid.Column>
            <label><b>Mật khẩu:</b> </label> ********
            </Grid.Column>
            <Grid.Column>
            <Button color='blue' onClick={showModal}>Thay đổi mật khẩu</Button>
            </Grid.Column>
            </Grid.Row>
            </Grid>
            </Form.Field>
            <Form.Field>
            <Form.Field inline >
            <label> Vai trò: </label>
            {profile.Scope === 'Seller' &&(
                <Label color={'blue'}> <Icon name='gem outline'/> {profile.Scope}</Label>
            )}
            {profile.Scope === 'Admin' &&(
                <Label color={'red'}> <Icon name='gem outline'/> {profile.Scope}</Label>
            )}
            {profile.Scope === 'Bidder' &&(
                <Label color={'Green'}> <Icon name='user outline'/> {profile.Scope}</Label>
            )}
            </Form.Field>
              <Form.Group widths="equal">
                <Form.Field>
                  <label>Họ và tên đệm </label> {profile.Firstname}
                </Form.Field>
                <Form.Field>
                  <label>Tên</label> {profile.Lastname}
                </Form.Field>
              </Form.Group>
            </Form.Field>
            <Form.Field inline>
              <label>Ngày sinh: </label> {moment(profile.Birthday).format("DD-MM-YYYY")}
            </Form.Field>
            <Button color='teal'>Gửi yêu cầu nâng cấp lên Seller</Button>
            <Modal title="Đổi mật khẩu" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Space direction="vertical">
            <p><b>Nhập mật khẩu cũ</b></p>
            <Input.Password
            value={oldpassword}
            onChange={(e) => setOldpassword(e.target.value)} 
            placeholder="input password" />
            <p><b>Nhập mật khẩu mới</b></p>
            <Input.Password
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              placeholder="input password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <p><b>Nhập lại mật khẩu mới</b></p>
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
    </Grid>) }
    </div>
  );
}
export default Profile;
