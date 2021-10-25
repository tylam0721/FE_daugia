import React, { useState, useEffect } from "react";
import { Container, Item, Card, Grid, Message } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import "./Product.css";
import "antd/dist/antd.css";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Input,
  Row,
  Col,
  notification,
} from "antd";
import { API_HOST, API_HOST_DEV } from "../../../config/endpoints";
import { NotificationTwoTone } from "@ant-design/icons";
import axios from "axios";

function Upto() {
  const [data, setdata] = useState();
  const AuthStr = "Bearer ".concat("");

  const [selectedRow, setSeletedRow] = useState(null);

  let config = {
    headers: {
      Authorization: AuthStr,
      "Content-Type": "application/json",
    },
  };

  const formatDatime = (a) => {
    return a.toString().slice(0, 19).replace("T", " ");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "StepPrice",
      dataIndex: "StepPrice",
      key: "StepPrice",
      render: (text) => <p>{text}$</p>,
    },
    {
      title: "StartingPrice",
      dataIndex: "StartingPrice",
      key: "StartingPrice",
      render: (text) => <p>{text}$</p>,
    },
    {
      title: "NowPrice",
      dataIndex: "NowPrice",
      key: "NowPrice",
      render: (text) => <p>{text}$</p>,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "DateCreated",
      dataIndex: "DateCreated",
      key: "DateCreated",
      render: (text) => <p>{formatDatime(text)}</p>,
    },
    {
      title: "DateUpdated",
      dataIndex: "DateUpdated",
      key: "DateUpdated",
      render: (text) => <p>{formatDatime(text)}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Space
            size="middle"
            onClick={() => {
              setSeletedRow(record);
            }}
          >
            <Button type="primary" danger ghost>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  let FnLoadCategory = (id) => {
    axios
      .get(`${API_HOST_DEV}/api/product/category/` + id, {}, config)
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.log("error " + error);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    FnLoadCategory(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="div__Content">
        <Container>
          <div className="div__parent">
            <Table
              pagination={{ pageSize: 4 }}
              columns={columns}
              dataSource={data}
            />
          </div>
        </Container>
      </div>
    </>
  );
}

export default Upto;
