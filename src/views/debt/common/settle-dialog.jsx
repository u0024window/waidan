import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';

const MONTHLABELS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const DAYLABELS = ['日','一', '二', '三', '四', '五', '六'];

class SettleDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            money: '',
            show: this.props.show || false
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    dateChangeHandler (val) {
        this.setState({date: val});
    }
    close() {
        this.setState({show: false})
    }
    ok() {
        if (!this.state.debtIds) {
            console.error("debtIds can't be null")

            return;
        }

        $.ajax({
            type: "post",
            url: '/api/debt/settle',
            data: {
                debtIds: this.state.debtIds[0],
                settleAmount: this.state.money,
                settleDate: +new Date(this.state.date),
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
        return (
            <div className="static-modal" >
                <Modal
                    onHide={this.close.bind(this)}
                    show={this.state.show}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>委托方付款</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form className="form-inline" style={{marginLeft: '30px'}}>
                            <div className="row">
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>到账金额</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="money"
                                        onChange={this.handleChange.bind(this)}/> 元
                                </div>
                            </div>
                            <div className="row" style={{marginTop: '15px'}}>
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>到账时间</label>
                                    <DatePicker
                                        dateFormat="YYY-MM-DD"
                                        value={this.state.date}
                                        monthLabels={MONTHLABELS}
                                        dayLabels={DAYLABELS}
                                        onChange={this.dateChangeHandler.bind(this)} />
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
module.exports = SettleDialog;



