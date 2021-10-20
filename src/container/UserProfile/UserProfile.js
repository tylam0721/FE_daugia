import React, { useState, useEffect } from "react";
import { Grid, Menu, Segment, Item, Divider , Icon} from "semantic-ui-react";
import "./UserProfile.css";

function UserProfile() {
  const [activeItem, setActiveItem] = useState("profile");

  useEffect(() => {}, []);

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
              name="Post"
              content="Danh sách bài đăng"
              active={activeItem === "Post"}
              onClick={(event) => {
                setActiveItem("Post");
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
            This is an stretched grid column. This segment will always match the
            tab height
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default UserProfile;
