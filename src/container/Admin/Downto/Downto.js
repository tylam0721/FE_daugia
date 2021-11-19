import React, { useState, useEffect } from "react";
import { Container, Item, Card, Grid, Message } from "semantic-ui-react";
import "../Downto/Downto.css";
import "antd/dist/antd.css";
import {
  Table,
  Space,
  Button,
  Modal,
  Input,
  Row,
  Col,
  notification,
  message,
  Tabs
} from "antd";
import { API_HOST, API_HOST_DEV } from "../../../config/endpoints";
import { NotificationTwoTone } from "@ant-design/icons";
import axios from "axios";

const { TabPane } = Tabs;
function Upto() {
  const [data, setdata] = useState();
  const AuthStr = "Bearer ".concat("");

  const [isModalVisibleUpto, setIsModalVisibleAddUpto] =
    useState(false);

  const [selectedRow, setSeletedRow] = useState(null);
  const [selectedRowID, setSeletedRowID] = useState(null);

  let config = {
    headers: {
      Authorization: AuthStr,
      "Content-Type": "application/json",
    },
  };

  const formatDatime = (a) => {
    if(a !== null){
      return a.toString().slice(0, 19).replace("T", " ");
    }
    return "";
  };

  function callback(key) {
    console.log(key);
  }

  const columns = [
    {
      title: "Firstname",
      dataIndex: "Firstname",
      key: "Firstname",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "NameRole",
      dataIndex: "NameRole",
      key: "NameRole",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "RateGood",
      dataIndex: "RateGood",
      key: "RateGood",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "RateBad",
      dataIndex: "RateBad",
      key: "RateBad",
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
              //setSeletedRow(record);
            }}
          >
            <Button type="primary" danger ghost onClick={() => showModalUpto(record.id)}>
              DOWNTO
            </Button>
          </Space>
        );
      },
    },
  ];

  const showModalUpto = (id) => {
    setIsModalVisibleAddUpto(true);
    console.log(id);
    setSeletedRowID(id);
  };

  const handleCancelUpto = () => {
    setIsModalVisibleAddUpto(false);
  };

  const handleOkUpto = () => {
    setIsModalVisibleAddUpto(false);
    axios
      .post(`${API_HOST_DEV}/api/admin/downto`, {
        id: selectedRowID
      }, config)
      .then((response) => {
        FnLoaduser();
      })
      .catch((error) => {
        console.log("error " + error);
      });
  };

  let FnLoaduser = () => {
    axios
      .get(`${API_HOST_DEV}/api/admin/seller`, {}, config)
      .then((response) => {
        setdata(response.data.data);
      })
      .catch((error) => {
        console.log("error " + error);
      });
  };

  useEffect(() => {
    FnLoaduser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="div__Content">
        <Container>
          <div className="div__parent">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Tài khoản Seller" key="1" size="large">
              <Table
                pagination={{ pageSize: 4 }}
                columns={columns}
                dataSource={data}
            />
            </TabPane>
          </Tabs>
          </div>
        </Container>
      </div>
      <Modal
        title="DELETE CATEGORY"
        visible={isModalVisibleUpto}
        onOk={handleOkUpto}
        onCancel={handleCancelUpto}
      >
        <h1>
          <b className="delete__category">Hạ cấp tài khoản xuống Bidder </b>{" "}
        </h1>
      </Modal>
    </>
  );
}

export default Upto;
