import {
  Input,
  Form,
  Button,
  Select,
  Progress,
  Message,
} from "semantic-ui-react";
import "./AddProduct.css";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { db, storage } from "../../Firebase/FirebaseConfig";
import { useStateValue } from "../../StateProvider/StateProvider";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import { Redirect } from "react-router";
import jwt from "jwt-decode";
import moment from "moment";
const { Option } = Select;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "${label} không được bỏ trống!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} phải lớn hơn ${min} và nhỏ hơn ${max}",
  },
};

function AddProduct() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [rating, setRating] = useState();
  const [progress, setProgress] = useState(0);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
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
        history.push("/login");
      }
    } else {
      dispatch({ type: "SET_USER", user: null });
      localStorage.clear();
      history.push("/login");
    }

    axios
      .get(`${API_HOST}/api/category`)
      .then(function (res) {
        setCategory(res?.data?.data);
      })
      .catch(function (error) {});
  }, []);

  const onFinish = (values) => {
    values.product.IdUserSeller = user?.userId;
    console.log(user);
    console.log(values.product);
    axios
      .post(`${API_HOST}/api/product/add`, values.product)
      .then(function (res) {})
      .catch(function (error) {});
  };

  const onEditorStateChange = (editorState) => {
    // console.log(editorState)
    setEditorState(editorState);
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); //proogress details
        setProgress(progress);
      },
      (error) => {
        console.error(error);
        alert(error.message);
      },
      //final upload
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside data
            db.collection("Products").add({
              title,
              price,
              rating,
              imageUrl: url,
            });
            setProgress(0);
            setTitle("");
            setPrice();
            setRating();
            setImage(null);
            history.push("/");
          });
      }
    );
  };

  return (
    <div>
      
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
    </div>
  );
}

export default AddProduct;
