import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Item, Card, Grid, Message } from "semantic-ui-react";
import "./Category.css";
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
  Tabs
} from "antd";
import { API_HOST, API_HOST_DEV } from "../../../config/endpoints";
import { NotificationTwoTone } from "@ant-design/icons";
import axios from "axios";

const { TabPane } = Tabs;
function Category() {
  const history = useHistory();
  const [data, setdata] = useState([
    {
      Name: "nam",
      DateCreated: "2021-10-24T00:00:00",
    },
  ]);

  function callback(key) {
    console.log(key);
  }

  const [isModalVisibleAddCategory, setIsModalVisibleAddCategory] =
    useState(false);
  const [isModalVisibleDeleteCategory, setIsModalVisibleDeleteCategory] =
    useState(false);

  const [isModalVisibleUpdateCategory, setIsModalVisibleUpdateCategory] =
    useState(false);
  const [namcategory, setNamecategory] = useState();
  const [namupdatecategory, setNameUpdatecategory] = useState();
  const [selectedRow, setSeletedRow] = useState(null);
  const [selectedId, setSeletedId] = useState();

  const formatDatime = (a) => {
    return a.toString().slice(0, 19).replace("T", " ");
  };

  let config = {
    headers: {
      "x-access-token": localStorage.accessToken,
      "Content-Type": "application/json",
    },
  };

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Lỗi thao tác",
      description: "Danh mục đã tồn tại sản phẩm không thể xóa",
    });
  };

  const handledetail = (id) => {
    history.push("./product?id=" + id);
    console.log(id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "DateCreated",
      dataIndex: "DateCreated",
      key: "DateCreated",
      render: (text) => <p>{formatDatime(text)}</p>,
    },
    {
      title: "Product",
      key: "id",
      render: (text, record) => {
        return (
          <Space
            size="middle"
            onClick={() => {
              setSeletedRow(record);
              setSeletedId(record.id);
            }}
          >
            <Button
              className="div_btn_green"
              type="primary"
              ghost
              onClick={() => {
                handledetail(record.id);
              }}
            >
              Details
            </Button>
          </Space>
        );
      },
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
              setNameUpdatecategory(record.Name);
            }}
          >
            <Button type="primary" ghost onClick={showModalUpdateCategory}>
              Update
            </Button>
            <Button
              type="primary"
              danger
              ghost
              onClick={showModalDeleteCategory}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const showModalAddCategory = () => {
    setIsModalVisibleAddCategory(true);
  };

  const handleCancelAddCategory = () => {
    setIsModalVisibleAddCategory(false);
  };

  const handleOkAddCategory = () => {
    setIsModalVisibleAddCategory(false);
    let obcatebory = {
      Name: namcategory,
    };

    axios
      .post(
        `${API_HOST_DEV}/api/category/add`,
        {
          body: obcatebory,
        },
        config
      )
      .then((response) => {
        FnLoadCategory();
      })
      .catch((error) => {
        console.log("error " + error);
      });
  };

  const showModalDeleteCategory = () => {
    setIsModalVisibleDeleteCategory(true);
  };

  const handleCancelDeleteCategory = () => {
    setIsModalVisibleDeleteCategory(false);
  };

  const handleOkDeleteCategory = () => {
    setIsModalVisibleDeleteCategory(false);
    axios
      .get(`${API_HOST_DEV}/api/category/delete/` + selectedRow.id, {}, config)
      .then((response) => {
        FnLoadCategory();
      })
      .catch((error) => {
        console.log("error " + error);
        openNotificationWithIcon("error");
      });
  };

  const handleCancelUpdateCategory = () => {
    setIsModalVisibleUpdateCategory(false);
  };

  const handleOkUpdateCategory = () => {
    setIsModalVisibleUpdateCategory(false);

    axios
      .post(
        `${API_HOST_DEV}/api/category/update`,
        {
          Name: namupdatecategory,
          id: selectedRow.id,
        },
        config
      )
      .then((response) => {
        FnLoadCategory();
      })
      .catch((error) => {
        console.log("error " + error);
      });
  };

  const showModalUpdateCategory = () => {
    setIsModalVisibleUpdateCategory(true);
  };

  let FnLoadCategory = () => {
    axios
      .get(`${API_HOST_DEV}/api/category`, {},config)
      .then((response) => {
        setdata(response.data.data);
      })
      .catch((error) => {
        console.log("error " + error);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    FnLoadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="div__Content">
        <div className="div__Alert">
          <Row>
            <Col span={16}></Col>
            <Col span={8}></Col>
          </Row>
        </div>

        <Container>
          <div className="div__parent">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Quản lý danh mục" key="1" size="large">
              <Button type="primary" onClick={showModalAddCategory}>
                Add Category
              </Button>
              <Table
                pagination={{ pageSize: 4 }}
                columns={columns}
                dataSource={data}
              />
            </TabPane>
          </Tabs>
            
          </div>
        </Container>
        <Modal
          title="ADD CATEGORY"
          visible={isModalVisibleAddCategory}
          onOk={handleOkAddCategory}
          onCancel={handleCancelAddCategory}
        >
          <p>Name Category</p>
          <Input
            value={namcategory}
            placeholder="Basic usage"
            onChange={(e) => setNamecategory(e.target.value)}
          />
        </Modal>
        <Modal
          title="DELETE CATEGORY"
          visible={isModalVisibleDeleteCategory}
          onOk={handleOkDeleteCategory}
          onCancel={handleCancelDeleteCategory}
        >
          <h1>
            <b className="delete__category">Bạn có chắc muốn xóa </b>{" "}
            <NotificationTwoTone />{" "}
          </h1>
        </Modal>
        <Modal
          title="UPDATE CATEGORY"
          visible={isModalVisibleUpdateCategory}
          onOk={handleOkUpdateCategory}
          onCancel={handleCancelUpdateCategory}
        >
          <p>Name Category</p>
          <Input
            value={namupdatecategory}
            placeholder="Basic usage"
            onChange={(e) => setNameUpdatecategory(e.target.value)}
          />
        </Modal>
      </div>
    </>
  );
}

export default Category;
