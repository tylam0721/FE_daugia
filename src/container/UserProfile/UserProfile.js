import React, { useState, useEffect } from "react";
import { Grid, Menu, Segment, Item, Divider , Icon} from "semantic-ui-react";
import "./UserProfile.css";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import Profile from "../../components/UserProfile/Profile";
import ProductList from "../../components/UserProfile/ProductList";


function UserProfile() {
const history = useHistory();
const [{ user }, dispatch] = useStateValue()
const [activeItem, setActiveItem] = useState("profile");


  if(user && user.userId)
  {
    axios
    .get(`${API_HOST}/api/user/info/${user.userId}`)
    .then(function (res) {
      // handle success
      // <Redirect to='/'/>
      // setUserInfo(res?.data?.accessToken);
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    });
  }
  else{
    history.push('/login')
  }
  

 

  useEffect(() => {}, []);
  const renderSwitch = function()
  {
    switch(activeItem){
        case 'profile': return <Profile/>
        case 'productList': return <ProductList/>;
        case 'Posts': return <div>Bạn đang xem danh sách bài viết</div>;
        case '4': return <div></div>;
        default: return <div></div>
    }
}

  return (
    <div>
      <Grid stackable>
        <Grid.Column width={2}>
          <Menu fluid vertical borderless inverted>
            <Menu.Header style={{
                  fontSize: "large",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                content="MENU">
            </Menu.Header>
            <Divider inverted/>
            <Menu.Item
              icon="user"
              name="profile"
              content="Thông tin người dùng"
              active={activeItem === "profile"}
              onClick={(event) => {
                setActiveItem("profile");
              }}
            />
            <Menu.Item
              icon="shopping basket"
              name="productList"
              content="Danh sách sản phẩm"
              active={activeItem === "productList"}
              onClick={(event) => {
                setActiveItem("productList");
              }}
            />
            <Menu.Item
            icon="pencil"
              name="Posts"
              content="Danh sách bài đăng"
              active={activeItem === "Posts"}
              onClick={(event) => {
                setActiveItem("Posts");
              }}
            />
            <Menu.Item
              name="links"
              active={activeItem === "links"}
              onClick={(event) => {
                setActiveItem("links");
              }}
            />
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <Segment style={{marginTop: "1em"}}>
            {renderSwitch()}
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default UserProfile;
