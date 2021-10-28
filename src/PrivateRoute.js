import React, {useEffect} from "react";
import { Router, Route, Redirect } from "react-router-dom";
import { useStateValue } from "./StateProvider/StateProvider";



export default function PrivateRoute ({component: Component, authed, ...rest}) {

    return (
      <Route
        {...rest}
        render={(props) => authed === true
          ? <Component {...props} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
      />
    )
  }