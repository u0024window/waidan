require('bootstrap');
require('../../common/common.less');
require('./list-table-component.less');
require('react-datetime/css/react-datetime.css');
require('./index.less');

import React from 'react';
import {render} from 'react-dom';
import Pager from './pager.jsx';
import List from './listTable.jsx';
import Operation from './operation.jsx';
import Query from './query.jsx';

render(
    <Query {...window.initData.query} />,
    document.getElementById('queryOutput')
);

render(
    <Pager {...window.initData.pager}/>,
    document.getElementById('pagerOutput')
);
render(
    <List data={window.initData.list}/>,
    document.getElementById('listOutput')
);
render(
    <Operation data={window.initData.email}/>,
    document.getElementById('operationOutput')
);

