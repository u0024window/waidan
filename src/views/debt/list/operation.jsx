import React from 'react';
import PubSub from 'pubsub-js';
import ExtendEntrustDateDialog from '../common/extend-entrust-date-dialog.jsx';
import CloseDialog from '../common/close-dialog.jsx';
import SendToRrcDialog from '../common/send-to-rrc-dialog.jsx';
import RefundDialog from '../common/refund-dialog.jsx';
import NoRefundDialog from '../common/no-refund-dialog.jsx';
import CollectRecordExportDialog from '../common/collect-record-export-dialog.jsx';
import _ from 'lodash';


class Operation extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        PubSub.unsubscribe('operation/refundDailog');
        this.pubsub_token = PubSub.subscribe('operation/refundDailog', function(msg, callback) {
            callback(this.refs['refundDialog']);
        }.bind(this));
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }

    extendEntrustDateHandler() {
        PubSub.publish('list-table/getCheckedIds', function (debtIds){
            debtIds = debtIds || [];
            if (debtIds.length === 0) {
                alert('请选择案件');
                return;
            }

            this.refs['extendEntrustDateDialog'].setState({
                debtIds: debtIds,
                date: '',
                value: '',
                show: true
            });
        }.bind(this));
    }
    collectRecordExportHandler() {
        PubSub.publish('list-table/getCheckedIds', function (debtIds){
            debtIds = debtIds || [];

            this.refs['collectRecordExportDialog'].setState({
                debtIds: debtIds,
                email: this.props.data,
                show: true
            });
        }.bind(this));
    }
    noRefundHandler() {
        PubSub.publish('list-table/getCheckedIds', function (debtIds){
            debtIds = debtIds || [];

            if (debtIds.length === 0) {
                alert('请选择案件');
                return;
            }
            this.refs['noRefundDialog'].setState({
                debtIds: debtIds,
                show: true,
                method: 'batch'
            });
        }.bind(this));
    }
    closeCaseHandler() {
        PubSub.publish('list-table/getCheckedList', function (  r, debtIds ){
            var reasons = null;
            if ( 0 == r.length ) {
                alert( '请选择案件' );
                return false;
            };
            debtIds = debtIds || [];
            $.ajax({
                type: "post",
                url: '/api/debt/case-close-reasons',
                data: {
                    debtIds: debtIds.join(',') || debtIds[0]
                }
            })
            .done(function (result) {
                if (0 == _.get(result, 'error.returnCode')) {
                    reasons = result.data;
                    fnReasons(reasons);
                } else {
                    console.log(_.get(result, 'error.returnMessage'));
                    alert(_.get(result, 'error.returnUserMessage') || '获取原因接口失败');
                }
                
            })
            .fail(function () {
                alert('服务异常');
            })
            var self = this;
            function fnReasons(reasons){
                var caseCountNum = null,
                    canCloseCase = null;
                self.refs['closeDialog'].setState({
                    debtIds: debtIds,
                    type: 'list',
                    showCaseNum: true,
                    canCloseCase: reasons.closeCount.allowClose,
                    caseCountNum: reasons.closeCount.total,
                    reasons: reasons.reasonList,
                    show: true
                });
            }
        }.bind(this));
    }
    sendToRrcHandler() {
        PubSub.publish('list-table/getCheckedIds', function (debtIds){
            debtIds = debtIds || [];
            if (debtIds.length === 0) {
                alert('请选择案件');
                return;
            }

            this.refs['sendToRrcDialog'].setState({
                debtIds: debtIds,
                show: true
            });
        }.bind(this));
    }
    render() {
        return (
            <div className="operation-wrap">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="pull-left">
                            <button
                                className="btn btn-primary"
                                onClick={this.extendEntrustDateHandler.bind(this)}
                            >
                            延长委托期
                            </button>

                            <button
                                className="division btn btn-primary"
                                onClick={this.sendToRrcHandler.bind(this)}
                            >
                            分案至人人催
                            </button>

                            <button
                                className="division btn btn-primary"
                                onClick={this.collectRecordExportHandler.bind(this)}
                            >
                            催记导出
                            </button>
                            <button
                                className="division btn btn-primary"
                                onClick={this.closeCaseHandler.bind(this)}
                            >
                            关闭案件
                            </button>
                            <button
                                className="division btn btn-primary"
                                onClick={this.noRefundHandler.bind(this)}
                            >
                            本轮催收无还款
                            </button>
                        </div>
                    </div>
                </div>
                <div className="dialog-wrap">
                    <ExtendEntrustDateDialog ref="extendEntrustDateDialog" show={false}/>
                    <CloseDialog ref="closeDialog" show={false}/>
                    <SendToRrcDialog ref="sendToRrcDialog" show={false}/>
                    <RefundDialog ref="refundDialog" show={false}/>
                    <CollectRecordExportDialog ref="collectRecordExportDialog" show={false} />
                    <NoRefundDialog ref="noRefundDialog" show={false}/>
                </div>
            </div>
        );
    }
}
module.exports = Operation;


