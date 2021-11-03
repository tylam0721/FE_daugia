import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Segment,
  Item,
  Modal,
  Icon,
  Input,
  Form,
  Label,
  Header,
  Image,
  Dimmer,
  Loader
} from "semantic-ui-react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import moment from "moment";

import DatePicker from "react-datepicker";

function Profile() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [profile, setProfile] = useState('');
  const [birthDay, setbirthDay] = useState(new Date());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(user && user.userId)
    {
      axios
      .get(`${API_HOST}/api/user/info/${user.userId}`)
      .then(async (res)=>{
        // handle success
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
              <label>Mật khẩu: </label> ********
            </Form.Field>
            <Form.Field>
            <Form.Field inline >
            <label> Vai trò: </label>
            {profile.Scope === 'Seller' &&(
                <Label color={'blue'}> <Icon name='gem outline'/> {profile.Scope}</Label>
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
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>) }
    </div>
  );
}
export default Profile;
