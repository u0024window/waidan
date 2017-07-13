// 顶部warn
import TopWarn from './top-warn.jsx';

// 当前位置
import Nav from '../../common/nav.jsx';

//案件信息
import DebtInfo from './debt-info.jsx';

// 债务人信息
import DebtorInfo from './debtor-info.jsx';

// 债务人还款信息
import DebtorRefundList from './debtor-refund-list.jsx';

//委托方结款金额
import EntrustorSettleList from './entrustor-settle-list.jsx';

// 催收记录
import CollRecordList from './coll-record-list.jsx';

// 逾期天数与奖金比例
import OverdueRewardInfo from './overdue-reward-info.jsx';

// 底部按钮操作区
import Operation from './operation.jsx';

import React from 'react';

class Detail extends React.Component {
    constructor(props) {
        super(props);

    }
    showTopWarn(topWarnData) {

        return topWarnData.addressError ||
            topWarnData.contactError ||
            (topWarnData.suspectedRepeat && topWarnData.suspectedRepeat.length > 0)
    }
    render() {
        this.data = this.props.data || {};
        this.detail = this.data.detail || {};
        this.navList = [
            {
                path: '/debt/list',
                name: '案件列表'
            },
            {
                path: `/debt/detail/${this.data.debtId}`,
                name: '案件详情'
            }
        ]
        this.topWarnData = {
            addressError: this.detail.addressError,
            contactError: this.detail.contactError,
            suspectedRepeat: this.detail.suspectedRepeat,
            readOnly: this.data.readOnly
        }

        return (
            <div>
                {this.showTopWarn(this.topWarnData) &&
                    <TopWarn data={this.topWarnData} />
                }
                {!this.data.readOnly &&
                    <Nav navList={this.navList} />
                }
                <DebtInfo
                    data={this.detail.debtInfo}
                    debtId={this.data.debtId}
                    readOnly={this.data.readOnly}
                />
                <DebtorInfo
                    debtId={this.data.debtId}
                    data={this.detail.debtorInfo}
                    province={this.data.province}
                    regions={this.data.regions}
                    readOnly={this.data.readOnly}
                />
                <DebtorRefundList
                    data={this.detail.debtRefundList}
                    debtId={this.data.debtId}
                    readOnly={this.data.readOnly}
                />
                <EntrustorSettleList data={this.detail.debtSettleList}/>
                <CollRecordList data={this.data.collRecordData} />
                <OverdueRewardInfo data={this.detail.debtInfo.overdueRewardInfo} />
                {!this.data.readOnly &&
                    <Operation
                        debtId={this.data.debtId}
                        reasons={this.data.reasons}
                        debtStatus={this.detail.debtInfo.debtStatus}
                        settleStatus={this.detail.debtInfo.settleStatus}
                        suspectedRepeat={this.detail.suspectedRepeat}
                        entrustEndDate={this.detail.debtInfo.entrustEndDate}
                        roundRrcRefundAmount={this.detail.debtInfo.roundRrcRefundAmount}
                    />
                }
            </div>
        );
    }
}

module.exports = Detail;







