import React from "react";
import { Card, Image, Rating, Button, Grid, Form } from "semantic-ui-react";
import "./Product.css";
import { useStateValue } from "../../StateProvider/StateProvider";

function Product({ id, title, price, buyNowPrice, rating, imageUrl }) {
  const [, dispatch] = useStateValue();

  const addTobasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        price,
        buyNowPrice,
        rating,
        imageUrl,
      },
    });
  };
  return (
    <div className="product">
      <Card className="product__card">
        <Image className="product__image" centered src={imageUrl} />
        <Card.Content>
          <Card.Header className="product__title">
            <div className="ui red ribbon label">
              <i className="thumbtack  icon" />
              MỚI
            </div>
            {title}
          </Card.Header>
          <Card.Meta>
            <Rating icon="star" defaultRating={rating} maxRating={5} />
          </Card.Meta>
          <Card.Description>
            <i className="user icon" />
            <span>Người đặt giá cao nhất: </span>
            <span className="product__bidder">****Dần</span>
          </Card.Description>
          <Card.Description>
            <i className="calendar alternate outline icon" />
            <span>Ngày đăng: </span>
            <span className="">19/10/2021 </span>
          </Card.Description>
          <Card.Description>
            <i className="money bill alternate outline icon" />
            <span>Giá hiện tại: </span>
            <span className="product__price">{price} VNĐ</span>
          </Card.Description>
        </Card.Content>
        <Card.Content extra className="product__footer">
          <Grid center columns={2}>
            <Grid.Row>
              <Grid.Column>
                <div>
                  <i className="bullhorn icon " />
                  <span>13</span>
                  <span> lượt ra giá </span>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="right floated">
                  <i className="clock outline icon product__timer" />
                  <span className="product__timer">05:49:10</span>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Button inverted className="product__button" onClick={addTobasket}>
            <i className="hand point right outline icon"/> &nbsp;
 Xem chi tiết sản phẩm
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}

export default Product;
