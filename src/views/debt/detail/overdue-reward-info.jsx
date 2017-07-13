/**
 * 案件信息
 *
 */
import React from 'react';
import ListTable from './list-table-component.jsx';
import Title from '../../common/title.jsx';


var items = [
    {id: 'level', name: '阶段', style: {width: '30px'}},
    {id: 'overdue', name: '逾期天数'},
    {id: 'rewardRate', name: '奖金比例'},
    {id: 'commissionRate', name: '佣金比例'}
];

class OverdueRewardInfo extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.filterData(JSON.parse(this.props.data));
    }
    filterData(list) {
        var list = list|| [];
        var level = 1;
        list.map(function (item) {
            item['commissionRate'] = `${item['commissionRate']}%`;
            item['rewardRate'] = `${item['rewardRate']}%`;
            item['overdue'] = `${item['start']}天 —— ${item['end']}天`;
            item['level'] = level++;

            return item;
        })

        return list;
    }
    render() {
        return (
            <div className="debt-info-wrap" style={{width: '50%'}}>
                <Title title="逾期天数与奖金比例" />
                <ListTable items={items} data={this.data}/>
            </div>
        );
    }
}
module.exports = OverdueRewardInfo;







