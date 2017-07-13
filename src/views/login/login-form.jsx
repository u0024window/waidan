import React from 'react';
import  {FormGroup, Form, Col, FormControl, Checkbox, Button, ControlLabel} from 'react-bootstrap';
import URI from 'urijs';

;

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    login(e) {
        e.preventDefault();

        if ('' === $.trim(this.state.username)) {
            alert("账号不能为空！");

            return;
        }
        if ('' === $.trim(this.state.password)) {
            alert("密码不能为空！");

            return;
        }

        $.ajax({
            method: "POST",
            url: "/api/login",
            data: {
                username: $.trim(this.state.username),
                password: $.trim(this.state.password)
            }
        })
        .done(function (result) {
            if(!(result && result.error && 0 === +result.error.returnCode)) {
                console.log(result && result.error && result.error.returnMessage);
                alert(result && result.error && result.error.returnUserMessage)

                return;
            }

            var redirectUrl = URI.parseQuery(new URI(window.location.href).query())['redirect']
            if(redirectUrl) {
                window.location.href=redirectUrl;
            }
            else {
                window.location.href="/debt/list";
            }
        })
        .fail(function () {
            alert("服务异常!");
        })
        .always(function () {

        })
    }
    render() {
        return (
            <div className="form-wrap">
                <h1>登录</h1>
                <Form horizontal>
                    <FormGroup controlId="formHorizontalEmail">
                        <Col sm={12}>
                            <FormControl
                                type="text"
                                placeholder="账号"
                                value={this.state.username}
                                name="username"
                                onChange={this.handleChange.bind(this)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalPassword">
                        <Col sm={12}>
                            <FormControl
                                type="password"
                                placeholder="登录密码"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange.bind(this)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup className="mt20">
                        <Col sm={12}>
                            <Button type="submit" bsStyle="primary" block onClick={this.login.bind(this)}>登录</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}
module.exports = LoginForm;

