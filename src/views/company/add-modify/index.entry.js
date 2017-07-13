require('bootstrap');
require('./../../common/common.less');
require('./index.less');

import React from 'react';
import {render} from 'react-dom';
import InfoForm from './info-form.jsx';

var formData = window.initData &&  window.initData.formData ? window.initData.formData : {};

render(
    <InfoForm {...formData}/>,
    document.getElementById('form-wrap')
);

