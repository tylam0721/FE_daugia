import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Modal, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import './UploadProduct.css';
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import axios from "axios";
import { useStateValue } from "../../StateProvider/StateProvider";
import { Redirect } from 'react-router'
import { useHistory } from "react-router-dom";
import jwt from "jwt-decode";
import moment from "moment";
import {convertFromRaw, EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import { convertToHTML } from 'draft-convert';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import AddProduct from '../AddProduct/AddProduct';
const { Option } = Select;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} không được bỏ trống!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} phải lớn hơn ${min} và nhỏ hơn ${max}',
    },
};



const UploadProduct = () => {
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [productId, setProductId] = useState(null);
    const [{ user }, dispatch] = useStateValue();
    const [category, setCategory] = useState([]);
    const history = useHistory();
    const[editorState,setEditorState] = useState(EditorState.createEmpty());
    const  [convertedContent, setConvertedContent] = useState(null);

    useEffect(() => {        
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken != null) {
          const user = jwt(accessToken);
          if (moment.unix(user.exp) > moment()) {
            dispatch({ type: "SET_USER", user: user });
          } else {
            dispatch({ type: "SET_USER", user: null });
            localStorage.clear();
            history.push('/login');
          }
        } else {
          dispatch({ type: "SET_USER", user: null });
          localStorage.clear();
          history.push('/login');
        }

        axios
            .get(`${API_HOST}/api/category`)
            .then(function (res) {
                setCategory(res?.data?.data);
            })
            .catch(function (error) {
            });

    }, [dispatch, history])

    const onFinish = (values) => {
        values.product.IdUserSeller = user?.userId;
        values.product.Description = convertedContent;
        values.product.DateEnd = values.product.DateEnd._d; 
        console.log(values.product);
        axios
            .post(`${API_HOST}/api/product/add`, values.product)
            .then(function (res) {
                if (res.data.productId) {
                    // history.push(`/product/upload-image?id=${res?.data?.productId}`);
                    setProductId(res?.data?.productId);
                    setShowUploadImageModal(true);
                } else {
                    history.push(`/`);
                }
            })
            .catch(function (error) {

            });
    };

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        convertContentToHTML();
      };

      const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        console.log(currentContentAsHTML);
        setConvertedContent(currentContentAsHTML);
      }

    return (
        <div className="add-product-container">
            {
                productId && (
                    <Modal
                        title="Thêm ảnh"
                        visible={showUploadImageModal}
                        onOk={() => {
                            setShowUploadImageModal(false)
                            window.location.reload();
                        }}
                        onCancel={() => {
                            setShowUploadImageModal(false)
                            window.location.reload();
                        }}
                    >
                        <AddProduct productId={productId}/>
                    </Modal>
                )
            }
            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <h2 className="header">Thêm sản phẩm mới</h2>
                <Form.Item
                    name={['product', 'Name']}
                    label="Tên sản phẩm"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name={['product', 'IdCategory']} label="Loại" rules={[{ required: true }]}>
                    <Select
                        placeholder="Chọn loại sản phẩm"
                        allowClear
                    >
                        {
                            category.map((item, index) => (
                                <Option key={index} value={item.id}>{item.Name}</Option>        
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name={['product', 'StartingPrice']}
                    label="Giá khởi điểm"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 1000000000,
                        },
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: 150 }}
                        defaultValue={1000}
                        formatter={value => `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\VND\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item
                    name={['product', 'StepPrice']}
                    label="Bước giá"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 1000000000,
                        },
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: 150 }}
                        defaultValue={1000}
                        formatter={value => `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\VND\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item name={['product', 'AllowUnrated']} label="Cho phép đánh giá" rules={[{ required: true }]}>
                    <Select
                        placeholder="Cho phép đánh giá"
                        allowClear
                    >
                        <Option value={1}>Có</Option>        
                        <Option value={0}>Không</Option>        
                    </Select>
                </Form.Item>
                <Form.Item name={['product', 'IsCheckReturn']} label="Loại" rules={[{ required: true }]}>
                    <Select
                        placeholder="Tự động gia hạn"
                        allowClear
                    >
                        <Option value={1}>Có</Option>        
                        <Option value={0}>Không</Option>        
                    </Select>
                </Form.Item>
                <Form.Item 
                    name={['product', 'DateEnd']} 
                    label="Ngày kết thúc"                     
                    rules={[
                        {
                            required: true,
                        },
                ]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Mô tả" rules={[{ required: true }]}>
                    <Editor
                        editorState={editorState}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        onEditorStateChange={onEditorStateChange}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>

    );
};

export default UploadProduct;