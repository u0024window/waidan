require('bootstrap');
require('../common/common.less');
require('../debt/detail/list-table-component.less');

import React from 'react';
import {render} from 'react-dom';
import ListTable from './history-table.jsx';

var initData = window.initData;
render(
    <ListTable data={initData.data} pager={initData.pager}/>,
    document.getElementById('js-list-table')
);



