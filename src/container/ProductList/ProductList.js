import React, { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import {
  Container,
  Grid,
  Segment,
  Dimmer,
  Loader,
  Menu,
  Input,
  Pagination,
  Dropdown,
  Header,
} from "semantic-ui-react";
import "./ProductList.css";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import Alert from "../../Common/Alert";
import webSocket from "../../Common/WebSocket";
import moment from "moment";
import './ProductList.css'

function ProductList({productType}) {
  const [allProduct, setAllProduct] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [activeItem, setActiveItem] = useState("all");
  const [category, setCategory] = useState([]);

  const [postsPerPage] = useState(6);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [pageTitle, setPageTitle] = useState("Danh sách sản phẩm");
  const [isSortByPrice, setIsSortByPrice] = useState(false);

  useEffect(() => {
    moment.locale('vi');
    // get category
    axios.get(`${API_HOST}/api/category`).then(function (res) {
      setCategory(res?.data?.data);
    });

    if(new URLSearchParams(window.location.search).get("sortByPrice")) {
      setIsSortByPrice(true)
    }
    
    // get product
    let endpoint = "";
    switch(productType) {
      case "coming-auction-end":
        endpoint = "api/product/auction-coming-end";
        setPageTitle("Danh sách sản phẩm có nhiêu lượt đánh giá nhất")
        break;
      case "all":
        endpoint = "api/product";
        setPageTitle("Danh sách sản phẩm")
        break;
      default:
        endpoint = "api/product";
        setPageTitle("Danh sách sản phẩm")
        break;
    }
    console.log(`${API_HOST}/${endpoint}`)
    axios
      .get(`${API_HOST}/${endpoint}`)
      .then(function (res) {
        setLoading(false);
        const data = res.data;
        console.log(data)
        // save all data
        setAllProduct(data);
        setPageCount(Math.ceil(data.length / postsPerPage));
      })
      .catch(function (error) {
        setAlertStatus(true);
        setAlertType("error");
      });
  }, []);

  const onMenuClick = async (menuValue) => {
    setActiveItem(menuValue);
    if (menuValue == 0) {
      setDisplayProducts(getProductData(allProduct));
    } else {
      var filteredProduct = allProduct.filter(
        (item) => item.IdCategory == menuValue
      );
      setDisplayProducts(getProductData(filteredProduct));
    }
  };

  webSocket.onopen = function () {
    //webSocket.send(JSON.stringify({message: 'What is the meaning of life, the universe and everything?'}));
    console.log("connected to server");
  };
  webSocket.onmessage = function (message) {
    if (JSON.parse(message.data)[0] === "newProduct") {
      let data = JSON.parse(message.data)[1];
      setProduct([...product, data]);
    }
  };

  const sortOptions = [
    {
      key: 1,
      text: "Giá từ cao đến thấp",
      value: 1,
      label: { color: "red", empty: true, circular: true },
    },
    {
      key: 2,
      text: "Giá từ thấp đến cao",
      value: 2,
      label: { color: "blue", empty: true, circular: true },
    },
    {
      key: 3,
      text: "Xem nhiều nhất",
      value: 3,
      label: { color: "green", empty: true, circular: true },
    },
  ];

  const onSort = (value) => {
    console.log(value);
  };

  const getProductData = (productData) => {
    return productData.map((product, index) => (
      <Grid.Column stretched key={index}>
        <Product
          id={product.id}
          key={product.id}
          title={product.Name}
          nowPrice={product.NowPrice}
          buyNowPrice={product.buyNowPrice}
          dateCreated={product.DateCreated}
          dateEnded={product.DateEnd}
          biddeds={product.UserBuyer.length}
          highestBid={
            product.UserBuyer?.length > 0
              ? `*****${product.UserBuyer[0].Lastname}`
              : "Chưa có"
          }
          //rating={product.rating}
          images={product.images}
        ></Product>
      </Grid.Column>
    ));
  };

  const getAllPosts = () => {
    var products = allProduct
    if (isSortByPrice) {
      products.sort((i, j) => j.NowPrice - i.NowPrice)
    }
    var slice = products.slice(offset * postsPerPage, (offset * postsPerPage) + postsPerPage);
    setDisplayProducts(getProductData(slice));
  };

  const onPageChange = (event, data) => {
    setOffset(data.activePage - 1);
  };

  useEffect(() => {
    getAllPosts();
  }, [allProduct, offset]);

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
        <Container className="home-container">
          <Menu secondary>
            <Grid container columns={3} doubling stackable>
              <Menu.Item
                key={0}
                name="Tất cả"
                active={true}
                active={activeItem === 0}
                onClick={() => onMenuClick(0)}
              />
              {category.map((item, index) => {
                return (
                  <Menu.Item
                    key={index}
                    name={item.Name}
                    active={activeItem === item.id}
                    onClick={() => onMenuClick(item.id)}
                  />
                );
              })}
              <Menu.Item key={1000}>
                <Input icon="search" placeholder="Tìm kiếm..." />
              </Menu.Item>
              <Menu.Item>
                <Dropdown
                  onChange={(e, data) => onSort(data)}
                  placeholder="Sắp xếp"
                  clearable
                  options={sortOptions}
                  selection
                />
              </Menu.Item>
            </Grid>
          </Menu>
          <Header>{pageTitle}</Header>
          <Grid container columns={3} doubling stackable>
            {displayProducts}
          </Grid>
        </Container>
      )}
      <div className="paging">
        <Pagination
          onPageChange={onPageChange}
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={pageCount}
        />
      </div>
    </div>
  );
}

export default ProductList;
