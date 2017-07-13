import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import date from 'locutus/php/datetime/date';
import DatePicker from 'react-datetime';
require('moment/locale/fr');

class ExtendEntrustDateDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            debtIds: [],
            date: '',
            value: '',
            show: this.props.show || false
        }
    }
    handleChange(value) {
        this.setState({value: value});
    }
    close() {
        this.setState({show: false})
    }
    ok() {
        if (!this.state.debtIds) {
            console.error("debtIds can't be null")

            return ;
        }
        if ('' === this.state.value) {
            alert('请填写日期');

            return ;
        }
        $.ajax({
            type: "post",
            url: '/api/debt/extend-entrust-date',
            data: {
                debtIds: this.state.debtIds.join(','),
                entrustEndDate: +this.state.value
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
            <div className="static-modal">
                <Modal
                    onHide={this.close.bind(this)}
                    show={this.state.show}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>延长委托期</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form className="form-inline" style={{marginLeft: '30px'}}>
                            {this.state.date &&
                                <div className="row">
                                    <div className="form-group">
                                        <label style={{paddingRight: '10px'}}>当前委托截止日期</label>
                                        <label>{date('Y-m-d', this.state.date/1000)}</label>
                                    </div>
                                </div>
                            }
                            <div className="row" style={{marginTop: '15px'}}>
                                <div className="form-group">
                                    <label style={{display: 'inline-block', paddingRight: '10px', width: '122px', textAlign: 'right'}}>委托期延长至</label>
                                    <DatePicker
                                        className="inline-block"
                                        locale="zh-cn"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        name="value"
                                        value={this.state.value}
                                        onChange={this.handleChange.bind(this)} />
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
module.exports = ExtendEntrustDateDialog;



