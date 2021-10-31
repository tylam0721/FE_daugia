import React, {useEffect, useState} from "react";
import { Card, Image, Rating, Button, Grid, Form } from "semantic-ui-react";
import "./Product.css";
import { useStateValue } from "../../StateProvider/StateProvider";
import { IMG_HOST } from "../../config/endpoints";
import moment from "moment";



function Product({ id, title, price, buyNowPrice, rating, images }) {
  const [, dispatch] = useStateValue();
  const [dateEnded, setDateEnded] = useState();
  const [expired, setExpired] = useState(false);

  useEffect(()=>{

    setInterval(() => {
      let endedIn = moment("2021-10-31 12:40:00", "YYYY-MM-DD HH:mm:ss");
      setDateEnded(endedIn.from(moment()));
      var min = endedIn.diff(moment(),'seconds');
      if (min <= 0){
        //a is bigger than b actual moment.
        setExpired(true);
      }
    }, 1000);
  });

  const addTobasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        price,
        buyNowPrice,
        rating,
        images,
      },
    });
  };
  return (
    <div className="product">
      <Card className="product__card">
        <Image className="product__image" centered src={(images?.length > 0) ? `${IMG_HOST}${images[0].Name}` : 'https://giaoducthuydien.vn/wp-content/themes/consultix/images/no-image-found-360x250.png'} />
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
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <div>
                  <i className="bullhorn icon " />
                  <span>13</span>
                  <span> lượt ra giá </span>
                </div>
              </Grid.Column>
              <Grid.Column>
              
                  {
                    expired === true&&(
                      <div className="right floated">
                      <i className="clock outline icon product__timer_timeout" />
                      <span className="product__timer_timeout">{dateEnded}</span>
                    </div>
                    )
                  }
                   {
                    expired === false&&(
                      <div className="right floated">
                      <i className="clock outline icon product__timer" />
                      <span className="product__timer">{dateEnded}</span>
                    </div>
                    )
                  }
     
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Button inverted className="product__button" onClick={addTobasket}>
              <i className="hand point right outline icon" /> &nbsp;
              Xem chi tiết sản phẩm
            </Button>
        </Card.Content>
      </Card>
    </div>
  );
}

export default Product;
