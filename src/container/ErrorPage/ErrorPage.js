import React, { useState, Component } from "react";
import {
  Container,
  Button,
  Message,
} from "semantic-ui-react";
import { useHistory, Redirect } from "react-router-dom";

function ErrorPage(statusCode) {
  const history = useHistory();

  return (
    <div className="login">
      <Container>
        <Segment>
          <Message negative>
            <Message.Header>Lỗi {statusCode}</Message.Header>
            <p>Ops ! Đã có lỗi xảy ra</p>
          </Message>
          <Button
            onClick={(e) => {
              history.push("/");
            }}
          >
            Quay về trang chủ
          </Button>
        </Segment>
      </Container>
    </div>
  );
}

export default ErrorPage;
