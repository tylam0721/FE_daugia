import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { Link, useHistory, useParams } from "react-router-dom";
import "./ProductDetail.css";
import {
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
} from "semantic-ui-react";

function ProductDetail() {
  const sections = [
    { key: "Home", content: "Home", link: true },
    { key: "Store", content: "Store", link: true },
    { key: "Shirt", content: "T-Shirt", active: true },
  ];
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState("");
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${API_HOST}/api/product/${id}`)
      .then(function (res) {
        setLoading(false);
        setPost(res?.data?.data);
      })
      .catch(function (error) {});
  }, []);

  return (
    <div className="home">
      {loading ? (
        <Segment className="home__segment">
          <Dimmer active inverted>
            <Loader size="large" className="home__loaderMessage">
              Đang tải...
            </Loader>
          </Dimmer>
        </Segment>
      ) : (
        <Container>
          <div fluid>
            <Grid
              columns={"equal"}
              divided
              style={{ padding: "1em" }}
              stackable
            >
              <Grid.Row stretched>
                <Grid.Column width={8}>
                  <Segment></Segment>
                </Grid.Column>
                <Grid.Column width={8} fluid>
                  <Segment>
                    <Breadcrumb fluid icon="right angle" sections={sections} />
                    <br />
                    <h3>Cạc màn hình RTXX Ricardo</h3>
                    <Message size="large" color={"blue"}>
                      <Message.Header>Giá khởi điểm</Message.Header>
                      <p style={{color:'red', fontWeight:'bold'}}>1.300.000 VNĐ</p>
                    </Message>
                    <Grid style={{ padding: "1em" }} columns={2} divided>
                      <Grid.Row>
                        <Grid.Column>
                          <Icon name="user" /> baoanh2003199
                        </Grid.Column>
                        <Grid.Column>
                          <Rating icon="star" defaultRating={5} maxRating={5} />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Message>
                      <Message.Header>Thông tin sản phẩm</Message.Header>
                      <Message.List>
                      <Message.Item>
                          <Icon name="money" /> Bước giá:{" "}
                        </Message.Item>
                        <Message.Item>
                          <Icon name="calendar outline" /> Thời gian đăng:{" "}
                        </Message.Item>
                        <Message.Item>
                          <Icon name="clock outline" /> Thời gian kết thúc:{" "}
                        </Message.Item>
                      </Message.List>
                    </Message>
                  </Segment>
                  <Divider />
                  <Segment>
                    <Message positive>
                      <Message.Header>Người đặt giá cao nhất</Message.Header>
                      <p>
                        <b>abcxyz</b> đang đặt giá cao nhất hiện tại:{" "}
                        <b>1.300.000 vnđ</b>
                      </p>
                    </Message>
                    <Table celled selectable unstackable>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Thời điểm</Table.HeaderCell>
                          <Table.HeaderCell>Người mua</Table.HeaderCell>
                          <Table.HeaderCell>Giá đặt mua</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>John</Table.Cell>
                          <Table.Cell>No Action</Table.Cell>
                          <Table.Cell>None</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jamie</Table.Cell>
                          <Table.Cell>Approved</Table.Cell>
                          <Table.Cell>Requires call</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jill</Table.Cell>
                          <Table.Cell>Denied</Table.Cell>
                          <Table.Cell>None</Table.Cell>
                        </Table.Row>
                        <Table.Row warning>
                          <Table.Cell>John</Table.Cell>
                          <Table.Cell>No Action</Table.Cell>
                          <Table.Cell>None</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jamie</Table.Cell>
                          <Table.Cell positive>Approved</Table.Cell>
                          <Table.Cell warning>Requires call</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jill</Table.Cell>
                          <Table.Cell negative>Denied</Table.Cell>
                          <Table.Cell>None</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Segment style={{ padding: "1em" }}>
              Hiển thị mô tả sản phẩm tại đây
            </Segment>
          </div>
        </Container>
      )}
    </div>
  );
}
export default ProductDetail;
