import React from 'react';
require('./list-table-component.less');
import {Pagination} from 'react-bootstrap';
import URI from 'urijs';

class ListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pager: this.props.pager,
            ajax: this.props.ajax,
            list: this.props.data || []
        }
    }
    handleSelect(pageNo) {
        if (this.state.ajax) {
            this.ajaxRenderList(pageNo);
        }
        else {
            this.refreshPage(pageNo);
        }
    }
    ajaxRenderList(pageNo) {
        var self = this;
        $.ajax({
            type: "post",
            url: this.state.ajax.url,
            data: Object.assign(this.state.ajax.params, {
                pageNo: pageNo,
                pageSize: this.state.pager.pageSize
            })
        })
        .done(function (result) {
            if (result && result.error && 0 !== +result.error.returnCode) {
                alert(result.error.returnUserMessage);
                console.error(result.error.returnMessage);
                return;
            }
            else if (result && result.error && 0 === +result.error.returnCode) {
                self.state.pager.pageNo = pageNo;
                self.state.pager.total = result.data.total;

                self.setState({
                    pager: self.state.pager,
                    list: result.data.list
                })
            }
            else {
                alert('服务异常');
            }
        })
        .fail(function () {
            alert('服务异常');
        })
    }
    refreshPage(pageNo) {
        var uri = new URI(window.location.href);
        var url = uri.setQuery({
            pageNo: pageNo,
            pageSize: this.state.pager.pageSize
        }).href();
        window.location.href = url;
    }
    render() {
        var items = this.props.items || [];

        var dataRows = [];
        this.state.list.map(function (data, trIndex) {
            let tds = [];
            items.forEach(function (item, index){
                tds.push(<td key={index}>{data[item.id]}</td>);
            })
            let row = <tr key={trIndex}>{tds}</tr>
            dataRows.push(row);
        })

        if (this.state.pager) {
            var totalPage = Math.ceil(this.state.pager.total / this.state.pager.pageSize);
        }

        return (
            <div className="list-table-wrap">
                <table className="table table-bordered table-condensed table-striped table-hover">
                    <thead>
                        <tr>
                            {
                                items.map(function (item, index) {
                                    let style = Object.assign({width: "100px"}, item.style || {});
                                    return <th style={style} key={index}>{item.name}</th>;
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows}
                    </tbody>
                </table>
                {this.state.pager &&
                    <div className="pager-wrap">
                        <Pagination
                            bsSize="small"
                            items={totalPage}
                            maxButtons={5}
                            activePage={this.state.pager.pageNo}
                            onSelect={this.handleSelect.bind(this)}
                        >
                        </Pagination>
                    </div>
                }
            </div>
        );
    }
}
export default ListTable;


