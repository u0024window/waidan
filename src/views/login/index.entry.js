require('bootstrap');
require('./index.less');
require('./../common/common.less');

import React from 'react';
import {render} from 'react-dom';
import LoginForm from './login-form.jsx';


render(
    <LoginForm />,
    document.getElementById('login')
);
