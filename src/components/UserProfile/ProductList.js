import React, { useState, useEffect } from "react";
import { Table, Dropdown, Image, Button, Form, Icon, Loader, Dimmer } from "semantic-ui-react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";
import Product from "../../components/UserProfile/Product";

function ProductList() {
  const countryOptions = [
    { key: "all", value: "all", text: "Tất cả" },
    { key: "fav", value: "fav", text: "Sản phẩm yêu thích" },
    { key: "bid", value: "bid", text: "Sản phẩm bạn đang đấu giá" },
    { key: "win", value: "win", text: "Sản phẩm đã thắng" },
  ];
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [watchList, setWatchList] = useState([]);
  const [biddingList, setBiddingList] = useState([]);
  const [winBidList, setWinBidList] = useState([]);

  useEffect(() => {
    if(user && user.userId)
    {
      axios
      .get(`${API_HOST}/api/user/info/${user.userId}`)
      .then(async (res)=>{
        // handle success

        await setWatchList(res.data.watchlist);
        await setBiddingList(res.data.auctionList);
        // <Redirect to='/'/>
        // setUserInfo(res?.data?.accessToken);
        console.log(watchList);
        setLoading(false);
      })
      .catch((error)=>{
        // handle error
        history.push('/');
      });
    }
  }, [dispatch]);

  return (
    <div>
      <Dropdown
        floated="right"
        placeholder="Chọn danh sách..."
        selection
        options={countryOptions}
      />

      <Table stripped >
        <Table.Header >
          <Table.Row>
            <Table.HeaderCell>Sản phẩm</Table.HeaderCell>
            <Table.HeaderCell>Tên sản phẩm</Table.HeaderCell>
            <Table.HeaderCell>Giá</Table.HeaderCell>
            <Table.HeaderCell>Tình trạng</Table.HeaderCell>
            <Table.HeaderCell>Thao tác</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        
          { <Product list={watchList}/>}         
        
      </Table>
    </div>
  );
}
export default ProductList;
