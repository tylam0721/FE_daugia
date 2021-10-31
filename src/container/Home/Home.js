import React, { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import { Container, Grid, Segment, Dimmer, Loader, Menu, Input, Pagination } from "semantic-ui-react";
import "./Home.css";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import Alert from "../../Common/Alert";
import webSocket from "../../Common/WebSocket";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

function Home() {
  const [allProduct, setAllProduct] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeItem, setActiveItem] = useState("all");
  const [category, setCategory] = useState([]);

  useEffect(() => {
    // get product
    axios
      .get(`${API_HOST}/api/product`)
      .then(function (res) {
        setProduct(res?.data);
        setAllProduct(res?.data);
        setLoading(false);
      })
      .catch(function (error) {

        setAlertStatus(true);
        setAlertType("error");
      });

    // get category
    axios
      .get(`${API_HOST}/api/category`)
      .then(function (res) {
        // console.log(res?.data?.data)
        setCategory(res?.data?.data);
      })
      .catch(function (error) {
      });
  }, []);
  const onMenuClick = async (menuValue) => {
    setActiveItem(menuValue);
    if (menuValue == 0) {
      setProduct(allProduct);
    } else {
      var filteredProduct = allProduct.filter(item => item.IdCategory == menuValue);
      setProduct(filteredProduct);
    }
  }

  webSocket.onopen = function(){
    //webSocket.send(JSON.stringify({message: 'What is the meaning of life, the universe and everything?'}));
    console.log('connected to server');
  }
  webSocket.onmessage = function(message) {
    if(JSON.parse(message.data)[0] === 'newProduct')
    {
      let data = JSON.parse(message.data)[1];
      setProduct([...product,data]);
      console.log(product[0].Name)
    }

  };

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
              Đang tải...
            </Loader>
          </Dimmer>
        </Segment>
      ) : (
        <Container>
          <Menu secondary>

            <Grid container columns={3} doubling stackable>
              <Menu.Item
                key={0}
                name='Tất cả'
                active={true}
                active={activeItem === 0}
                onClick={() => onMenuClick(0)}
              />
              {
                category.map((item, index) => {
                  return <Menu.Item
                    key={index}
                    name={item.Name}
                    active={activeItem === item.id}
                    onClick={() => onMenuClick(item.id)}
                  />
                })
              }
              <Menu.Item key={1000}>
                <Input icon='search' placeholder='Tìm kiếm...' />
              </Menu.Item>
            </Grid>

          </Menu>
          <Grid container columns={3} doubling stackable>
            {product.map((product, index) => {
              return (
                <Grid.Column stretched key={index}>
                  <Product
                    id={product.id}
                    key={product.id}
                    title={product.Name}
                    nowPrice={product.NowPrice}
                    buyNowPrice={product.buyNowPrice}
                    dateCreated ={product.DateCreated}
                    dateEnded = {product.DateUpdated}
                    //rating={product.rating}
                    images={product.images}
                  ></Product>
                </Grid.Column>
              );
            })}

            {/* <Grid.Column stretched key={"index"}>
              <Product
                id={"product.id"}
                key={"product.id"}
                title={"RTXX TIGERBYTE"}
                price={"100.000.000"}
                buyNowPrice={"100.000.000"}
                rating={"product.rating"}
                imageUrl={"https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.6435-9/224312462_847159839544101_819576698287251221_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=dbeb18&_nc_ohc=1d6RMRJTCnAAX8PgGeA&_nc_ht=scontent.fsgn2-6.fna&oh=462b14d2fd59eb332843541e043bef09&oe=61949520"}
              ></Product>
            </Grid.Column> */}
          </Grid>
        </Container>
      )}
      <div className="paging">
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={10}
        />
      </div>

    </div>
  );
}

export default Home;
