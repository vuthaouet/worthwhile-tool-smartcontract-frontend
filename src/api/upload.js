import React, {useState} from 'react';
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import '../index.css';
import { Pie, measureTextWidth } from '@antv/g2plot';
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

import {InboxOutlined} from '@ant-design/icons';
import {Option} from "antd/es/mentions";
import axios from "axios";
import {combine_results_api, uploadfile, wortwhile} from "./wortwhile";

const backend_folder = "/home/vuthaouet/blockchain/worthwhile-tool-smartcontract-backend/data/"
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
function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2;
    // r^2 = (w / 2)^2 + (h - offsetY)^2
    let scale = 1;
    if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }
    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
}

async function submitForm(values) {

    let data_static = {}
    data_static["sourceLanguage"] = ""
    data_static["list_contract"] = []
    data_static["count_risk_of_false_positives"] = 0
    data_static["count_leve_vulnerabilities"]= {}
    data_static["count_vulnerabilities"] = {}
    const formData = new FormData();
    formData.append("type", values['type']);
    formData.append("project_name", values["project_name"]);
    formData.append("list_tool", values["list_tool"]);
    const data = {
        type: values['type'],
        project_name: values["project_name"]
    }
    if (values['type'] === 'file')
        values["file"].map((file) => {
            formData.append("file", file.originFileObj);
            // data.file ("file", file.originFileObj);
        });
    else
        formData.append("url", values["linkRepo"]);
    console.log("formData.values()")
    console.log(...formData)
    let check = uploadfile(formData)
    let res = await axios.post(`${baseUrl}${'/wortwhile/uploadfile'}`, formData)
        .then((res) => {
            return {
                success: true,
                data: res.data,
            }
        })
        .catch((err) => alert("File Upload Error"));
    if (res) {
        console.log(res)
        let check = await wortwhile(res.data)
        if (check){
            let data_static = await combine_results_api(values["project_name"])
            return data_static.data
        }

    }

    return data_static
}
function renderChart(idElement,data,color_data){
    const piePlot = new Pie(idElement, {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.64,
        meta: {
            value: {
                formatter: (v) => `${v}`,
            },
        },
        label: {
            type: 'inner',
            offset: '-50%',
            style: {
                textAlign: 'center',
            },
            autoRotate: false,
            content: '{value}',
        },
        statistic: {
            title: {
                offsetY: -4,
                customHtml: (container, view, datum) => {
                    const { width, height } = container.getBoundingClientRect();
                    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                    const text = datum ? datum.type : 'Total';
                    return renderStatistic(d, text, { fontSize: 28 });
                },
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '32px',
                },
                customHtml: (container, view, datum, data) => {
                    const { width } = container.getBoundingClientRect();

                    const text = datum ? ` ${datum.value}` : ` ${data.reduce((r, d) => r + d.value, 0)}`;
                    return renderStatistic(width, text, { fontSize: 32 });
                },
            },
        },
        theme: {
            colors10: color_data
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }],
    });

    piePlot.render();
}
function remove_element_by_id(id) {
    const myNode = document.getElementById(id);
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
    }
}
async function results(values) {
    await remove_element_by_id('results')
    await remove_element_by_id('results-leve')
    await remove_element_by_id('results-vulnerabilities')
    await remove_element_by_id('results-rick')
    console.log("results")
    console.log(values)
    console.log(values["list_contract"])
    console.log(values["count_vulnerabilities"])
    // let vulnerabilities = JSON.stringify(values["count_vulnerabilities"])
    // let leve_vulnerabilities = JSON.stringify(values["count_leve_vulnerabilities"])
    const element = (
        <div>
            <h1>Synthesis Results</h1>
            <div id={"text1_results"}>
                <h2>Project name: {values["project_name"]}.</h2>
                <h2>Date: {new Date().toLocaleString()}:</h2>
                <a href={`${baseUrl}${"/dowloadFile?project_name="}${values["project_name"]}`} download>Click to
                    download synthesis results</a>
                {/*<h2>Number rick of false positives: {values["count_risk_of_false_positives"]}.</h2>*/}
                {/*<h2>List vulnerabilities: {vulnerabilities}.</h2>*/}
                {/*<h2>List leve vulnerabilities: {leve_vulnerabilities}.</h2>*/}
            </div>
            <div id={"text2_results"}>
                <h2>List smart contract: </h2>
                <ul id={"list_smart_contract"}/>
                <h2>Source Language: {values["sourceLanguage"]}.</h2>
            </div>
            <div className="clear"/>
        </div>
    );
    let i;

    const data = [
        {type: 'error', value: values["count_leve_vulnerabilities"]["error"]},
        {type: 'none', value: values["count_leve_vulnerabilities"]["none"]},
        {type: 'note', value: values["count_leve_vulnerabilities"]["note"]},
        {type: 'warning', value: values["count_leve_vulnerabilities"]["warning"]},
    ];

    let data_vaul = []
    let count = 0
    for (i = 0; i < values["list_vulnerabilities"].length; i++) {
        let vaul = values["list_vulnerabilities"][i]
        let vaul_type;
        switch (vaul) {
            case "ReentrancyVulnerability":
                vaul_type = "Reentrancy";
                break;
            case "ArithmeticVulnerability":
                vaul_type = "Arithmetic";
                break;
            case "AccessControlVulnerability":
                vaul_type = "Access control";
                break;
            case "UncheckedLowCallsVulnerability":
                vaul_type = "Unchecked";
                break;
            case "DenialServiceVulnerability":
                vaul_type = "Denial Service";
                break;
            case "TimeManipulationVulnerability":
                vaul_type = "Time Manipulation";
                break;
            case "IgnoreVulnerability":
                vaul_type = "Ignore";
                break;
            case "OtherVulnerability":
                vaul_type = "Other";
                break;
            case "FrontRunningVulnerability":
                vaul_type = "Front Running";
                break;
        }
        count = count + values["count_vulnerabilities"][vaul]
        data_vaul.push({type: vaul_type, value: values["count_vulnerabilities"][vaul]})
    }

    const data_rick = [
        {type: 'RiskOfFalsePositives', value: values["count_risk_of_false_positives"]},
        {type: 'Vulnerabilities', value: count - values["count_risk_of_false_positives"]},
    ];
    // let color_data;
    let color_data_leve = [
        '#FF6B3B',
        '#082f81',
        '#6494f9',
        '#FFC100'
    ]
    let color_data_vul = ['#025DF4', '#DB6BCF', '#2498D1', '#BBBDE6', '#4045B2', '#21A97A', '#FF745A', '#007E99', '#FFA8A8', '#2391FF']


    await ReactDOM.render(element, document.getElementById('results'));
    renderChart('results-leve', data, color_data_leve)
    renderChart('results-vulnerabilities', data_vaul, color_data_vul)
    renderChart('results-rick', data_rick, color_data_vul)
    for (i = 0; i < values["list_contract"].length; i++) {
        var node = document.createElement("LI");   // Create a <li> node
        var textnode = document.createTextNode(values["list_contract"][i]);         // Create a text node
        node.appendChild(textnode);     // Append the text to <li>
        document.getElementById("list_smart_contract").appendChild(node);
    }
}

