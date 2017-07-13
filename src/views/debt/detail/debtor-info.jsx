/**
 * 案件信息
 *
 */
import React from 'react';
import ColTable from './col-table-component.jsx';
import ListTable from './list-table-component.jsx';
import Title from '../../common/title.jsx';
import DebtorInfoRelation from './debtor-info-relation.jsx';
import DebtorInfoAddress from './debtor-info-address.jsx';
import {relationMap} from '../../common/status2text.js';
import CSS from './debtor-info.less';
import _ from 'lodash';

var baseItems = [
    {id: 'debtorName', name: '债务人'},
    {id: 'debtorPhone', name: '手机号'},
    {id: 'debtorSn', name: '身份证号'},
    {id: 'debtorAccount', name: '银行卡号'}
];

class DebtorInfo extends React.Component {
    constructor(props) {
        super(props);
        this.baseData = this.props.data || {};
        this.debtId = this.props.debtId,
        this.addressData = this.props.data || {};
        this.state = {
            isEditing: false
        }
    }
    btnEditHandler() {
        this.state.isEditing = !this.state.isEditing
        this.refs['relation'].setState({
            isEditing: this.state.isEditing
        })
        this.refs['address'].setState({
            isEditing: this.state.isEditing
        })
        this.setState({
            isEditing: this.state.isEditing,
            other: this.getOther()
        })
    }
    cancelHandler() {
        window.location.reload();
    }
    componentDidMount() {
        this.setState({
            other: this.getOther()
        })
    }
    getOther () {
        return (
            <span className="pull-right">
                {!this.state.isEditing &&
                    <button type="button" onClick={this.btnEditHandler.bind(this)} className="btn btn-primary">编辑</button>
                }
                {this.state.isEditing &&
                    <span>
                        <button type="button" style={{marginRight: "10px"}} onClick={this.btnSaveHandler.bind(this)} className="btn btn-primary">保存</button>
                        <button type="button" onClick={this.cancelHandler} className="btn btn-primary">取消</button>
                    </span>
                }
            </span>
        )
    }
    btnSaveHandler() {
        var params = {};
        params.debtId = this.debtId;
        params.contactList = this.refs['relation'].getResult()
        Object.assign(params, this.refs['address'].getResult())

        console.log(params);
        $.ajax({
            url: '/api/debt/saveDetail',
            type: 'POST',
            data: params,
            success: function(res) {
                if (0 !== +_.get(res, 'error.returnCode')) {
                    alert(_.get(res, 'error.returnUserMessage'))
                    return;
                }
                alert('保存成功');
                window.location.reload();
            },
            error: function() {
                alert('服务异常');
            }
        })

    }
    render() {
        return (
            <div className="debt-info-wrap">
                <Title title="债务人信息" other={this.props.readOnly ? "" : this.state.other || ""}/>
                <ColTable items={baseItems} data={this.baseData} columnNum="2"/>
                <DebtorInfoAddress
                    data={this.addressData}
                    isEditing={this.state.isEditing}
                    province={this.props.province}
                    regions={this.props.regions}
                    ref="address"
                />
                <DebtorInfoRelation
                    ref="relation"
                    isEditing={this.state.isEditing}
                    contactList={this.props.data.contactList}
                />
            </div>
        );
    }
}
module.exports = DebtorInfo;
