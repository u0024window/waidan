import css from './conf-form.less';
import React from 'react';
import Title from '../../common/title.jsx';
import _ from 'lodash';
import toFixed  from '../../lib/toFixed.js';

class ConfForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            governmentTax: this.props.data.governmentTax,
            platformTax: this.props.data.platformTax
        };
        this.operateList = [
            {
                name: '操作记录',
                type: 'link',
                target: '_blank',
                href: `/common-history?type=TAX_LOG_TYPE`
            }
        ]

    }
    handleChange(e) {
        var val = toFixed(e.target.value);
        this.setState({[e.target.name]: val});
    }
    validate() {
        if (Number(this.state.governmentTax) + Number(this.state.platformTax) > 100) {
            alert('数值相加不能超过100%');
            return false;
        }

        return true;
    }
    save(e) {
        e.preventDefault();
        if(!this.validate()) {
            return;
        }
        $.ajax({
            method: "POST",
            url: "/api/platform/bonusTax/modify",
            data: {
                governmentTax: this.state.governmentTax,
                platformTax: this.state.platformTax
            }
        })
        .done(function (result) {
            if (0 !== +_.get(result, 'error.returnCode')) {
                alert(_.get(result, 'error.returnUserMessage') || "服务异常");
                return;
            }
            alert("操作成功！");
        })
        .fail(function () {
            alert("服务异常!");
        })
        .always(function () {

        })
    }
    render() {
        return (
            <div className="conf-form">
                <Title title="费率设置" operateList={this.operateList} ></Title>
                <form className="form">
                    <div className="row">
                        <label className="title">扣税比率：</label>
                        <input
                            className="val form-control"
                            value={this.state.governmentTax}
                            name="governmentTax"
                            onChange={this.handleChange.bind(this)}
                        /> %
                    </div>
                    <div className="row" style={{marginTop: '20px'}}>
                        <label className="title">奖金留存比率：</label>
                        <input
                            value={this.state.platformTax}
                            name="platformTax"
                            onChange={this.handleChange.bind(this)}
                            className="val form-control" /> %
                    </div>
                    <div className="row" style={{marginTop: '40px', paddingLeft: '135px'}}>
                        <button
                            type="submit"
                            onClick={this.save.bind(this)}
                            className="btn btn-primary">保存修改</button>
                    </div>
                </form>
            </div>
        )
    }
}
module.exports = ConfForm;
