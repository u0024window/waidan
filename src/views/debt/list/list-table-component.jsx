import React from 'react';
import PubSub from 'pubsub-js';

class ListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: [],
            checkedAll: false
        }
        var self = this;
        var listData = this.props.data || [];
        listData.map(function (data, trIndex) {
            self.state.checked.push({
                value: data['debtId'],
                checked: false
            });
        });
    }
    componentWillMount() {
        this.pubsub_token = [];

        PubSub.unsubscribe('list-table/getCheckedIds');
        this.pubsub_token.push(PubSub.subscribe('list-table/getCheckedIds', function(msg, callback) {
            var ids = this.getCheckedIds();
            console.log(ids);
            callback(ids);
        }.bind(this)));

        PubSub.unsubscribe('list-table/getCheckedList');
        this.pubsub_token.push(PubSub.subscribe('list-table/getCheckedList', function(msg, callback) {
            var obj = _.keyBy(this.props.data, 'debtId');
            var ids = this.getCheckedIds() || [];
            var r = [];
            ids.forEach(function (id) {
                r.push(obj[id]);
            })
            callback(r, ids);
        }.bind(this)));

        PubSub.unsubscribe('list-table/getCount');
        this.pubsub_token.push(PubSub.subscribe('list-table/getCount', function(msg, callback) {
            var list = this.props.data || [];
            callback(list.length || 0);
        }.bind(this)));
    }
    componentWillUnmount() {
        this.pubsub_token.forEach(function (token) {
            PubSub.unsubscribe(token);
        });
    }
    handleChange(event) {
        let val = event.target.value;
        let index = event.target.name;
        let curBox = this.state.checked[index];
        if (curBox && curBox.checked) {
            curBox.checked = false;
        }
        else {
            curBox.checked = true;
        }
        this.setState({
            checked: this.state.checked
        })
    }
    setBoxStatus(flag) {
        this.state.checked.map(function (curBox){
            curBox.checked = flag;

            return curBox;
        })
    }
    getCheckedIds() {
        var ids = [];

        this.state.checked.forEach(function (curBox){
            if(curBox.checked) {
                ids.push(curBox.value);
            }
        })

        return ids;
    }
    getAllBoxStatus() {
        var allChecked = true;

        this.state.checked.forEach(function (curBox){
            if(!curBox.checked) {
                return false;
            }
            allChecked  = allChecked && curBox.checked;
        })

        return allChecked;
    }
    handleCheckAll(e) {
        let checked = this.state.checkedAll;
        this.setBoxStatus(!checked);
        this.setState({
            checkedAll: !checked,
            checked: this.state.checked
        })
    }
    render() {
        var items = this.props.items || [];
        var listData = this.props.data || [];

        var dataRows = [];
        var tds = [];
        var self = this;
        var boxStyle = {
            width: '40px'
        };
        var headStyle = {width: "100px"};
        var tdsStyle = {};

        if (this.props.isMask) {
            tdsStyle.visibility = 'hidden';
        }
        listData.map(function (data, trIndex) {
            tds = [];
            tds.push(
                <td
                    key={"check"+trIndex}
                    className="check-box"
                    style={boxStyle}
                >
                    <input
                        name={trIndex}
                        value={data['dataId']}
                        type="checkbox"
                        checked={self.state.checked[trIndex].checked}
                        onChange={self.handleChange.bind(self)}
                    />
                </td>
            );
            items.forEach(function (item, index){
                if (self.props.isMask && index === items.length -1) {
                    tds.push(<td className="op-col" key={index}>{data[item.id]}</td>);
                }
                else {
                    tds.push(<td key={index} style={tdsStyle}>{data[item.id]}</td>);
                }
            })
            let row = <tr key={trIndex}>{tds}</tr>
            dataRows.push(row);
        })

        var headData = [];
        headData.push(<th className="check-box" key="checkAll" style={boxStyle}><input type="checkbox" onChange={this.handleCheckAll.bind(this)}/></th>);
        items.map(function (item, index) {
            let style = Object.assign({}, headStyle, item.style || {});

            if (self.props.isMask && index === items.length -1) {
                headData.push(<th className="op-col" style={Object.assign({}, style, {visibility: 'visible'})} key={index}>{item.name}</th>)
            }
            else {
                headData.push(<th style={style} key={index}>{item.name}</th>)
            }
        })
        return (
            <div className={`list-table-wrap ${this.props.tableClass ? this.props.tableClass: ''}`}>
                <table
                    className="table table-bordered table-condensed table-striped table-hover"
                    style={{width: this.props.tableWidth}}>
                    <thead>
                        <tr>
                            {headData}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ListTable;


