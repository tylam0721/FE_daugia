import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Button,
  Segment,
  Dimmer,
  Loader,
  Container,
  Grid,
  Form,
  Message,
  Divider,
  Label,
  Image,
  Icon,
  Rating,
  Table,
  Breadcrumb,
  Input,
} from "semantic-ui-react";
import CurrencyFormat from "react-currency-format";
import { setLogLevel } from "firebase";

function Bidding( expired, userId, IdUserSeller) {
  const[loading,SetLoading] = useState(false);
  const [checkValid, SetCheckValid] = useState("");
  const [bidAmount, SetBidAmount] = useState("");
  const onChangeBidAmount = function (values) {
    if (values < 100000) {
      SetCheckValid("Giá tiền không được nhỏ hơn giá khởi điểm");
    } else {
      const { formattedValue, value } = values;
      // formattedValue = $2,223
      // value ie, 2223
      SetBidAmount(formattedValue);
      SetCheckValid("");
    }
  };


  return (
    <div>
       
    </div>
  );
}
export default Bidding;
