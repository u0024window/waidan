import React from 'react';

class Query extends React.Component {
    constructor(props) {
        super(props);

        var query = this.props.query;
        this.state = {
            batchNo: query.batchNo,
            debtContract: query.debtContract,
            debtName: query.debtName,
            entrustStatus: query.entrustStatus,
            importStatus: query.importStatus,
            debtMobile: query.debtMobile,
            debtIdentityId: query.debtIdentityId,
            debtStatus: query.debtStatus,
            debtSettleStatus: query.debtSettleStatus,
            enterpriseId: query.enterpriseId,
            enterpriseOptions: this.props.enterpriseList,
            roundRefundAmountBegin: query.roundRefundAmountBegin,
            roundRefundAmountEnd: query.roundRefundAmountEnd
        }
    }
    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    clearHandler() {
        window.location.href = "/debt/list";
    }
    render() {
        return (
            <div className="query-wrap">
                <form className="form-inline" autoComplete="off">
                    <div>
                        <div className="form-group">
                            <label>债务人姓名：</label>
                            <input
                                type="text"
                                name="debtName"
                                className="form-control"
                                value={this.state.debtName}
                                onChange={this.changeHandler.bind(this)}
                            />
                        </div>

                        <div className="form-group">
                            <label>手机号：</label>
                            <input
                                type="text"
                                name="debtMobile"
                                className="form-control"
                                value={this.state.debtMobile}
                                onChange={this.changeHandler.bind(this)}
                            />
                        </div>

                        <div className="form-group">
                            <label>身份证号：</label>
                            <input
                                type="text"
                                name="debtIdentityId"
                                className="form-control"
                                value={this.state.debtIdentityId}
                                onChange={this.changeHandler.bind(this)}
                            />
                        </div>
                    </div>
                    
                    <div style={{marginTop: '15px'}}>
                        <div className="form-group">
                            <label>案件编号：</label>
                            <input
                                type="text"
                                name="debtContract"
                                className="form-control"
                                value={this.state.debtContract}
                                onChange={this.changeHandler.bind(this)}
                            />
                        </div>
                        <div className="form-group">
                            <label>委托批次号：</label>
                            <input
                                type="text"
                                name="batchNo"
                                className="form-control"
                                value={this.state.batchNo}
                                onChange={this.changeHandler.bind(this)}
                            />
                        </div>
                        <div className="form-group">
                            <label>委托公司：</label>
                            <select
                                className="form-control"
                                name="enterpriseId"
                                defaultValue={this.state.enterpriseId}
                                onChange={this.changeHandler.bind(this)}
                            >
                                <option value="">请选择</option>
                                {
                                    this.state.enterpriseOptions.map(function (option){

                                        return  (
                                            <option
                                                key={option.enterpriseId}
                                                value={option.enterpriseId}
                                                title={option.enterpriseName}
                                            >
                                            {option.enterpriseName}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div style={{marginTop: '15px'}}>
                        <div className="form-group">
                            <label>委托状态：</label>
                            <select
                                className="form-control"
                                name="entrustStatus"
                                defaultValue={this.state.entrustStatus}
                                onChange={this.changeHandler.bind(this)}
                            >
                                <option value="0">请选择</option>
                                <option value="1">委托期内</option>
                                <option value="2">委托结束</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>案件状态：</label>
                            <select
                                className="form-control"
                                name="debtStatus"
                                defaultValue={this.state.debtStatus}
                                onChange={this.changeHandler.bind(this)}
                            >
                                <option value="">请选择</option>
                                <option value="0">初始状态</option>
                                <option value="1">已分案</option>
                                <option value="2">催收中</option>
                                <option value="3">待清算</option>
                                <option value="4">待分案</option>
                                <option value="5">已完成</option>
                                <option value="6">暂停催收</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>结算状态：</label>
                            <select
                                className="form-control"
                                name="debtSettleStatus"
                                defaultValue={this.state.debtSettleStatus}
                                onChange={this.changeHandler.bind(this)}
                            >
                                <option value="">请选择</option>
                                <option value="0">无需结算</option>
                                <option value="1">待清算</option>
                                <option value="2">待结算</option>
                                <option value="3">部分结算</option>
                                <option value="4">结算完成</option>
                            </select>
                        </div>
                        
                    </div>
                    <div style={{marginTop: '15px'}}>
                        <div className="form-group">
                            <label>信息错误类型：</label>
                            <select
                                className="form-control"
                                name="importStatus"
                                defaultValue={this.state.importStatus}
                                onChange={this.changeHandler.bind(this)}
                            >
                                <option value="0">请选择</option>
                                <option value="2">地址信息错误</option>
                                <option value="4">联系人信息错误</option>
                                <option value="1">案件疑似重复</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>回款金额：</label>
                            <input
                                style={{width: '80px'}}
                                type="text"
                                name="roundRefundAmountBegin"
                                className="form-control"
                                value={this.state.roundRefundAmountBegin}
                                onChange={this.changeHandler.bind(this)}
                            />
                            至
                            <input
                                type="text"
                                style={{width: '80px'}}
                                name="roundRefundAmountEnd"
                                className="form-control"
                                value={this.state.roundRefundAmountEnd}
                                onChange={this.changeHandler.bind(this)}
                            />
                        </div>

                        <div className="form-group" style={{paddingLeft: "36px"}}>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.clearHandler.bind(this)}
                            >清除</button>
                            <button
                                type="submit"
                                style={{marginLeft: "20px", width: "100px"}}
                                className="btn btn-primary"
                            >查询</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
module.exports = Query;



