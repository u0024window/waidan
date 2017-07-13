import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

class CloseDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reasonCode: '',
            reasons: [],
            remark: '',
            debtIds: [],
            show: this.props.show || false
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    close() {
        this.setState({show: false})
    }
    ok() {
        if (!this.state.debtIds) {
            console.error("debtIds can't be null")

            return;
        }
        if ('' === this.state.reasonCode) {
            alert('请选择关闭原因');

            return;
        }
        if ('QT' === this.state.reasonCode && '' === $.trim(this.state.remark)) {
            alert('备注不能为空');

            return;
        }
        if ( this.state.type ) {
            var debtId = this.state.debtIds.join(',')
        } else {
            var debtId = this.state.debtIds[0]
        }
        $.ajax({
            type: "post",
            url: '/api/debt/close',
            data: {
                debtId: debtId,
                reasonCode: this.state.reasonCode,
                remark: this.state.remark
            }
        })
        .done(function (result) {
            if (result && result.error && 0 !== +result.error.returnCode) {
                alert(result.error.returnUserMessage);
                console.error(result.error.returnMessage);
                return;
            }
            else if (result && result.error && 0 === +result.error.returnCode) {
                alert('操作成功');
                window.location.reload();
            }
            else {
                alert('服务异常');
            }
        })
        .fail(function () {
            alert('服务异常');
        })



    }
    render() {
        var obj = {};
        if ( this.state.showCaseNum ) {
            obj = {
                display: "block"
            }
        } else {
            obj = {
                display: 'none'
            }
        }
        
        return (
            <div className="static-modal" >
                <Modal
                    onHide={this.close.bind(this)}
                    show={this.state.show}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>关闭案件</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form className="form-inline" style={{marginLeft: '30px'}}>
                            <div className="row" style={obj}>
                                <p>您共选择了{this.state.caseCountNum}个案件，其中{this.state.canCloseCase}个案件可关闭。</p>
                                <p>确定要关闭这些案件么？(此操作不可恢复)</p>
                            </div>
                            <div className="row" style={{marginTop: "20px"}}>
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>关闭原因</label>
                                    <select
                                        className="form-control"
                                        name="reasonCode"
                                        style={{width: '180px'}}
                                        value={this.state.reasonCode}
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        <option value="">请选择</option>
                                        {
                                            this.state.reasons.map(function(item) {

                                                return (
                                                    <option key={item.reasonCode} value={item.reasonCode}>{item.reasonName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="row" style={{marginTop: '15px'}}>
                                <div className="form-group">
                                    <label style={{paddingRight: '10px', width: '65px',textAlign: 'right'}}>备注</label>
                                    <textArea
                                        className="form-control"
                                        name="remark"
                                        onChange={this.handleChange.bind(this)}
                                    ></textArea>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.ok.bind(this)} bsStyle="primary">确定</Button>
                        <Button onClick={this.close.bind(this)}>取消</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        );
    }
}
module.exports = CloseDialog;



