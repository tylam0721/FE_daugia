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
  TextArea,
  Input,
  Tab,
  Popup,
} from "semantic-ui-react";

import moment from "moment";
import webSocket from "../../Common/WebSocket";
import HTMLRenderer from "react-html-renderer";
import { IMG_HOST } from "../../config/endpoints";
import mailer from "../../config/mailer";
//import Bidding from "./Bidding";
import CurrencyFormat from "react-currency-format";

function ProductDetail() {
  moment().locale("vi");
  const [{ user }, dispatch] = useStateValue();
  const sections = [
    { key: "Home", content: "Home", link: true },
    { key: "Store", content: "Store", link: true },
    { key: "Shirt", content: "T-Shirt", active: true },
  ];

  const panes = [
    {
      menuItem: "Thông tin sản phẩm",
      render: () => (
        <Tab.Pane>
          <Form>
            <Form.Field inline>
              <TextArea placeholder="Bổ sung thông tin sản phẩm" />
            </Form.Field>
            <Button icon color={"green"}>
              <Icon name="pencil" /> Thêm thông tin bổ sung
            </Button>
          </Form>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Danh sách người tham gia",
      render: () => (
        <Tab.Pane>
          {userInfor?.length > 0 ? (
            <Table celled selectable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Người mua</Table.HeaderCell>
                  <Table.HeaderCell>Điểm đánh giá</Table.HeaderCell>
                  <Table.HeaderCell>Thao tác</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {userInfor.map((infor) => (
                  <Table.Row key={infor.id}>
                    <Table.Cell>{`****${infor.Lastname}`}</Table.Cell>
                    <Table.Cell inline>
                      <Label>
                        <Icon name="thumbs up" color={"green"} />{" "}
                        {infor.RateGood}
                      </Label>
                      <Label>
                        <Icon name="thumbs down" color={"red"} />{" "}
                        {infor.RateBad}
                      </Label>
                    </Table.Cell>
                    <Table.Cell>
                      <Popup
                        trigger={
                          <Button
                            color="red"
                            icon="user cancel"
                            content="Từ chối"
                          />
                        }
                        content={
                          <Button
                            color="green"
                            content="Xác nhận từ chối ra giá"
                            onClick={() => {
                              RejectBidder(infor.id);
                            }}
                          />
                        }
                        on="click"
                        position="top right"
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <Table celled selectable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Người mua</Table.HeaderCell>
                  <Table.HeaderCell>Điểm đánh giá</Table.HeaderCell>
                  <Table.HeaderCell>Thao tác</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          )}
        </Tab.Pane>
      ),
    },
  ];
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const { id } = useParams();
  const [dateEnded, setDateEnded] = useState();
  const [expired, setExpired] = useState(true);
  const [isRated, setIsRated] = useState();
  const [watchListCheck, setWatchListCheck] = useState(0);
  const [checkValid, setCheckValid] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [biddingMessage, setBiddingMessage] = useState([]);
  const [bidders, setBidders] = useState([]);
  const [price, setPrice] = useState("");
  const [NowPrice, setNowPrice] = useState("");
  const [onBidded, setOnBidded] = useState(false);
  const [disableBidBtn, setDisableBidBtn] = useState(false);
  const [userInfor, setUserInfor] = useState([]);
  const [openConfirm, setOpenConfirm] = useState();

  const onChangeBidAmount = function (values) {
    if (values < NowPrice) {
      setCheckValid("Giá tiền không được nhỏ hơn giá hiện tại + bước giá");
    } else {
      const { formattedValue, value } = values;
      // formattedValue = $2,223
      // value ie, 2223
      setBidAmount(formattedValue);
      setPrice(value);
      setCheckValid("");
    }
  };

  const Confirmation = function () {
    setOpenConfirm(true);
  };

  const RejectBidder = function (userId) {
    axios
      .post(`${API_HOST_DEV}/api/action/reject`, {
        IdProduct: product.id,
        IdBuyer: userId,
      })
      .then((res) => {
        console.log("từ chối thành công");
      })
      .catch((err) => {
        console.log("từ chối ko thành công");
      });
  };

  const onWatchListCheck = function (e, { rating, maxRating }) {
    setWatchListCheck(rating);
    if (rating == 0) {
      axios
        .post(`${API_HOST}/api/watchlist/delete`, {
          IdProduct: product.id,
          IdUser: user.userId,
        })
        .then((res) => {
          console.log("thêm vào watchlist thành công");
        })
        .catch((err) => {});
    } else {
      axios
        .post(`${API_HOST}/api/watchlist/add`, {
          IdProduct: product.id,
          IdUser: user.userId,
        })
        .then((res) => {
          console.log("thêm vào watchlist thành công");
        })
        .catch((err) => {});
    }
    console.log(rating);
  };

  const biddingProcess = function () {
    if (!onBidded) {
      setOnBidded(true);
      setDisableBidBtn(true);
      axios
        .post(`${API_HOST}/api/action/check`, {
          idUser: user.userId,
          idProduct: product.id,
        })
        .then((res) => {
          if (res?.status == 201) {
            setBiddingMessage([
              "red",
              "Sản phẩm này không cho phép bidder chưa từng được đánh giá tham gia",
              false,
              "cancel",
            ]);
          } else if (res?.status == 202) {
            setBiddingMessage([
              "teal",
              "Đang gửi thông tin đấu giá. Vui lòng chờ giây lát...",
              true,
              "circle notched",
            ]);
            axios
              .post(`${API_HOST}/api/action/buys`, {
                IdProduct: product.id,
                Price: price,
                IdUser: user.userId,
              })
              .then((res) => {
                if (res.status == 202) {
                  setBiddingMessage([
                    "green",
                    "Tham gia đấu giá thành công",
                    false,
                    "checkmark",
                  ]);
                }
                setOnBidded(false);
                setDisableBidBtn(false);
              })
              .catch((err) => {
                setBiddingMessage([
                  "red",
                  "Mức giá không được nhỏ hơn giá hiện tại + bước giá",
                  false,
                  "cancel",
                ]);
                setOnBidded(false);
                setDisableBidBtn(false);
              });
          } else {
            setBiddingMessage(false);
            setOnBidded(false);
            setDisableBidBtn(false);
          }
        })
        .catch((err) => {
          setBiddingMessage([
            "red",
            "Bạn không đủ điều kiện tham gia hoặc đã bị người bán từ chối phiên đấu giá này",
            false,
            "cancel",
          ]);
          setOnBidded(false);
          setDisableBidBtn(false);
        });
    }
  };
  webSocket.onopen = function () {
    //ws.send(JSON.stringify({message: 'What is the meaning of life, the universe and everything?'}));
    console.log("connected to server");
  };
  webSocket.onmessage = function (message) {
    if (JSON.parse(message.data)[0] === "updateProductDetail") {
      let data = JSON.parse(message.data)[1];
      console.log(data[0].UserBuyer);
      setNowPrice(data[0].NowPrice);
      setBidders(data[0].UserBuyer);
      setUserInfor(data[0].UserInfor);
    }
  };

  useEffect(() => {
    function axiosGetProduct() {
      // create a promise for the axios request
      const promise = axios.get(`${API_HOST_DEV}/api/product/${id}`);

      // using .then, create a new promise which extracts the data
      const dataPromise = promise.then((response) => response.data);

      // return it
      return dataPromise;
    }
    axiosGetProduct()
      .then((data) => {
        setProduct(data[0]);
        setBidders(data[0].UserBuyer);
        setNowPrice(data[0].NowPrice);
        setUserInfor(data[0].UserInfor);
        setLoading(false);
        if (data[0].UserSeller.length > 0) {
          if (
            data[0].UserSeller[0].RateGood + data[0].UserSeller[0].RateBad ==
            0
          ) {
            setIsRated(false);
          } else {
            setIsRated(true);
          }
        }

        // if(user !== null)
        // {
        //   data[0].watch_list.map((w) => {
        //     console.log(user.userId);
        //     if(w.IdUserWatch == user.userId)
        //     {
        //       console.log(w);

        //     }
        //   });
        // }

        const timer = setInterval(() => {
          let endedIn = moment(
            moment(data[0].DateEnd).format("DD/MM/YYYY A HH:mm:ss"),
            "DD-MM-YYYY A HH:mm:ss"
          );

          var min = endedIn.diff(moment(), "seconds");
          if (min <= 0) {
            //a is bigger than b actual moment.
            setExpired(true);
            setDateEnded(endedIn.from(moment()));
          } else {
            setExpired(false);
            setDateEnded(moment(endedIn).format("HH:mm A - DD/MM/YYYY"));
          }
        }, 1000);
        if (expired === true) {
          return () => {
            clearInterval(timer);
          };
        }
      })
      .catch((err) => console.log(err));
    /*axios
      .get(`${API_HOST_DEV}/api/product/${id}`)
      .then( function (res) {
        setLoading(false);
        await setProduct(res.data[0]);
        console.log(product.DateUpdated);
      })
      .catch(function (error) {});*/
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
          <div>
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
                      <Image
                        className="sliderimg"
                        centered
                        src={
                          product.images?.length > 0
                            ? `${IMG_HOST}${product.images[0].Name}`
                            : "https://giaoducthuydien.vn/wp-content/themes/consultix/images/no-image-found-360x250.png"
                        }
                      />
                      <Image
                        className="sliderimg"
                        centered
                        src={
                          product.images?.length > 1
                            ? `${IMG_HOST}${product.images[1].Name}`
                            : "https://giaoducthuydien.vn/wp-content/themes/consultix/images/no-image-found-360x250.png"
                        }
                      />
                      <Image
                        className="sliderimg"
                        centered
                        src={
                          product.images?.length > 2
                            ? `${IMG_HOST}${product.images[2].Name}`
                            : "https://giaoducthuydien.vn/wp-content/themes/consultix/images/no-image-found-360x250.png"
                        }
                      />
                      <Image
                        className="sliderimg"
                        centered
                        src={
                          product.images?.length > 3
                            ? `${IMG_HOST}${product.images[3].Name}`
                            : "https://giaoducthuydien.vn/wp-content/themes/consultix/images/no-image-found-360x250.png"
                        }
                      />
                    </AliceCarousel>
                    <Divider />
                    {user ? (
                      <div>
                        {product.IdUserSeller !== user.userId && (
                          <Form>
                            {expired === false && (
                              <div>
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
                                <Button
                                  color={"green"}
                                  onClick={biddingProcess}
                                  disabled={disableBidBtn}
                                >
                                  Đặt giá
                                </Button>
                                <br />
                                {biddingMessage?.length > 0 && (
                                  <Form.Field>
                                    {biddingMessage[2] ? (
                                      <Message icon color={biddingMessage[0]}>
                                        <Icon name="circle notched" loading />
                                        <Message.Content>
                                          <Message.Header>
                                            Thông báo
                                          </Message.Header>
                                          {biddingMessage[1]}
                                        </Message.Content>
                                      </Message>
                                    ) : (
                                      <Message icon color={biddingMessage[0]}>
                                        <Icon name={biddingMessage[3]} />
                                        <Message.Content>
                                          <Message.Header>
                                            Thông báo
                                          </Message.Header>
                                          {biddingMessage[1]}
                                        </Message.Content>
                                      </Message>
                                    )}
                                  </Form.Field>
                                )}
                              </div>
                            )}
                            {expired === true && (
                              <Message
                                negative
                                header="Thời gian đấu giá đã kết thúc"
                                content="Phiên đấu giá của sản phẩm này đã kết thúc"
                              />
                            )}
                          </Form>
                        )}
                        {product.IdUserSeller === user.userId && (
                          <Form>
                            {expired === false && <Tab panes={panes} />}
                            {expired === true && (
                              <Message
                                warning
                                header="Sản phẩm đã hết phiên đấu giá"
                                content="Bạn không thể chỉnh sửa của sản phẩm đã hết hạn đấu giá"
                              />
                            )}
                          </Form>
                        )}
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
                <Grid.Column width={8}>
                  <Segment>
                    <Grid stackable>
                      <Grid.Row>
                        <Grid.Column width={13}>
                          <h3
                            style={{ paddingLeft: "0.5em", fontWeight: "bold" }}
                          >
                            {product.Name}
                          </h3>
                        </Grid.Column>
                        <Grid.Column width={3}>
                          <Rating
                            icon="star"
                            rating={watchListCheck}
                            maxRating={1}
                            size="massive"
                            onRate={onWatchListCheck}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Message size="large" color={"blue"}>
                      <Message.Header>Giá hiện tại</Message.Header>
                      <p style={{ color: "red", fontWeight: "bold" }}>
                        <CurrencyFormat
                          value={NowPrice}
                          displayType={"text"}
                          thousandSeparator={true}
                        />{" "}
                        VNĐ
                      </p>
                    </Message>
                    <Grid style={{ padding: "1em" }} columns={2} divided>
                      <Grid.Row>
                        <Grid.Column>
                          <Icon name="user" />
                          <b>
                            {" "}
                            {product.UserSeller?.length > 0
                              ? product.UserSeller[0].Firstname
                              : `????????`}
                          </b>
                        </Grid.Column>
                        <Grid.Column>
                          {isRated ? (
                            <Rating
                              disabled
                              icon="star"
                              defaultRating={
                                product.UserSeller?.RateGood -
                                product.UserSeller?.RateBad
                              }
                              maxRating={10}
                            />
                          ) : (
                            <div>Chưa có đánh giá</div>
                          )}
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
                          <Icon name="calendar outline" /> Thời gian đăng:{" "}
                          {moment(product.DateCreated).format(
                            "HH:mm A - DD/MM/YYYY"
                          )}
                        </Message.Item>
                        <Message.Item>
                          <Icon name="clock outline" /> Thời gian kết thúc:{" "}
                          <Label color={"red"}>{dateEnded}</Label>
                        </Message.Item>
                      </Message.List>
                    </Message>
                  </Segment>
                  <Divider />
                  <Segment>
                    <Message positive>
                      <Message.Header>
                        {bidders.length > 0
                          ? "Người đặt giá cao nhất"
                          : "Hiện tại chưa có ai tham gia đấu giá sản phẩm này"}
                      </Message.Header>
                      {bidders.length > 0 ? (
                        <p>
                          <b>{`****${bidders[0].Lastname}`}</b> đặt giá cao
                          nhất:{" "}
                          <b>
                            <CurrencyFormat
                              value={bidders[0].Price}
                              displayType={"text"}
                              thousandSeparator={true}
                            />{" "}
                            VNĐ
                          </b>
                        </p>
                      ) : (
                        <p>Hãy là người đầu tiên đấu giá cho sản phẩm này !</p>
                      )}
                    </Message>
                    {bidders.length > 0 ? (
                      <Table celled selectable unstackable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Thời điểm</Table.HeaderCell>
                            <Table.HeaderCell>Người mua</Table.HeaderCell>
                            <Table.HeaderCell>Giá đặt mua</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {bidders.map((buyer) => (
                            <Table.Row
                              key={
                                buyer.id +
                                " " +
                                moment(buyer.DateStart).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              }
                            >
                              <Table.Cell>
                                {moment(buyer.DateStart).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </Table.Cell>
                              <Table.Cell>{`****${buyer.Lastname}`}</Table.Cell>
                              <Table.Cell>
                                {" "}
                                <CurrencyFormat
                                  value={buyer.Price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />{" "}
                                VNĐ
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    ) : (
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
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    )}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Segment style={{ padding: "1em" }}>
              <HTMLRenderer html={product.Description} />
            </Segment>
          </div>
        </Container>
      )}
    </div>
  );
}
export default ProductDetail;
