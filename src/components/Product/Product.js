import React, {useEffect, useState} from "react";
import { Card, Image, Rating, Button, Grid, Form } from "semantic-ui-react";
import "./Product.css";
import { useStateValue } from "../../StateProvider/StateProvider";
import { IMG_HOST } from "../../config/endpoints";
import moment from "moment";



function Product({ id, title, nowPrice, images, dateCreated,dateEnded, highestBid}) {
  const [, dispatch] = useStateValue();
  const [endedCounter, setEndedCounter] = useState();
  const [expired, setExpired] = useState(false);

  useEffect(()=>{

    setInterval(() => {
      let endedIn = moment(moment(dateEnded).format("DD-MM-YYYY HH:mm:ss"), "DD-MM-YYYY HH:mm:ss");
      setEndedCounter(endedIn.from(moment()));
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
        nowPrice,
        images,
        dateCreated,
        dateEnded
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

          <Card.Description>
            <i className="user icon" />
            <span>Người đặt giá cao nhất: </span>
            <span className="product__bidder">{highestBid}</span>
          </Card.Description>
          <Card.Description>
            <i className="calendar alternate outline icon" />
            <span>Ngày đăng: </span>
            <span className="">{moment(dateCreated).format("DD-MM-YYYY HH:mm:ss")}</span>
          </Card.Description>
          <Card.Description>
            <i className="money bill alternate outline icon" />
            <span>Giá hiện tại: </span>
            <span className="product__price">{nowPrice} VNĐ</span>
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
                      <span className="product__timer_timeout">{endedCounter}</span>
                    </div>
                    )
                  }
                   {
                    expired === false&&(
                      <div className="right floated">
                      <i className="clock outline icon product__timer" />
                      <span className="product__timer">{endedCounter}</span>
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
