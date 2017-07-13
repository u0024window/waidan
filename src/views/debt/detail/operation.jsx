import React from 'react';
import ReactDOM from 'react-dom';
import RefundDialog from '../common/refund-dialog.jsx';
import ExtendEntrustDateDialog from '../common/extend-entrust-date-dialog.jsx';
import CloseDialog from '../common/close-dialog.jsx';
import SendToRrcDialog from '../common/send-to-rrc-dialog.jsx';
import ExceptionDialog from '../common/exception-dialog.jsx';
import UnExceptionDialog from '../common/unexception-dialog.jsx';
import RefundConfirmDialog from '../common/refund-confirm-dialog.jsx';
import UnSuspectedRepeatDialog from "../common/unsuspected-repeat-dialog.jsx";
import NoRefundDialog from "../common/no-refund-dialog.jsx";
import {includes} from 'lodash';

class Operation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGoTop: false
        }
    }
    componentDidMount() {
        var $win = $(window);
        var self =  this;

        $win.scroll((function (){
            var timer = null;

            return function (){
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    if (self.state.showGoTop === false && $win.scrollTop() > 0) {
                        self.setState({
                            showGoTop: true
                        });
                    }
                    else if (self.state.showGoTop === true && $win.scrollTop() === 0){
                        self.setState({
                            showGoTop: false
                        });
                    }
                }, 100);
            }
        })());
    }
    openDialog(e) {
        var name = e.target.name;
        var params = {
            show: true,
            debtIds: [this.props.debtId]
        };

        if ('refundDialog'=== name || 'settleDialog' === name) {
            params['date'] = '';
            params['money'] = '';
        }
        if ('extendEntrustDateDialog' === name) {
            params['date'] = this.props.entrustEndDate;
            params['value'] = '';
        }
        if ('closeDialog' === name) {
            params['reasons'] = this.props.reasons.reasonList;
            params['reasonCode'] = '';
            params['remark'] = '';
        }
        this.refs[name].setState(params);
    }
    goTopHandler(e) {
        $(window).scrollTop(0);
    }
    canShow (name) {
        let status = null;
        switch(name) {
            /**
                0: '初始状态',
                1: '已分案',
                2: '催收中',
                3: '待清算',
                4: '待分案',
                5: '已完成',
                6: '暂停催收'
            **/
            case 'refundDialog':
                status = [1, 2, 3, 4];
                return includes(status, this.props.debtStatus);

            case 'extendEntrustDateDialog':
                status = [0, 1, 2, 3, 4];
                return includes(status, this.props.debtStatus);

            case 'sendToRrcDialog':
                status = [4];
                return includes(status, this.props.debtStatus);

            case 'closeDialog':
                status = [0, 4];
                // 关闭后状态扭转为5(已完成)
                return includes(status, this.props.debtStatus) ||
                    (5 !== this.props.debtStatus && this.props.suspectedRepeat && this.props.suspectedRepeat.length > 0);

            case 'exceptionDialog':
                status = [0, 3, 4];
                return includes(status, this.props.debtStatus);

            case 'unExceptionDialog':
                status = [6];
                return includes(status, this.props.debtStatus);

            case 'refundConfirmDialog':
                status = [3];
                return includes(status, this.props.debtStatus) && this.props.roundRrcRefundAmount > 0;

            case 'unSuspectedRepeatDialog':
                return (this.props.suspectedRepeat && this.props.suspectedRepeat.length > 0);

            case 'noRefundDialog':
                status = [3];
                var settleStatus = [1] // 结算状态-待清算
                return includes(status, this.props.debtStatus) &&
                    includes(settleStatus, this.props.settleStatus) &&
                    this.props.roundRrcRefundAmount <= 0;

            default:
                return true;
        }
    }
    render() {

        return (
            <div className="operation-wrap">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="pull-left">
                            {this.canShow('refundDialog') &&
                                <button
                                    className="btn btn-primary"
                                    name="refundDialog"
                                    onClick={this.openDialog.bind(this)}
                                >债务人还款</button>
                            }
                            {this.canShow('extendEntrustDateDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="extendEntrustDateDialog"
                                    onClick={this.openDialog.bind(this)}
                                >延长委托期</button>
                            }
                            {this.canShow('sendToRrcDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="sendToRrcDialog"
                                    onClick={this.openDialog.bind(this)}
                                >分案至人人催</button>
                            }
                            {this.canShow('closeDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="closeDialog"
                                    onClick={this.openDialog.bind(this)}
                                >关闭案件</button>
                            }
                            {this.canShow('exceptionDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="exceptionDialog"
                                    onClick={this.openDialog.bind(this)}
                                >暂停催收</button>
                            }
                            {this.canShow('unExceptionDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="unExceptionDialog"
                                    onClick={this.openDialog.bind(this)}
                                >继续催收</button>
                            }
                            {this.canShow('refundConfirmDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="refundConfirmDialog"
                                    onClick={this.openDialog.bind(this)}
                                >确定清算</button>
                            }
                            {this.canShow('unSuspectedRepeatDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="unSuspectedRepeatDialog"
                                    onClick={this.openDialog.bind(this)}
                                >非重复案件</button>
                            }
                            {this.canShow('noRefundDialog') &&
                                <button
                                    className="division btn btn-primary"
                                    name="noRefundDialog"
                                    onClick={this.openDialog.bind(this)}
                                >本轮催收无还款</button>
                            }
                        </div>
                    </div>
                </div>
                {this.state.showGoTop &&
                    <a href="javascript:;" className="go-top btn btn-link" onClick={this.goTopHandler.bind(this)}>TOP</a>
                }
                <div id="dialog-wrap">
                    <RefundDialog ref="refundDialog" show={false}/>
                    <ExtendEntrustDateDialog ref="extendEntrustDateDialog" show={false}/>
                    <SendToRrcDialog ref="sendToRrcDialog" show={false}/>
                    <CloseDialog ref="closeDialog" show={false}/>
                    <ExceptionDialog ref="exceptionDialog" show={false}/>
                    <UnExceptionDialog ref="unExceptionDialog" show={false}/>
                    <RefundConfirmDialog ref="refundConfirmDialog" show={false}/>
                    <UnSuspectedRepeatDialog ref="unSuspectedRepeatDialog" show={false}/>
                    <NoRefundDialog ref="noRefundDialog" show={false}/>
                </div>
            </div>
        );
    }
}
module.exports = Operation;


