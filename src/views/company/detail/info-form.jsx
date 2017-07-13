import React from 'react';
import {Form, FormControl, Col, FormGroup, ControlLabel, Button} from 'react-bootstrap';

class InfoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	userId: '',
        	enterpriseId: '',
        	name: '',
            contact: '',
            contactMobile: ''
        };

        if(this.props.enterpriseId) {
        	this.state.enterpriseId = this.props.enterpriseId;
            this.ajaxUrl = '/api/company/modify';
            this.nameHtml = (
                <FormControl
                    type="text"
                    value={this.props.name}
                    readOnly
                    onChange={this.handleChange.bind(this)}/>
            );
        } else {
            this.ajaxUrl = '/api/company/add';
        	this.nameHtml = (
        		<FormControl
                    type="text"
                    placeholder="公司名称"
                    name="name"
                    onChange={this.handleChange.bind(this)}/>
        	);
        }
    }

    submit(e) {
    	e.preventDefault();

    	var data = this.state;

    	if(!this.state.enterpriseId && (!data.name || data.name == '') ) {
    		alert('请填写公司名称！');
    		return;
    	}

    	if(!data.contact || data.contact == '' || !data.contactMobile || data.contactMobile == '') {
    		alert('请填写联系人信息！');
    		return;
    	}

        $.ajax({
            method: 'POST',
            url: this.ajaxUrl,
            data: data
        })
        .done(function (req) {
            alert(req.data.returnUserMessage);
            window.history.go(-1);
        })
        .fail(function () {

        })
        .always(function () {

        })
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
        	<Form className="info-form" horizontal>
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
                <FormGroup className="mt20">
                    <Col sm={12}>
                        <Button bsStyle="primary" block onClick={this.submit.bind(this)}>提交</Button>
                    </Col>
                </FormGroup>
        	</Form>
        )
    }
}
module.exports = InfoForm;
