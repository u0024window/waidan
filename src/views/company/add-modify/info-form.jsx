import React from 'react';
import {Form, FormControl, Col, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import RewardRateToOverdue from '../../common/rewardRateToOverdue/index.jsx';
import Title from '../../common/title.jsx';


class InfoForm extends React.Component {
    constructor(props) {
        super(props);

        this.operateList = [
            {
                name: '操作记录',
                type: 'link',
                target: '_blank',
                href: `/common-history?businessId=${this.props.enterpiseUuid}&type=ENTERPRISE_LOG_TYPE`
            }
        ]


        this.state = {
        	enterpriseId: '',
        	enterpriseName: this.props.enterpriseName || '',
            briefName: this.props.briefName || '',
            enBrief: this.props.enBrief || '',
            contact: '',
            contactMobile: '',
            overdueRewardInfo: this.props.overdueRewardInfo || '',
            title: "新增公司"
        };

        if(this.props.enterpriseId) {
            this.state.title = "公司配置";
        	this.state.enterpriseId = this.props.enterpriseId;
            this.ajaxUrl = '/api/company/modify';
            this.nameHtml = (
                <FormControl
                    type="text"
                    value={this.state.enterpriseName}
                    readOnly
                    onChange={this.handleChange.bind(this)}/>
            );
            this.briefNameHtml = (
                <FormControl
                    type="text"
                    value={this.state.briefName}
                    readOnly
                    onChange={this.handleChange.bind(this)}/>
            );

            this.enBriefHtml = (
                <FormControl
                    type="text"
                    value={this.state.enBrief}
                    readOnly
                    onChange={this.handleChange.bind(this)}/>
            );
        } else {
            this.ajaxUrl = '/api/company/add';
        	this.nameHtml = (
        		<FormControl
                    type="text"
                    placeholder="公司名称"
                    name="enterpriseName"
                    onChange={this.handleChange.bind(this)}/>
        	);

        	this.briefNameHtml = (
        		<FormControl
                    type="text"
                    placeholder="公司简称"
                    name="briefName"
                    onChange={this.handleChange.bind(this)}/>
        	);
        	this.enBriefHtml = (
        		<FormControl
                    type="text"
                    placeholder="英文简称"
                    name="enBrief"
                    onChange={this.handleChange.bind(this)}/>
        	);
        }

    }

    submit(e) {
    	e.preventDefault();
        var rewardRateToOverdue = this.refs["rewardRateToOverdue"];

    	var data = this.state;

    	if(!data.enterpriseId && (!data.enterpriseName|| data.enterpriseName == '') ) {
    		alert('请填写公司名称！');
    		return;
    	}

    	if(!data.enterpriseId && (!data.briefName || data.briefName== '') ) {
    		alert('请填写公司简称！');
    		return;
    	}
    	if(!data.enterpriseId && (!data.enBrief || data.enBrief == '') ) {
    		alert('请填英文简称！');
    		return;
    	}

    	if(!data.contact || data.contact == '' || !data.contactMobile || data.contactMobile == '') {
    		alert('请填写联系人信息！');
    		return;
    	}
        var checkResult = rewardRateToOverdue.check();
        if (checkResult.error.returnCode !== 0) {
            alert(checkResult.data[0].msg || '请修改逾期天数与奖金比例!');
            return;
        }

        $.ajax({
            method: 'POST',
            url: this.ajaxUrl,
            data: {
                enterpriseId: $.trim(data.enterpriseId),
                enterpriseName: $.trim(data.enterpriseName),
                briefName: $.trim(data.briefName),
                enBrief: $.trim(data.enBrief),
                contact: $.trim(data.contact),
                contactMobile: $.trim(data.contactMobile),
                overdueRewardInfo: rewardRateToOverdue.getResult()
            }
        })
        .done(function (req) {
            if (req && req.error && 0 === +req.error.returnCode) {
                alert(req.error.returnUserMessage || '成功');
                window.location.href="/company"
            }
            else if (req && req.error && 0 !== +req.error.returnCode) {
                alert(req.error.returnUserMessage || '失败');
            }
            else {
                alert('服务异常，请稍后再试');
            }
        })
        .fail(function () {
                alert('服务异常，请稍后再试');
        })
        .always(function () {

        })
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    render() {
        return (
            <div>
                <Title title={this.state.title} operateList={this.props.enterpriseId ? this.operateList : undefined}></Title>
                <Form className="info-form" horizontal>
                    <Title title="基本信息"></Title>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            公司名称:
                        </Col>
                        <Col sm={10}>
                            {this.nameHtml}
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            公司简称:
                        </Col>
                        <Col sm={10}>
                            {this.briefNameHtml}
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            英文简称:
                        </Col>
                        <Col sm={10}>
                            {this.enBriefHtml}
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            联系人:
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                name="contact"
                                placeholder="联系人"
                                onChange={this.handleChange.bind(this)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            联系人电话:
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                name="contactMobile"
                                placeholder="联系人电话"
                                onChange={this.handleChange.bind(this)}
                            />
                        </Col>
                    </FormGroup>
                    <Title title="逾期天数与奖金比例"></Title>
                    <RewardRateToOverdue ref="rewardRateToOverdue" data={this.state.overdueRewardInfo}></RewardRateToOverdue>

                    <FormGroup className="mt20">
                        <Col sm={12}>
                            <Button bsStyle="primary" block onClick={this.submit.bind(this)}>提交</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}
module.exports = InfoForm;
