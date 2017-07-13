import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';


class UnExceptionDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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

        $.ajax({
            type: "post",
            url: '/api/debt/unexception',
            data: {
                debtId: this.state.debtIds[0],
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
                        <Modal.Title>继续催收</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form className="form-inline" style={{marginLeft: '30px'}}>
                            <div className="row">
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>确定继续催收?</label>
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
module.exports = UnExceptionDialog;



