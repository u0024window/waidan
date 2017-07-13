/**
 * 案件信息
 *
 */
import React from 'react';

class ColTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var html = [];
        var needNewLine = true;
        var tds = null;
        var items = this.props.items || [];
        var data = this.props.data || {};
        var columnNum = this.props.columnNum || 1;
        var trs = [];

        items.forEach(function (item, index) {
            if (needNewLine) {
                tds = [];
                trs.push(tds);
            }
            needNewLine = false;
            tds.push(
                <th key={'th'+columnNum+index}>
                    {item.name}
                </th>
            );
            tds.push(
                <td key={'td'+columnNum+index}>
                    {data[item.id]}
                </td>
            );

            if((index+1) % columnNum === 0) {
                needNewLine = true;
            }
        })

        trs.forEach(function (item, index) {
            html.push(<tr key={index}>{item}</tr>)
        })

        return (
            <div className="col-table-wrap">
                <table className="table table-bordered table-condensed" style={{width: "100%", minWidth: '860px'}}>
                    <tbody>
                    {html}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ColTable;



