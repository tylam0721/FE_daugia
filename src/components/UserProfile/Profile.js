import React, { useState, useEffect } from "react";
import {
  Grid,
  Menu,
  Segment,
  Item,
  Divider,
  Icon,
  Input,
  Form,
  Label,
  Header,
  Image,
} from "semantic-ui-react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";

function Profile() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [profile, setProfile] = useState('');
  const [birthDay, setbirthDay] = useState(new Date());

  useEffect(() => {
    if (user && user.userId) {
      axios
        .get(`${API_HOST}/api/user/info/${user.userId}`)
        .then((res)=>{
          // handle success
          setProfile(res.data);
          console.log(profile);
          // <Redirect to='/'/>
          // setUserInfo(res?.data?.accessToken);
        })
        .catch((error)=>{
          // handle error
          history.push('/')
        });
    }
  }, []);

  return (
    <div>
      <Grid columns={2}>
        <Grid.Row divided={true}>
          <Grid.Column width={4}>
            <Image
              src="https://react.semantic-ui.com/images/wireframe/image.png"
              fluid
            />
          </Grid.Column>
          <Grid.Column stretched>
            <Header as="h2">
              <Icon name="settings" />
              <Header.Content>
                Thông tin người dùng
                <Header.Subheader>Thiết lập thông tin cá nhân</Header.Subheader>
              </Header.Content>
            </Header>
            <Form className="attached fluid segment">
              <Form.Field inline >
                <label>E-mail:</label> abcyxz@gmail.com
              </Form.Field>
              <Form.Field inline>
                <label>Mật khẩu: </label> ******** <a href="#">Thay đổi</a>
              </Form.Field>
              <Form.Field>
              <Form.Field inline >
              <label> Vai trò: </label>
              <Label color={'blue'}> Bidder</Label>
              </Form.Field>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Họ và tên đệm </label> Đinh Văn
                  </Form.Field>
                  <Form.Field>
                    <label>Tên</label> Búa
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
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
export default Profile;
