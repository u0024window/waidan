import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import URI from 'urijs';
import DatePicker from 'react-datetime';
require('moment/locale/zh-cn');

class CollectRecordExportDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            debtIds: [],
            email: this.props.email || '',
            show: this.props.show || false
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    getQuery () {
        var uri = new URI(window.location.href);
        var query = URI.parseQuery(uri.query()) || {};
        query = $.extend({
            pageNo: 1,
            pageSize: 20
        }, query)

        return query;
    }
    close() {
        this.setState({show: false})
    }
    entrustBeginChange (m) {
        this.setState({entrustBegin: m && m.startOf('day')})
    }
    entrustEndChange (m) {
        this.setState({entrustEnd: m && m.endOf('day')})
    }
    ok() {
        var params;

        // 选择案件，传案件id，否则走query
        if (this.state.debtIds && this.state.debtIds.length > 0) {
            params = {
                caseIds: this.state.debtIds.join(',')
            }
        }
        else {
            params = this.getQuery();
            let count = window.initData && window.initData.list && window.initData.list.length;

            if (count === 0) {
                alert('没有数据可导出!');
                return;
            }
        }
        params.entrustBegin = +this.state.entrustBegin || 0;
        params.entrustEnd = +this.state.entrustEnd || 0;

        if ((0 !== params.entrustBegin && 0 === params.entrustEnd) ||
            (0 === params.entrustBegin && 0 !== params.entrustEnd)){

            alert('导出时间段不正确！');
            return;
        }
        if (params.entrustBegin > params.entrustEnd) {
            alert("结束时间必须大于开始时间！")
            return;
        }
        $.ajax({
            type: "post",
            url: '/api/debt/collectRecordExport',
            data: params
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
                        <Modal.Title>催记导出</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form className="form-inline" style={{marginLeft: '30px'}}>
                            <div className="row">
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>催记导出文件即将发送至企业邮箱，请稍后！</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label style={{paddingRight: '10px'}}>邮箱：{this.state.email}</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    导出时间段:
                                    <DatePicker
                                        className="inline-block"
                                        locale="zh-cn"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        onChange={this.entrustBeginChange.bind(this)} />
                                    至
                                    <DatePicker
                                        className="inline-block"
                                        locale="zh-cn"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        onChange={this.entrustEndChange.bind(this)} />
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
module.exports = CollectRecordExportDialog;




