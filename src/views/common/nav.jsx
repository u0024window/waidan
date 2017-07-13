import React from 'react';
import {Breadcrumb} from 'react-bootstrap';

module.exports = React.createClass({
    render: function(){
    	var items = [],
    		tmp;

        for(var i in this.props.navList) {
        	tmp = this.props.navList[i];
        	items.push(<Breadcrumb.Item key={i} href={tmp.path}>{tmp.name}</Breadcrumb.Item>);
        }

        return (
            <div className="page-nav">
	        	<span className="page-lab">当前位置：</span><Breadcrumb>{items}</Breadcrumb>
        	</div>
        );
    }
});
