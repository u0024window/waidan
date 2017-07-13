import React from 'react';
import  {Table, Row, Col, Button} from 'react-bootstrap';

var date = require('locutus/php/datetime/date')
var moneyFormat = require('locutus/php/strings/money_format');

module.exports = React.createClass({
    render: function(){
    	var headList = [],
            bodyList = [],
            thead = this.props.thead;

        //组装thead
        for(var i in thead) {
            headList.push(<th style={thead[i].style}>{thead[i].name}</th>);
        }

        //组装tbody
        var tmpTr, tmpTd, tmpTdValue, tmpTdType, tmpOp, opList, tdList;
        for(var i in this.props.tbody) {
            tmpTr = this.props.tbody[i];
            tdList = [];

            for(var j = 0; j < thead.length; j++) {
                tmpTdValue = thead[j].value;
                tmpTdType = thead[j].type;
                tmpTd = tmpTr[tmpTdValue];

                if(tmpTd && typeof tmpTd === 'object') {//如果是obj 进行解析
                    switch(tmpTd.operateType) {
                        case 0: {//链接
                            opList = [];
                            for(var k in tmpTd.operateList) {
                                tmpOp = tmpTd.operateList[k];
                                opList.push(<a href={tmpOp.href}>{tmpOp.name}</a>);
                            }
                            tdList.push(<td>{opList}</td>);
                        }
                    }
                } else {
                    if(tmpTdType && tmpTdType === 'date') {
                        if (typeof tmpTd === 'number') {
                            tmpTd = date('Y-m-d', tmpTd/1000);
                        }
                        else if (typeof tmpTd === 'string') {
                            tmpTd = tmpTd;
                        }
                        else {
                            tmpTd = '';
                        }
                    }
                    else if(tmpTdType && tmpTdType === 'dateTime') {
                        if (typeof tmpTd === 'number') {
                            tmpTd = date('Y-m-d H:i:s', tmpTd/1000);
                        }
                        else if (typeof tmpTd === 'string') {
                            tmpTd = tmpTd;
                        }
                        else {
                            tmpTd = '';
                        }
                    }
                    else if(tmpTdType && tmpTdType === 'money') {
                        if (tmpTd !== undefined) {
                            tmpTd = moneyFormat('%i', tmpTd/100).replace(/USD/g, '¥');
                        }
                        else {
                            tmpTd = '';
                        }
                    }
                    tdList.push(<td>{tmpTd}</td>);
                }
            }
            
            bodyList.push(<tr>{tdList}</tr>)
        }

        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>{headList}</tr>
                </thead>
                <tbody>
                    {bodyList}
                </tbody>
            </Table>
        );
    }
});
