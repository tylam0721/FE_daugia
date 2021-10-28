import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Grid,
  Progress,
  Message,
} from "semantic-ui-react";
import "./AddProduct.css";
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { db, storage } from "../../Firebase/FirebaseConfig";
import { useStateValue } from "../../StateProvider/StateProvider";
import { Link, useHistory } from "react-router-dom";


function AddProduct() {
  const history = useHistory();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [rating, setRating] = useState();
  const [progress, setProgress] = useState(0);
  const [{ user }] = useStateValue();

  const[editorState,setEditorState] = useState(EditorState.createEmpty());

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
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
    </div>
  );
}

export default AddProduct;
