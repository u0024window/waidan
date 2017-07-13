/**
 * 债务人还款金额
 *
 */
import React from 'react';
import ListTable from '../debt/detail/list-table-component.jsx';
import Title from '../common/title.jsx';
var date = require('locutus/php/datetime/date');

var items = [
    {
        name: '调整时间',
        id: 'updateTime'
    },
    {
        name:'字段',
        id: 'remark'
    },
    {
        name:'操作',
        id: 'operateTypeName'
    },
    {
        name:'调整前',
        id: 'bDescription'
    },
    {
        name:'调整后',
        id: 'aDescription'
    },
    {
        name:'操作人',
        id: 'operatorName'
    }
];


class HistoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
    }
    filter (list) {
        var list = list || [];

        list.map(function (item) {
            item['updateTime'] = item['updateTime'] ? date('Y-m-d H:i:s', item['updateTime']/1000) : '';

            return item;
        })

        return list;
    }
    render() {
        var pager = {
            total: this.props.pager.total || 0,
            pageNo: +this.props.pager.pageNo || 1,
            pageSize: +this.props.pager.pageSize || 20
        }
        return (
            <div className="modify-history-wrap">
                <Title title="操作历史" />
                <ListTable items={items} data={this.filter(this.data.list||[])} pager={pager}/>
            </div>
        );
    }
}
module.exports = HistoryTable;
