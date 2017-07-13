/**
 * 债务人还款金额
 *
 */
import React from 'react';
import ListTable from '../../common/list-table/index.jsx';
import Title from '../../common/title.jsx';


var items = [
    {
        name: '时间',
        id: 'createTime',
        type: 'datetime'
    },
    {
        name:'催收记录',
        id: 'collResultStandard'
    },
    {
        name:'备注',
        id: 'remark'
    },
    {
        name:'家庭情况及财产调查',
        id: 'familyProperty'
    },
    {
        name:'承诺金额',
        id: 'repayAmount',
        type: 'money'
    },
    {
        name:'承诺时间',
        id: 'repayTime',
        type: 'datetime'
    },
    {
        name:'催收员',
        id: 'collector'
    }
];

class CollRecordList extends React.Component {
    constructor(props) {
        super(props);
        this.list = this.props.data.list || [];
        this.ajax = {
            url: '/api/debt/getCollRecodByPage',
            params: {
                caseId: this.props.data.debtId
            }
        }
        this.pager = {
            pageNo: 1,
            pageSize: 20,
            total: this.props.data.total
        }
    }
    render() {
        return (
            <div className="debt-info-wrap">
                <Title title="催收记录" />
                <ListTable items={items} ajax={this.ajax} data={this.list} pager={this.pager} />
            </div>
        );
    }
}
module.exports = CollRecordList;