class MyUpload extends React.Component {
    state = {
        loadings: [],
    };

    handleUpload = ({fileList}) => {
        console.log("vào handleUpload")
        //---------------^^^^^----------------
        // this is equivalent to your "const img = event.target.files[0]"
        // here, antd is giving you an array of files, just like event.target.files
        // but the structure is a bit different that the original file
        // the original file is located at the `originFileObj` key of each of this files
        // so `event.target.files[0]` is actually fileList[0].originFileObj
        console.log('fileList', fileList);

        // you store them in state, so that you can make a http req with them later
        this.setState({fileList});
    };
    onFinish = async (values) => {
        console.log("onFinish")
        console.log(values)
        console.log("vào onFinish")
        // this.handleSubmit
        let data_static = await submitForm(values)
        this.setState(({loadings}) => {
            const newLoadings = [...loadings];
            newLoadings[2] = false;

            return {
                loadings: newLoadings,
            };
        });
        // let data_static =[]
        results(data_static)
    };
    enterLoading = index => {
        this.setState(({loadings}) => {
            const newLoadings = [...loadings];
            newLoadings[index] = true;

            return {
                loadings: newLoadings,
            };
        });
        // setTimeout(() => {
        //     this.setState(({ loadings }) => {
        //         const newLoadings = [...loadings];
        //         newLoadings[index] = false;
        //
        //         return {
        //             loadings: newLoadings,
        //         };
        //     });
        // }, 12000);
    };

    render() {
        const {loadings} = this.state;
        return (
            <div>
                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={this.onFinish}
                    enctype="multipart/form-data"
                    // onSubmit={this.handleSubmit}

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
                        <Input placeholder="Please input your project name"/>
                    </Form.Item>
                    <Form.Item name="list_tool" label="Tool"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please choose tool',
                                   },
                               ]}>
                        <Checkbox.Group>
                            <Row>
                                {/*<Col span={12}>*/}
                                <Col>
                                    <Checkbox
                                        value="mythril"
                                        style={{
                                            lineHeight: '32px',
                                        }}
                                    >
                                        Mythril
                                    </Checkbox>
                                </Col>
                                {/*<Col span={12}>*/}
                                <Col>
                                    <Checkbox
                                        value="slither"
                                        style={{
                                            lineHeight: '32px',
                                        }}
                                    >
                                        Slither
                                    </Checkbox>
                                </Col>
                                {/*<Col span={12}>*/}
                                <Col>
                                    <Checkbox
                                        value="oyente"
                                        style={{
                                            lineHeight: '32px',
                                        }}
                                    >
                                        Oyente
                                    </Checkbox>
                                </Col>
                                {/*<Col span={12}>*/}
                                <Col>
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
                        <Input placeholder="Please input link repo"/>
                    </Form.Item>
                    <Form.Item label="file">
                        <Form.Item name="file" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload.Dragger name="files" beforeUpload={() => false} fileList={normFile}
                                            onChange={this.handleUpload}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined/>
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 24,
                            offset: 2,
                        }}
                    >
                        <Button type="primary" htmlType="submit" loading={loadings[2]}
                                onClick={() => this.enterLoading(2)}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <div id={"results"}/>
                <div id={"result_charts"} style={{display: '-webkit-box'}}>
                    <div id={"results-leve"} style={{
                        width: '30%',}}
                    />
                    <div id={"results-vulnerabilities"}
                         style={{width: '35%'}}
                    />
                    <div id={"results-rick"}
                         style={{width: '35%'}}
                    />
                    <div id={"results-text"}
                    />
                </div>
            </div>
        );
    }
};

export default MyUpload