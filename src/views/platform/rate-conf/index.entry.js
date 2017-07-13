require('bootstrap');
require('../../common/common.less');

import React from 'react';
import {render} from 'react-dom';
import ConfForm from './conf-form.jsx';

var formData = window.initData &&  window.initData.formData ? window.initData.formData : {};

render(
    <ConfForm data={formData} />,
    document.getElementById('form-wrap')
);
