import { Table, Image, Button, Form, Icon, Loader, Dimmer } from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import moment from "moment";
// import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
// import { useStateValue } from "../../StateProvider/StateProvider";
// // import { useHistory, Redirect } from "react-router-dom";

// const onClickDetail = () => {
//     history.push(`/product/detail/${id}`);
//   };

const compareDate=(date1)=>{
    const currentDate=moment(moment(),"YYYY-MM-DD HH:mm:ss");
    const date = moment(date1,"YYYY-MM-DD HH:mm:sss");
    console.log(date.diff(currentDate,'days'));
    return date.diff(currentDate,'days');
}

function Product({list}) {
    return (
        <Table.Body>
            {
                list.map(function (item) {
                    var status = "";
                    if(compareDate(item.DateEnd)<=0){
                        status="on sale";
                    }
                    else
                    {
                        status = "sold";
                    }
                    return (
                        <Table.Row>
                            <Table.Cell>{item.Name}</Table.Cell>
                            <Table.Cell>{item.NowPrice}</Table.Cell>
                            <Table.Cell>{status}</Table.Cell>
                            <Table.Cell width="2">
                                <a href={`/product/detail/${item.id}`}>
                                    <Button color='green' icon labelPosition="right">
                                        Xem chi tiết
                                        <Icon name="right arrow" />
                                    </Button>
                                </a>
                                
                                <br />
                                <br />
                                <Button color='red' icon labelPosition="right">
                                    Loại bỏ
                                    <Icon name="trash alternate outline" />
                                </Button>

                            </Table.Cell>
                        </Table.Row>
                    )
                })
            }

        </Table.Body>
    );
}
export default Product;