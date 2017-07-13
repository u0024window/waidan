import React from 'react';
import List from './list-table-component.jsx';
import Operate from './operate.jsx';

var date = require('locutus/php/datetime/date');
var moneyFormat = require('locutus/php/strings/money_format');

var items = [
    {
        name:'案件编号',
        id: 'debtContract',
        style: {
            width: '250px'
        }
    },
    {
        name:'案件状态',
        id: 'debtStatusTxt'
    },
    {
        name:'结算状态',
        id: 'debtSettleStatus'
    },
    {
        name:'债务人',
        id: 'debtName',
        style: {
            width: '200px'
        }
    },
    {
        name:'债务人手机号',
        id: 'debtMobile',
    },
    {
        name:'身份证号',
        id: 'debtIdentityId',
        style: {
            width: 'auto'
        }
    },
    {
        name:'债务总金额',
        id: 'debtAmount',
        style: {
            width: '200px'
        }
    },
    {
        name:'逾期天数',
        id: 'overdueDays'
    },
    {
        name:'佣金比例',
        id: 'rewardRate'
    },
    {
        name:'逾期金额',
        id: 'overdueAmount',
        style: {
            width: '200px'
        }
    },
    {
        name:'实还金额',
        id: 'refundAmount',
        style: {
            width: '200px'
        }
    },
    {
        name:'已结佣金',
        id: 'repayCommission',
        style: {
            width: '200px'
        }
    },
    {
        name:'未结佣金',
        id: 'unpayCommission',
        style: {
            width: '200px'
        }
    },
    {
        name:'已付催客佣金',
        id: 'collectorCommission',
        style: {
            width: '200px'
        }
    },
    {
        name:'委托方',
        id: 'entrustEnterprise',
        style: {
            width: '400px'
        }
    },
    {
        name:'委托批次号',
        id: 'batchNo',
        style: {
            width: '400px'
        }
    },
    {
        name:'债务金额更新时间',
        id: 'debtAmountUpdateTime',
        style: {
            width: '130px'
        }
    },
    {
        name:'操作',
        id: 'operate',
        style: {
            width: '190px'
        }
    }
];


const debtStatusMap = {
    0: '初始状态',
    1: '已分案',
    2: '催收中',
    3: '待清算',
    4: '待分案',
    5: '已完成',
    6: '暂停催收'
}

const debtSettleStatusMap = {
    0: '无需结算',
    1: '待清算',
    2: '待结算',
    3: '部分结算',
    4: '结算完成'
}

var itemsMask = [
    {
        name:'案件编号',
        id: 'debtContract',
        style: {
            width: 'auto',
            visibility: 'hidden'
        }
    },
    {
        name:'委托方',
        id: 'entrustEnterprise',
        style: {
            width: '400px',
            visibility: 'hidden'
        }
    },
    {
        name:'操作',
        id: 'operate',
        style: {
            width: '190px'
        }
    }
];
class ListTable extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.filter(this.props.data);
    }
    filter(data) {
        var data = data || [];
        var setlocale = require('locutus/php/strings/setlocale')
        setlocale('LC_MONETARY', 'en_US')

        data.map(function(item){
            item['debtStatusTxt'] = debtStatusMap[item['debtStatus']];
            item['debtSettleStatus'] = debtSettleStatusMap[item['debtSettleStatus']];
            item['debtAmount'] = moneyFormat('%i', item['debtAmount']/100).replace(/USD/g, '¥');

            item['overdueAmount'] = moneyFormat('%i', item['overdueAmount']/100).replace(/USD/g, '¥');
            item['refundAmount'] = moneyFormat('%i', item['refundAmount']/100).replace(/USD/g, '¥');
            item['repayCommission'] = moneyFormat('%i', item['repayCommission']/100).replace(/USD/g, '¥');
            item['unpayCommission'] = moneyFormat('%i', item['unpayCommission']/100).replace(/USD/g, '¥');
            item['collectorCommission'] = moneyFormat('%i', item['collectorCommission']/100).replace(/USD/g, '¥');
            item['debtAmountUpdateTime'] = item['debtAmountUpdateTime'] ? date('Y-m-d', item['debtAmountUpdateTime']/1000) : '';
            item['operate'] = <Operate importStatus={item['importStatus']} debtId={item['debtId']} status={item['debtStatus']}/>;

            return item;
        })

        return data;
    }
    render() {
        return (
            <div className="list-wrap">
                <List items={items} data={this.data} tableWidth= '3600px' tableClass="scroll-table" />
                <List items={itemsMask} data={this.data} tableWidth= '100%' isMask={true} tableClass="mask-table"/>
            </div>
        );
    }
}

module.exports = ListTable;


