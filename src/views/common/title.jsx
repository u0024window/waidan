import React from 'react';
import {Breadcrumb, Button} from 'react-bootstrap';

module.exports = React.createClass({
    render: function(){
    	var operateList = this.props.operateList,
    		btnList = [];
    	if(operateList) {
    		for(var i in operateList) {
    			btnList.push(
                    <Button
                        bsStyle={operateList[i].type ? operateList[i].type : 'primary'}
                        key={i}
                        href={operateList[i].href}
                        target={operateList[i].target ? operateList[i].target : ''}
                    >{operateList[i].name}</Button>
    			);
    		}
    	}
        return (
            <p className="page-title">
            	{this.props.title}
                {btnList.length > 0 &&
                    <span className="operate-btns">{btnList}</span>
                }
                {this.props.other || ""}
            </p>
        );
    }
});
