import React, { useState, useEffect } from "react";
import { Grid, Menu, Segment, Dimmer, Divider , Loader} from "semantic-ui-react";
import "./UserProfile.css";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import Profile from "../../components/UserProfile/Profile";
import ProductList from "../../components/UserProfile/ProductList";
import AddProduct from "../../components/AddProduct/AddProduct"


function UserProfile() {
const history = useHistory();
const [{ user }, dispatch] = useStateValue()
const [activeItem, setActiveItem] = useState("profile");
const [loading, setLoading] = useState(true);

  if(user && user.userId)
  {
    axios
    .get(`${API_HOST}/api/user/info/${user.userId}`)
    .then(function (res) {
      // handle success
      // <Redirect to='/'/>
      // setUserInfo(res?.data?.accessToken);
      setLoading(false);
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
        case 'LogOut': return <div>Bạn đang xem danh sách bài viết</div>;
        case 'postProduct': return <AddProduct/>;
        default: return <div></div>
    }
}

  return (
    <div>
       {loading ? (
        <Segment className="home__segment">
          <Dimmer active inverted>
            <Loader size="large" className="home__loaderMessage">
              Đangi tải...
            </Loader>
          </Dimmer>
        </Segment>
      ) : (
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
              icon="edit"
              name="postProduct"
              content="Đăng sản phẩm"
              active={activeItem === "postProduct"}
              onClick={(event) => {
                setActiveItem("postProduct");
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
              icon="sign-out"
              name="LogOut"
              content="Đăng xuất"
              active={activeItem === "LogOut"}
              onClick={(event) => {
                setActiveItem("LogOut");
              }}
            />

          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <Segment style={{marginTop: "1em"}}>
            {renderSwitch()}
          </Segment>
        </Grid.Column>
      </Grid>)}
    </div>
  );
}

export default UserProfile;
