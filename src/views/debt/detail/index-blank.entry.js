require('bootstrap');
require('./list-table-component.less');
require('../../common/common.less');
require('react-datetime/css/react-datetime.css');
require('./index.less');

import React from 'react';
import {render} from 'react-dom';
import Detail from './detail.entry.jsx';

render(
    <Detail data={window.initData.detailData} />,
    document.getElementById('content')
);
