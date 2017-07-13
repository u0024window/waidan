/**
 * 债务人还款金额
 *
 */
import React from 'react';
import ListTable from '../../common/list-table/index.jsx';
import Title from '../../common/title.jsx';
import _ from 'lodash';

var items = [
    {
        name: '还款日期',
        id: 'refundDate',
        type: 'date'
    },
    {
        name:'回款金额',
        id: 'refundAmount',
        style: {
            width: '150px'
        },
        type: 'money'
    },
    {
        name:'佣金结算状态',
        id: 'refundStatusTxt'
    },
    {
        name:'操作人',
        id: 'operator'
    },
    {
        name:'操作时间',
        id: 'operateTime',
        type: 'datetime'
    },
    {
        name:'操作类型',
        id: 'operateType'
    },
    {
        name:'操作',
        id: 'operate'
    }
];

var refundStatusMap = {
    0: '未支付',
    1: '已支付',
    2: '已失效'
}

var operateTypeMap = {
    0: '手工操作'
}

class DebtorRefundList extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.filter(this.props.data);
    }
    filter(data) {
        var data = data || [];
        var list = data.list || [];
        var total = data.total;

        list.map((item) => {
            item['operateType'] = operateTypeMap[item['operateType']];
            item['refundStatusTxt'] = refundStatusMap[item['refundStatus']];

            if (this.props.readOnly === false && item['refundStatus'] === 0 ) {
                item['operate'] = <a
                    className="btn btn-link"
                    href="javascript:;"
                    onClick={this.refundHandler.bind(this, this.props.debtId, item['refundId'])}
                >暂停结算</a>
            }

            return item;
        });

        if (total) {
            list.push({
                refundDate: '合计',
                refundAmount: total['refundAmount']
            });
        }

        return list;
    }
    refundHandler(debtId, refundId) {
        if (!confirm('确定暂停结算?')) {
            return;
        }
        var debtId = debtId;
        var refundId = refundId;

        $.ajax({
            type: "post",
            url: '/api/debt/refund-pause',
            data: {
                debtId: debtId,
                refundId: refundId
            }
        })
        .done(function (result) {
            if (0 !== +_.get(result, 'error.returnCode')) {
                alert(result.error.returnUserMessage);
                console.error(result.error.returnMessage);
                return;
            }
            alert('操作成功');
            window.location.reload();
        })
        .fail(function () {
            alert('服务异常');
        })
    }
    render() {
        return (
            <div className="debt-info-wrap">
                <Title title="债务人还款信息" />
                <ListTable items={items} data={this.data} />
            </div>
        );
    }
}
module.exports = DebtorRefundList;








