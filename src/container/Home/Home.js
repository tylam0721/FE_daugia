import React, { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import { Container, Grid, Segment, Dimmer, Loader, Menu, Input } from "semantic-ui-react";
import "./Home.css";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import Alert from "../../Common/Alert";

function Home() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeItem, setActiveItem] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_HOST}/api/product`)
      .then(function (res) {
        setProduct(res?.data);
        setLoading(false);
      })
      .catch(function (error) {

        setAlertStatus(true);
        setAlertType("error");
      });
  }, []);

  const onMenuClick = (menuValue) => {
    setActiveItem(menuValue);
  }

  return (
    <div className="home">
      <Alert
        status={alertStatus} // true or false
        type={alertType} // success, warning, error, info
        title={alertTitle} // title you want to display
        setIsAlert={setAlertStatus}
      />
      {loading ? (
        <Segment className="home__segment">
          <Dimmer active inverted>
            <Loader size="large" className="home__loaderMessage">
              Loading...
            </Loader>
          </Dimmer>
        </Segment>
      ) : (
        <Container>
                <Menu secondary>
        <Menu.Item
          name='Tất cả'
          active={true}
          active={activeItem === 'all'}
          onClick={() => onMenuClick("all")}
        />
        <Menu.Item
          name='Đồ điện tử'
          active={activeItem === 'electronic'}
          onClick={() => onMenuClick("electronic")}
        />
        <Menu.Item
          name='Đồ gia dụng'
          active={activeItem === 'houseware'}
          onClick={() => onMenuClick("houseware")}
        />
        <Menu.Item>
          <Input icon='search' placeholder='Tìm kiếm...' />
        </Menu.Item>
      </Menu>
          <Grid container columns={3} doubling stackable>
            {product.map((product, index) => {
              return (
                <Grid.Column stretched key={index}>
                  <Product
                    id={product.id}
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    buyNowPrice={product.buyNowPrice}
                    rating={product.rating}
                    imageUrl={product.imageUrl}
                  ></Product>
                </Grid.Column>
              );
            })}

            <Grid.Column stretched key={"index"}>
              <Product
                id={"product.id"}
                key={"product.id"}
                title={"RTXX TIGERBYTE"}
                price={"100.000.000"}
                buyNowPrice={"100.000.000"}
                rating={"product.rating"}
                imageUrl={"https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.6435-9/224312462_847159839544101_819576698287251221_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=dbeb18&_nc_ohc=1d6RMRJTCnAAX8PgGeA&_nc_ht=scontent.fsgn2-6.fna&oh=462b14d2fd59eb332843541e043bef09&oe=61949520"}
              ></Product>
            </Grid.Column>
          </Grid>
        </Container>
      )}
    </div>
  );
}

export default Home;
