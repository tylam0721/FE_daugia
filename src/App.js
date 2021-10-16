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
import { auth } from "./Firebase/FirebaseConfig";
import { useStateValue } from "./StateProvider/StateProvider";
import UploadImage from "./container/UploadImage/UploadImage";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    /*const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user login in .
        dispatch({ type: "SET_USER", user: authUser });
      } else {
        //user log out
        dispatch({ type: "SET_USER", user: null });
      }
    });
    return () => {
      unsubscribe();
    };*/
    
    const data = localStorage.getItem("accessToken");
    if(data != null)
    {
      console.log("logged in, access token: "+ localStorage.getItem('accessToken'));

    }
    else{
      console.log("not login");
    }
  }, [dispatch]);

  console.log( user);
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
        </Switch>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
