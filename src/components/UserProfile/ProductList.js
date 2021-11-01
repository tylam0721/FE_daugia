import React, { useState, useEffect } from "react";
import { Table, Dropdown, Image, Button, Form, Icon,Loader,Dimmer } from "semantic-ui-react";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";

function ProductList() {
  const countryOptions = [
    { key: "all", value: "all", text: "Tất cả" },
    { key: "fav", value: "fav", text: "Sản phẩm yêu thích" },
    { key: "bid", value: "bid", text: "Sản phẩm bạn đang đấu giá" },
    { key: "win", value: "win", text: "Sản phẩm đã thắng" },
  ];
  const [loading, setLoading] = useState(true);

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

        <Table.Body>
          <Table.Row verticalAlign='top'>
            <Table.Cell>
              <Image
                src="https://react.semantic-ui.com/images/wireframe/image.png"
                size="small"
              />
            </Table.Cell>
            <Table.Cell>RTXX TIGERBYTE</Table.Cell>
            <Table.Cell>100,000,000 vnđ</Table.Cell>
            <Table.Cell>Đã bán</Table.Cell>
            <Table.Cell width="2">
            <Button color='green' icon labelPosition="right">
                Xem chi tiết
                <Icon name="right arrow" />
              </Button>
                <br/>
                <br/>
              <Button color='red' icon labelPosition="right">
                Loại bỏ
                <Icon  name="trash alternate outline" />
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
export default ProductList;
