import React, { useEffect } from "react";
import "./App.css";

//component
import Header from "./components/Header/Header";
//router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//container
import Home from "./container/Home/Home";
import Login from "./container/Login/Login";
import Register from "./container/Register/Register";
import Checkout from "./container/Checkout/Checkout";
import AdminCategory from "./container/Admin/Category/Category";
import AdminProduct from "./container/Admin/Product/Prodcuct";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Footer from "./container/Footer/Footer";
import UserProfile from "./container/UserProfile/UserProfile";
import { useStateValue } from "./StateProvider/StateProvider";
import UploadImage from "./container/UploadImage/UploadImage";
import UploadProduct from "./components/UploadProduct/UploadProduct";
import AccountActivation from "./container/AccountActivation/AccountActivation";
import jwt from "jwt-decode";
import moment from "moment";
import { useHistory, Redirect } from "react-router-dom";
import webSocket from "./Common/WebSocket";

function App() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();




  var userValidated = function () {
    if (user !== null) {
      history.push("/");
    }
  };

  var userValidation = function () {
    if (user !== null) {
      history.push("/login");
    }
  };

  useEffect(() => {

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken != null) {
      const user = jwt(accessToken);
      if (moment.unix(user.exp) > moment()) {
        dispatch({ type: "SET_USER", user: user });
      } else {
        dispatch({ type: "SET_USER", user: null });
        localStorage.clear();
      }
    } else {
      dispatch({ type: "SET_USER", user: null });
      localStorage.clear();
    }
  }, [dispatch]);




  return (
    <div className="app">
      <Router>
        <Header></Header>
        <main>
          {/* <SideMenu></SideMenu> */}
          <Switch>
            <Route path="/" component={Home} exact></Route>
            {/* <PrivateRoute authed={user !== null} path='/product/add' component={UploadProduct} /> */}
            <Route
              path="/product/add"
              component={UploadProduct}
              onEnter={userValidation}
            ></Route>
            <Route path="/product/upload-image" component={UploadImage}></Route>
            <Route
              path="/login"
              component={Login}
              onEnter={userValidated}
            ></Route>
            <Route
              path="/register"
              component={Register}
              onEnter={userValidated}
            ></Route>
            <Route path="/checkout" component={Checkout}></Route>
            <Route
              path="/profile"
              component={UserProfile}
              onEnter={userValidation}
            ></Route>
              <Route
              path="/product/detail/:id"
              component={ProductDetail}
              onEnter={userValidation}
            ></Route>
            <Route
              exact
              path="/accountActivation/:code"
              component={AccountActivation}
            ></Route>
            <Route path="/admin/category" component={AdminCategory}></Route>
            <Route path="/admin/product" component={AdminProduct}></Route>
          </Switch>
        </main>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
