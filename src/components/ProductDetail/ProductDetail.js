import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { Link, useHistory, useParams } from "react-router-dom";
import "./ProductDetail.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Product from "../../components/Product/Product";
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
import moment from "moment";
import webSocket from "../../Common/WebSocket";



function ProductDetail() {
  
  const sections = [
    { key: "Home", content: "Home", link: true },
    { key: "Store", content: "Store", link: true },
    { key: "Shirt", content: "T-Shirt", active: true },
  ];
  const [{ user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const { id } = useParams();
  const [bidAmount, SetBidAmount] = useState("");
  const [checkValid, SetCheckValid] = useState("");

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

  webSocket.onopen = function(){
    //ws.send(JSON.stringify({message: 'What is the meaning of life, the universe and everything?'}));
    console.log('connected to server');
  }
  webSocket.onmessage = function(message) {

    let data = JSON.parse(message.data);
    console.log('Socket server message', data);

  };


  useEffect(() => {
    axios
      .get(`${API_HOST_DEV}/api/product/${id}`)
      .then(async function (res) {
        setLoading(false);
        await setProduct(res.data[0]);
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
                  <Segment>
                    <AliceCarousel autoPlay autoPlayInterval="3000">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg"
                        className="sliderimg"
                      />
                      <img
                        src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg"
                        className="sliderimg"
                      />
                      <img
                        src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg"
                        className="sliderimg"
                      />
                      <img
                        src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg"
                        className="sliderimg"
                      />
                    </AliceCarousel>
                    <Divider />
                    {user ? (
                      <div>
                        {product.IdUserSeller !== user.userId && (
                          <Form>
                            <h2
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              Tham gia đấu giá
                            </h2>
                            {checkValid.length > 0 && (
                              <Form.Field>
                                <Label basic color="red" pointing="below">
                                  {checkValid}
                                </Label>
                              </Form.Field>
                            )}
                            <Form.Field>
                              <Input
                                labelPosition="right"
                                type="text"
                                placeholder="Nhập số tiền để tham gia đấu giá"
                              >
                                <CurrencyFormat
                                  value={bidAmount}
                                  thousandSeparator={true}
                                  onValueChange={onChangeBidAmount}
                                />
                                <Label>VNĐ</Label>
                              </Input>
                            </Form.Field>
                            <Button color={"green"}>Đặt giá</Button>
                          </Form>
                        )}
                        {product.IdUserSeller === user.userId &&(<Form>
                          <Button color={"green"}> <Icon name="pencil alternative"/>Bổ sung thông tin sản phẩm</Button>
                        </Form>)}
                      </div>
                    ) : (
                      <Message
                        warning
                        header="Bạn cần phải đăng nhập"
                        content="Hãy đăng nhập để được tham gia đấu giá"
                      />
                    )}
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8} fluid>
                  <Segment>
                    <Breadcrumb fluid icon="right angle" sections={sections} />
                    <br />
                    <h3>{product.Name}</h3>
                    <Message size="large" color={"blue"}>
                      <Message.Header>Giá hiện tại</Message.Header>
                      <p style={{ color: "red", fontWeight: "bold" }}>
                        <CurrencyFormat
                          value={product.StartingPrice}
                          displayType={"text"}
                          thousandSeparator={true}
                        />{" "}
                        VNĐ
                      </p>
                    </Message>
                    <Grid style={{ padding: "1em" }} columns={2} divided>
                      <Grid.Row>
                        <Grid.Column>
                          <Icon name="user" /> baoanh2003199
                        </Grid.Column>
                        <Grid.Column>
                          <Rating
                            disabled
                            icon="star"
                            defaultRating={5}
                            maxRating={5}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Message>
                      <Message.Header>Thông tin sản phẩm</Message.Header>
                      <Message.List>
                        <Message.Item>
                          <Icon name="money" />
                          <b>
                            Bước giá:{" "}
                            <CurrencyFormat
                              value={product.StepPrice}
                              displayType={"text"}
                              thousandSeparator={true}
                            />{" "}
                            VNĐ
                          </b>
                        </Message.Item>
                        <Message.Item>
                          <Icon name="calendar outline" /> Thời gian đăng: {moment(product.DateCreated).format("DD-MM-YYYY")}
                        </Message.Item>
                        <Message.Item>
                          <Icon name="clock outline" /> Thời gian kết thúc: {moment(product.DateUpdated).format("DD-MM-YYYY")}
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
                        <b>
                          <CurrencyFormat
                            value={product.NowPrice}
                            displayType={"text"}
                            thousandSeparator={true}
                          />{" "}
                          VNĐ
                        </b>
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
