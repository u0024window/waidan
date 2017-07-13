import React from 'react';
import {Form, FormControl, Col, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import RewardRateToOverdue from '../../common/rewardRateToOverdue/index.jsx';
import Title from "../../common/title.jsx";

class uploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        var enterpriseList = this.props.enterpriseList,
            tmp;

        this.operateList = [
            {
                name: '历史记录',
                type: 'link',
                href: '/debt/history-upload'
            }
        ]


        this.htmlList = [];

        this.htmlList.push(<option value=''>请选择</option>);
        for(var i in enterpriseList) {
            tmp = enterpriseList[i];
            this.htmlList.push(<option value={`${tmp.enterpriseId},${tmp.enterpiseUuid}`}>{tmp.enterpriseName}</option>);
        }
    }
    render() {
        return (
            <div>
                <Title title="上传案件" operateList={this.operateList} ></Title>
                <Form className="info-form" horizontal id="uploadForm">
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            上传类型:
                        </Col>
                        <Col sm={3}>
                            <FormControl className="js-uploadType" componentClass="select" placeholder="select" name="uploadType">
                                <option value="1">案件导入</option>
                                <option value="2">案件更新</option>
                                <option value="3">催客佣金</option>

                            </FormControl>
                        </Col>
                        <Col sm={7}>
                            <a href="/download/template/debtImport.xls" className="btn btn-link">案件导入模板</a>
                            <a href="/download/template/debtUpdate.xls" className="btn btn-link">案件更新模板</a>
                            <a href="/download/template/collectorCommission.xls" className="btn btn-link">催客佣金模板</a>
                        </Col> 

                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            委托公司:
                        </Col>
                        <Col sm={10}>
                            <FormControl className="js-enterpriseId" componentClass="select" placeholder="select">
                                {this.htmlList}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup className="js-date-wrap">
                        <Col componentClass={ControlLabel} sm={2}>
                            委托时限:
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                className="js-entrustBeginDate"
                                type="text"
                                style={{display: 'inline-block', width: '210px', marginRight: '30px'}}
                                placeholder=""
                            />
                            到
                            <FormControl
                                type="text"
                                style={{display: 'inline-block', width: '210px', marginLeft: '30px'}}
                                className="js-entrustEndDate"
                                placeholder=""
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            案件表单:
                        </Col>
                        <Col sm={10}>
                            <FormControl type="file" label="File" id="fileUpload" name="uploadFile"/>
                        </Col>
                    </FormGroup>
                    <div id="js-rewardRateToOverdue"></div>
                    <FormGroup className="mt20">
                        <Col sm={12}>
                            <Button bsStyle="primary" className="js-submit" block>提交</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
};
module.exports = uploadForm;
