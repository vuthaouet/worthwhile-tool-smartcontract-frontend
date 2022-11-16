import React, {useState} from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import {
    Form,
    Select,
    InputNumber,
    Switch,
    Radio,
    Slider,
    Button,
    Upload,
    Rate,
    Checkbox,
    Row,
    Col, Input,
} from 'antd';

import {  InboxOutlined } from '@ant-design/icons';
import {Option} from "antd/es/mentions";
import axios from "axios";
import {combine_results_api, uploadfile, wortwhile} from "./wortwhile";

const baseUrl = "http://localhost:5000";
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
        return e;
    }

    return e && e.fileList;
};

const Demo = () => {
    const onFinish = (values) => {
        submitForm(values)
    };
    const submitForm = async (values) => {
        const formData = new FormData();
        formData.append("type", values['type']);
        formData.append("project_name", values["project_name"]);
        formData.append("list_tool", values["list_tool"]);
        const data = {
            type: values['type'],
            project_name: values["project_name"]
        }
        values["file"].map((file) => {
            formData.append("file", file.originFileObj);
            // data.file ("file", file.originFileObj);
        });
        console.log("formData.values()")
        console.log(...formData)
        // let check = uploadfile(formData.)
        let res = await axios.post(`${baseUrl}${'/wortwhile/uploadfile'}`, formData)
            .then((res) => {
                return {
                    success: true,
                    data: res.data,
                }
            })
            .catch((err) => alert("File Upload Error"));
        if (res ){
            console.log(res)
            let check = await wortwhile(res.data)
            await combine_results_api(values["project_name"])
        }
    };

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            enctype="multipart/form-data"
        >
            <Form.Item
                {...formItemLayout}
                name="project_name"
                label="Your project name"
                rules={[
                    {
                        required: true,
                        message: 'Please input your project name',
                    },
                ]}
            >
                <Input placeholder="Please input your project name" />
            </Form.Item>
            <Form.Item name="list_tool" label="Tool"
                       rules={[
                           {
                               required: true,
                               message: 'Please chooose tool',
                           },
                       ]}>
                <Checkbox.Group>
                    <Row>
                        <Col span={4}>
                            <Checkbox
                                value="mythril"
                                style={{
                                    lineHeight: '32px',
                                }}
                            >
                                Mythril
                            </Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                value="slither"
                                style={{
                                    lineHeight: '32px',
                                }}
                            >
                                Slither
                            </Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                value="oyente"
                                style={{
                                    lineHeight: '32px',
                                }}
                            >
                                Oyente
                            </Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                value="honeybadger"
                                style={{
                                    lineHeight: '32px',
                                }}
                            >
                                Honeybadger
                            </Checkbox>
                        </Col>

                    </Row>
                </Checkbox.Group>
            </Form.Item>
            <Form.Item
                name="type"
                label="type"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please input your type',
                    },
                ]}
            >
                <Select placeholder="Please input your type">
                    <Option value="file">File</Option>
                    <Option value="repo">Repo</Option>
                </Select>
            </Form.Item>
            <Form.Item
                {...formItemLayout}
                name="linkRepo"
                label="Link Repo"
            >
                <Input placeholder="Please input link repo" />
            </Form.Item>
            <Form.Item label="file">
                <Form.Item name="file" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                    <Upload.Dragger name="files" beforeUpload={() => false} fileList={normFile}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    span: 12,
                    offset: 6,
                }}
            >
                <Button type="primary" htmlType="submit" >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Demo