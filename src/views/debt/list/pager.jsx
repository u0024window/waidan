import React from 'react';
import URI from 'urijs';

class Pager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: this.props.total,
            totalPage: this.props.totalPage,
            pageNo: this.props.pageNo,
            perSize: this.props.pageSize,
            jumpPageNo: ''
        }
    }
    jumpPageNoChangeHandler(e) {
        let val = e.target.value;
        if (val < 1) {
            val = '';
        }
        this.setState({jumpPageNo: val});
    }
    nextHandler() {
        var uri = new URI(window.location.href);
        window.location.href = uri.setQuery({pageNo: +this.state.pageNo + 1}).href();
    }
    pageNum( event ) {
        var uri = new URI(window.location.href);
        window.location.href = uri.setQuery({pageSize: +event.target.value}).href();
    }
    jumpHandler(e) {
        e.preventDefault();

        var uri = new URI(window.location.href);
        var pageNo = +this.state.jumpPageNo;
        if (pageNo > this.state.totalPage) {
            pageNo = this.state.totalPage;
        }
        else if (pageNo < 1) {
            pageNo = 1;
        }
        window.location.href = uri.setQuery({pageNo: pageNo}).href();
    }
    render() {
        if (this.state.totalPage === 0) {
            return <div></div>;
        }
        return (
            <div className="pager-wrap">
                <div className="clearfix">
                    <div className="pull-left">
                        <span>共 <em>{this.state.total}</em> 项</span>
                    </div>
                    <div className="pull-right">
                        <span>{this.state.pageNo}/{this.state.totalPage}</span>
                        <button
                            disabled={ +this.state.totalPage <= this.state.pageNo }
                            className="next btn btn-default btn-sm"
                            onClick={this.nextHandler.bind(this)}
                        >
                        下一页
                        </button>
                        <form className="commonFont">
                            <input
                                type="number"
                                className="form-control input-sm"
                                value={this.state.jumpPageNo}
                                onChange={this.jumpPageNoChangeHandler.bind(this)}
                            />
                            <button
                                type="submit"
                                className="btn btn-default btn-sm"
                                onClick={this.jumpHandler.bind(this)}
                            >
                            跳转
                            </button>
                            每页显示
                            <select
                                defaultValue={this.state.perSize}
                                onChange={this.pageNum.bind(this)}
                            >
                                <option value="10">10</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="500">500</option>
                            </select>
                            条
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
module.exports = Pager;


