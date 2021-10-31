import React, { useEffect, useState } from "react";
import { Menu, Icon, Dropdown, Button } from "semantic-ui-react";

import "./Header.css";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import { useStateValue } from "../../StateProvider/StateProvider";

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();

  const options = [
    {
      key: 1,
      text: "Nâng cấp tài khoản",
      value: 1,
      as: Link,
      to: "/admin/upto",
    },
    { key: 2, text: "Hạ Cấp tài khoản", value: 2, as: Link, to: "/admin/downto" },
  ];

  const login = () => {
    if (user) {
      dispatch({ type: "SET_USER", user: null });
      localStorage.clear();
    }
  };

  return (
    <div className="header">
      <Menu stackable>
        <Menu.Menu position="left">
          <Menu.Item>
            <Link to="/" className="header__leftItem">
              <img
                className="header__logo"
                src="https://img.icons8.com/plasticine/100/000000/auction.png"
                alt="secondhand store logo"
              />
              <p className="header__companyName">Đấu Giá Online</p>
            </Link>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {(user?.scope == 15) ? (
            <div>
              <Link to="/product/add">
                <Menu.Item>
                  <Icon name="upload" /> Đăng sản phẩm
                </Menu.Item>
              </Link>
            </div>
          ) : (
            <></>
          )}
                    {user ? (
            <div>
              <Link to="/profile">
                <Menu.Item>
                  <Icon name="user" />
                  {`
                ${user.email ? user.email : "your email here"} 
              `}
                </Menu.Item>
              </Link>
            </div>
          ) : (
            <></>
          )}
          {!user &&(
            <Link to="/register">
              <Menu.Item>
                <Icon name="user plus" /> Đăng ký
              </Menu.Item>
            </Link>
          )}
          <Link to="/login">
            <Menu.Item>
              {user ? (
                <div onClick={login}>
                  <Icon name="sign-out" />
                  Đăng xuất
                </div>
              ) : (
                <>
                  <Icon name="sign-in" />
                  Đăng nhập
                </>
              )}
            </Menu.Item>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default Header;
