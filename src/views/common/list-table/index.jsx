import React from 'react';
require('./index.less');
import {Pagination} from 'react-bootstrap';
import URI from 'urijs';
import _ from 'lodash';
import Format from '../../lib/format.js';

class ListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pager: this.props.pager,
            ajax: this.props.ajax,
            list: this.props.data || []
        }
        this.hashItems = _.keyBy(this.props.items, 'id');
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
            if (0 !== +_.get(result, 'error.returnCode')) {
                alert(result.error.returnUserMessage);
                console.error(result.error.returnMessage);
                return;
            }
            self.state.pager.pageNo = pageNo;
            self.state.pager.total = result.data.total;
            var list = result.data.list;
            if (typeof self.props.filter === 'function') {
                list = self.props.filter(result.data.list);
            }
            self.setState({
                pager: self.state.pager,
                list: list
            })
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
        this.state.list.map((data, trIndex) => {
            let tds = [];
            items.forEach((item, index) => {
                let val = data[item.id];
                switch (item.type) {
                    case 'money':
                        val = Format.money(val);
                        break;
                    case 'datetime':
                        val = Format.datetime(val);
                        break;
                    case 'date':
                        val = Format.date(val);
                        break;
                    default:
                }
                tds.push(<td key={index}>{val}</td>);
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


