import React, { useState, useEffect } from "react";
import { Table, Dropdown, Image, Button, Form, Icon, Loader, Dimmer } from "semantic-ui-react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import Product from "../../components/UserProfile/Product";

function ProductList() {
  const countryOptions = [
    { key: "fav", value: "fav", text: "Sản phẩm yêu thích" },
    { key: "bid", value: "bid", text: "Sản phẩm bạn đang đấu giá" },
    { key: "win", value: "win", text: "Sản phẩm đã thắng" },
  ];
  const sellerOptions = [
    { key: "onsale", value: "onsale", text: "Sản phẩm đang bán" },
    { key: "sold", value: "sold", text: "Sản phẩm đã bán" }
  ];
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [watchList, setWatchList] = useState([]);
  const [biddingList, setBiddingList] = useState([]);
  const [winBidList, setWinBidList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [uploadList,setUploadList]=useState([]);
  const [soldList,setSoldList]=useState([]);
  useEffect(() => {
    if (user && user.userId) {
      axios
        .get(`${API_HOST}/api/user/info/${user.userId}`)
        .then(async (res) => {
          // handle success

          setProductList(res.data.watchlist);
          setWatchList(res.data.watchlist);
          setBiddingList(res.data.auctionList);
          setWinBidList(res.data.winningList);
          setUploadList(res.data.uploadList);
          setSoldList(res.data.soldList);
          // <Redirect to='/'/>
          // setUserInfo(res?.data?.accessToken)
          setLoading(false);
        })
        .catch((error) => {
          // handle error
          history.push('/');
        });
    }
  }, [dispatch]);

  const sortByOption = (event, { value }) => {
    if (value == "fav") {
      setProductList(watchList)
    }
    else if (value == "bid") {
      setProductList(biddingList);
    }
    else if (value == "win") {
      setProductList(winBidList);
    }
    else if(value == "onsale"){
      setProductList(uploadList);
    }
    else if(value=="sold"){
      setProductList(soldList);
    }
  }

  return (
    <div>
      <Dropdown
        floated="right"
        placeholder="Chọn danh sách..."
        selection
        options={countryOptions}
        defaultValue={countryOptions.key = "fav"}
        onChange={sortByOption}
      />
      {user?.scope === 15 ? (
        <Dropdown
          floated="right"
          placeholder="Chọn danh sách..."
          selection
          options={sellerOptions}
          onChange={sortByOption} />

      ) : (
        <></>
      )}
      <Table stripped >
        <Table.Header >
          <Table.Row>
            <Table.HeaderCell>Tên sản phẩm</Table.HeaderCell>
            <Table.HeaderCell>Giá</Table.HeaderCell>
            <Table.HeaderCell>Tình trạng</Table.HeaderCell>
            <Table.HeaderCell>Thao tác</Table.HeaderCell>
          </Table.Row>
        </Table.Header>


        { <Product list={productList} />}

      </Table>
    </div>
  );
}
export default ProductList;
