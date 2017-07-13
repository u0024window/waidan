/**
 * 历史记录-案件上传历史
 *
 */
require('bootstrap');
require('../../common/common.less');
import React from 'react';
import ListTable from '../../common/list-table/index.jsx';
import Nav from '../../common/nav.jsx';
import Tabs from '../../common/tabs/index.jsx';

const navList = [
    {
        path: '/debt/upload',
        name: '上传案件'
    },
    {
        path: '/debt/history-upload',
        name: '历史记录'
    }
]

const items = [
    {
        name:'文件名',
        id: 'fileName',
    },
    {
        name:'上传时间',
        id: 'uploadTime',
        type: 'datetime'
    },
    {
        name:'操作',
        id: 'operat'
    }
];

const tabsListData = [
    {
        name:'案件上传历史',
        url: '/debt/history-upload'
    },
    {
        name:'案件更新历史',
        url: '/debt/history-update'
    },
    {
        name:'催客佣金',
        url: '/debt/history-commission'
    }
];


class History extends React.Component {
    constructor(props) {
        super(props);
    }
    filter(listData) {
        listData = listData || [];
        listData.map(function (item) {
            item.operat = <a href={`/debt/download/${item.uploadId}`}>下载</a>;
            return item;
        });

        return listData;
    }
    render() {
        return (
            <div className="history-wrap">
                <Nav navList={navList} />
                <Tabs listData={tabsListData} active={2}/>
                <div style={{paddingTop: '20px'}}>
                    <ListTable data={this.filter(this.props.listData)} items={items}/>
                </div>
            </div>
        );
    }
}
module.exports = History;
