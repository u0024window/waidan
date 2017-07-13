/**
 * 债务人还款金额
 *
 */
import React from 'react';
import PubSub from 'pubsub-js';
import {includes} from 'lodash';

class Operate extends React.Component {
    constructor(props) {
        super(props);
    }
    clickHandler(e) {
        var debtId = e.target.getAttribute('data-debtid')
        PubSub.publish('operation/refundDailog', function (refundDialog){
            refundDialog.setState({
                debtIds: [debtId],
                show: true,
                date: ''
            })
        });
    }
    showRefund() {
        /**
            0: '初始状态',
            1: '已分案',
            2: '催收中',
            3: '待清算',
            4: '待分案',
            5: '已完成',
            6: '暂停催收'
        **/

        let debtStatus = [1, 2, 3, 4];
        return includes(debtStatus, this.props.status);
    }
    render() {
        return (
            <div>
                <a
                    className="btn btn-link"
                    target="_blank"
                    href={`/debt/detail/${this.props.debtId}`}
                >
                详情
                </a>
                {this.showRefund() &&
                <a
                    className="btn btn-link"
                    href="javascript:;"
                    data-debtId={this.props.debtId}
                    onClick={this.clickHandler.bind(this)}
                >
                债务人还款
                </a>
                }
            </div>
        );
    }
}

module.exports = Operate;








