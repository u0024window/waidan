import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';


class NoRefundDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            debtIds: [],
            show: this.props.show || false,
            method: 'single'
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
        var self = this;

        $.ajax({
            type: "post",
            url: '/api/debt/roundNoRefund',
            data: {
                debtIds: (this.state.debtIds||[]).join(','),
                method: this.state.method
            }
        })
        .done(function (result) {
            if (result && result.error && 0 !== +result.error.returnCode) {
                alert(result.error.returnUserMessage);
                console.error(result.error.returnMessage);
                return;
            }
            else if (result && result.error && 0 === +result.error.returnCode) {
                if (self.state.method === 'batch') {
                    alert(`成功：${result.data.successCount||0}个, 失败：${result.data.failCount|| 0}个`);
                }
                else {
                    alert('操作成功');
                }
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
                        <Modal.Title>本轮催收无还款</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form className="form-inline" style={{marginLeft: '30px'}}>
                            <div className="row">
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>确定本轮催收无还款?</label>
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
module.exports = NoRefundDialog;



