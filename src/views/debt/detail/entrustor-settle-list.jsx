/**
 * 债务人还款金额
 *
 */
import React from 'react';
import ListTable from '../../common/list-table/index.jsx';
import Title from '../../common/title.jsx';

var items = [
    {
        name: '回款日期',
        id: 'settleDate',
        type: 'date'
    },
    {
        name:'回款金额',
        id: 'settleAmount',
        style: {
            width: '110px'
        },
        type: 'money'
    },
    {
        name:'实收佣金（税后）',
        id: 'commissionAmount',
        style: {
            width: '110px'
        },
        type: "money"
    },
    {
        name:'佣金支付状态',
        id: 'settleStatusTxt'
    },
    {
        name:'操作人',
        id: 'operator'
    },
    {
        name:'操作时间',
        id: 'operateTime',
        type: 'datetime'
    },
    {
        name:'操作类型',
        id: 'operateType'
    }
];

var commissionStatusMap = {
    0: '未结算',
    1: '已结算',
    2: '已失效'
}

var operateTypeMap = {
    0: '手工操作'
}

class DebtorRefundList extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.filter(this.props.data);
    }
    filter(data) {
        var data = data || {};
        var list = data.list || [];
        var total = data.total;

        list.map(function(item){
            item['operateType'] = operateTypeMap[item['operateType']];
            item['settleStatusTxt'] = commissionStatusMap[item['settleStatus']];

            return item;
        })

        if (total) {
            list.push({
                settleDate: '合计',
                commissionAmount: total['commissionAmount'],
                settleAmount: total['settleAmount']
            });
        }

        return list;
    }

    render() {
        return (
            <div className="debt-info-wrap">
                <Title title="委托方结款金额" />
                <ListTable items={items} data={this.data} />
            </div>
        );
    }
}
module.exports = DebtorRefundList;








