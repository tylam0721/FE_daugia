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
import Footer from "./container/Footer/Footer";
import UserProfile from "./container/UserProfile/UserProfile";
import { useStateValue } from "./StateProvider/StateProvider";
import UploadImage from "./container/UploadImage/UploadImage";
import jwt from 'jwt-decode';
import moment from 'moment'

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    // const unsubscribe = auth.onAuthStateChanged((authUser) => {
    //   if (authUser) {
    //     //user login in .
    //     dispatch({ type: "SET_USER", user: authUser });
    //   } else {
    //     //user log out
    //     dispatch({ type: "SET_USER", user: null });
    //   }
    // });
    // return () => {
    //   unsubscribe();
    // };
    
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken != null)
    {
      // use login in
      const user = jwt(accessToken); // decode your token here
      if(moment.unix(user.exp) > moment())
      {
        dispatch({ type: "SET_USER", user: user });

      }
      else{
        dispatch({ type: "SET_USER", user: null });
        localStorage.clear();
      }
      // set USER global state:
    }
    else{
      // remove USER global state:
      dispatch({ type: "SET_USER", user: null });
      localStorage.clear();
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Router>
        <Header></Header>
        <Switch>
          <Route path="/" component={Home} exact></Route>
          <Route path="/uploadImage" component={UploadImage}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/checkout" component={Checkout}></Route>
          <Route path="/profile" component={UserProfile}></Route>
        </Switch>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
