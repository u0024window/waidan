/**
 * 案件信息
 *
 */
import React from 'react';
import ColTable from './col-table-component.jsx';
import Title from '../../common/title.jsx';
import {debtStatusMap} from '../../common/status2text.js';

var date = require('locutus/php/datetime/date');


var items = [
    {id: 'debtId', name: '借贷宝案件编号'},
    {id: 'debtContract', name: '借款合同编号'},
    {id: 'debtType', name: '案件类型'},
    {id: 'entrustEnterprise', name: '委托方名称'},
    {id: 'entrustDate', name: '委托期限'},
    {id: 'batchNo', name: '委托批次号'},
    {id: 'debtStatus', name:'当前状态'},
    {id: 'updateTime', name:'债务更新时间'},
    {id: 'overdueDays', name:'逾期天数'},
    {id: 'refundAccount', name:'还款账户'},
    {id: 'refundWay', name:'还款方式'}
];

class DebtInfo extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.filterData(this.props.data);
        this.operateList = [
            {
                name: '案件状态变更历史',
                type: 'link',
                target: '_blank',
                href: `/debt/modifyhistory/${this.props.debtId}`
            }
        ]
    }
    filterData(data) {
        var data = data || {};

        data['entrustDate'] = `${date('Y-m-d', data['entrustBeginDate']/1000)} 到 \
            ${date('Y-m-d', data['entrustEndDate']/1000)}`;
        data['updateTime']  = data['updateTime'] ? date('Y-m-d', data['updateTime']/1000) : '';
        data['debtStatus'] = debtStatusMap[data['debtStatus']];
        data['rewardRate'] = data['rewardRate'] === undefined ? '' : `${data['rewardRate']}%`;

        return data;
    }
    render() {
        return (
            <div className="debt-info-wrap">
                <Title title="案件信息" operateList={this.props.readOnly ? '' : this.operateList} />
                <ColTable key="debtInfo"items={items} data={this.data} columnNum="2"/>
            </div>
        );
    }
}
module.exports = DebtInfo;







