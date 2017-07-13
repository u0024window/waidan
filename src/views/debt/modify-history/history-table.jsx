/**
 * 债务人还款金额
 *
 */
import React from 'react';
import ListTable from '../../common/list-table/index.jsx';
import Title from '../../common/title.jsx';
import {debtStatusMap, settleStatusMap, operateTypeMap} from '../../common/status2text.js';
var date = require('locutus/php/datetime/date')

var items = [
    {
        name: '日期',
        id: 'operateTime',
        type: 'datetime'
    },
    {
        name:'案件状态（操作前）',
        id: 'preStatus',
        style: {
            width: '150px'
        }
    },
    {
        name:'操作',
        id: 'operateType'
    },
    {
        name:'操作原因',
        id: 'operateReason'
    },
    {
        name:'操作状态（操作后）',
        id: 'sufStatus',
        style: {
            width: '150px'
        }

    },
    {
        name:'结算状态',
        id: 'settleStatus'
    },
    {
        name:'操作员',
        id: 'operator'
    },
    {
        name:'备注',
        id: 'remark',
        style: {
            width: 'auto'
        }
    }
];

class HistoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.filter(this.props.data);
    }
    filter(data) {
        var data = data || [];
        data.map(function(item) {
            item['preStatus'] = debtStatusMap[item['preStatus']];
            item['sufStatus'] = debtStatusMap[item['sufStatus']];
            item['settleStatus'] = settleStatusMap[item['settleStatus']];
            item['operateType'] = operateTypeMap[item['operateType']];

            return item;
        });

        return data;
    }
    render() {
        return (
            <div className="modify-history-wrap">
                <Title title="案件状态变更历史" />
                <ListTable items={items} data={this.data} />
            </div>
        );
    }
}
module.exports = HistoryTable;
