import React from 'react';
import css from './index.less';
import toFixed from '../../lib/toFixed.js';
import Decimal from 'decimal.js';

const INFINITE = 9999;
const ROW_MAX_NUM = 10;
const ROW_MIN_NUM = 1;
const REWARD_RATE_MAX = 100;
const REWARD_RATE_MIN = 0;

class RewardRateToOverdue extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.data) {
            this.list = JSON.parse(this.props.data);
        }
        else {
            this.list = [
                {
                    start: 1,
                    end: '',
                    rewardRate: '0.00',
                },
                {
                    start: '--',
                    end: '',
                    rewardRate: '0.00',
                },
                {
                    start: '--',
                    end: INFINITE,
                    rewardRate: '0.00',
                }
            ]
        }
        this.state = {
            list: this.list,
            max: this.props.max || ROW_MAX_NUM,
            min: this.props.min || ROW_MIN_NUM
        };
    }
    handleRateChange(idx) {
        return (e) => {
            var val = toFixed(e.target.value);
            this.list[idx].rewardRate = val;
            this.update();
        }
    }
    getResult() {
        this.state.list.map(function (item) {
            if (!isNaN(Number(item.rewardRate))) {
                item.rewardRate = new Decimal(item.rewardRate).toFixed(2);
            }
            item.end = Number(item.end);

            return item;
        })
        return JSON.stringify(this.state.list);
    }
    check() {
        var r = {
            error: {
                returnCode: 0,
                returnMessage: 'ok',
                returnUserMessage: "成功"
            },
            data: []
        }

        var list = this.state.list || [];

        if (list.length === 0) {
            r.error.returnCode = -1;
            r.data.push({
                row: -1,
                msg: '不能为空'
            })

            return r;
        }

        var last = list.length - 1;
        if (+list[last].end !== INFINITE) {
            r.error.returnCode = -1;
            r.data.push({
                row: last,
                msg: '最后阶段结束天数必须为无穷大9999'
            })

            return r;
        }

        var prevItem;
        var curItem;
        list.forEach(function (item, index) {
            prevItem = curItem;
            curItem = item;

            if (index === 0 && +curItem.start !==1 ) {
                r.error.returnCode = -1;
                r.data.push({
                    row: index,
                    msg: '阶段天数必须从1开始'
                })
                return r;
            }
            if (curItem.end === '' || curItem.start ==='' || curItem.start === '--') {
                r.error.returnCode = -1;
                r.data.push({
                    row: index,
                    msg: '阶段天数不能为空'
                })
                return r;
            }
            if (curItem.rewardRate === '') {
                r.error.returnCode = -1;
                r.data.push({
                    row: index,
                    msg: '奖金比率不能为空'
                })
                return r;
            }
            if (curItem.rewardRate !== '' && (+curItem.rewardRate < REWARD_RATE_MIN || +curItem.rewardRate > REWARD_RATE_MAX)) {
                r.error.returnCode = -1;
                r.data.push({
                    row: index,
                    msg: '奖金比率范围必须为0-100'
                })
                return r;
            }
            if (+curItem.end < +curItem.start) {
                r.error.returnCode = -1;
                r.data.push({
                    row: index,
                    msg: '阶段结束天数不能小于阶段开始天数'
                })
            }
            if (prevItem) {
                if (+prevItem.end > +curItem.start) {
                    r.error.returnCode = -1;
                    r.data.push({
                        row: index,
                        msg: '后一阶段开始天数必须大于前一阶段结束天数'
                    })
                }

                if (+prevItem.rewardRate >= +curItem.rewardRate) {
                    r.error.returnCode = -1;
                    r.data.push({
                        row: index,
                        msg: '后一阶段奖金比率须大于前一阶段奖金比率'
                    })
                }
            }
            if (r.error.returnCode === -1) {
                return r;
            }
        });

        return r;
    }
    resetVal() {
        var prevItem;
        var curItem;
        var lastIndex = this.list.length - 1;

        this.list.forEach(function (item, index) {
            prevItem = curItem;
            curItem = item;

            if (prevItem && prevItem.end !== '') {
                curItem.start = +prevItem.end + 1;
            }
            else if (prevItem && prevItem && prevItem.end === '') {
                curItem.start = '--';
            }
        });

        this.list[0].start = 1;
    }
    throttle (fn, delay) {
        var self = this;
        return (e) => {
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(()=> {
                fn.apply(self, args);
            }, delay);
        };
    }
    handleDayChange(idx) {
        return (e) => {
            var val = e.target.value;
            val = toFixed(val, 0);
            this.list[idx].end = val > INFINITE ? INFINITE : val;
            if (!this.isLast(idx)) {
                this.list[idx+1].start = +this.list[idx].end + 1;
            }
            this.resetVal();
            this.update();
        }
    }
    update() {
        this.setState({
            list: this.list
        })
    }
    isLast(idx) {
        return idx === this.list.length - 1;
    }
    handleDelRow(idx) {
        if (this.list.length === 1) {
            return ;
        }
        this.list.splice(idx, 1);
        this.resetVal();
        this.update();
    }
    handleAddRow(idx) {
        if (this.list.length === this.state.max) {
            return;
        }
        var sourceRow = this.list[idx];
        var newRow = {};
        Object.assign(newRow, sourceRow);

        if (sourceRow.end === '') {
            newRow.start = '--'
        }
        else {
            newRow.start = sourceRow.end + 1
        }

        this.list.splice(idx+1, 0, newRow);
        this.resetVal();
        this.update();
    }
    rowHandler(idx, opType) {
        switch(opType) {
            case 'add':
                this.handleAddRow(idx);
                break;
            case 'del':
                this.handleDelRow(idx);
                break;
        }
    }
    rateHandler(idx, opType) {
        if (opType === 'dim') {
            var val = Decimal.sub(this.list[idx].rewardRate, 1);
            if (val < 0) {
                val = this.list[idx].rewardRate;
            }
            this.list[idx].rewardRate = val;
        }

        if (opType === 'plus') {
            var val = Decimal.add(this.list[idx].rewardRate, 1);
            if (val > 100) {
                val = this.list[idx].rewardRate;
            }
            this.list[idx].rewardRate = val;
        }
        this.update();
    }
    render() {

        var rows = [];
        this.state.list.forEach((item, index) => {
            rows.push(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td><span className="start-num">{item.start}</span>天——<input
                                            value={item.end}
                                            onChange={this.handleDayChange(index)}
                                            className="form-control input-day"
                                            type="text" />天</td>
                    <td className="last-col">
                        <button
                            onClick={this.rateHandler.bind(this, index, 'dim')}
                            type="button"
                            className="btn btn-default btn-spin">-</button>
                        <div className="input-rate-wrap">
                            <input
                                value={item.rewardRate}
                                onChange={this.handleRateChange(index)}
                                className="input-rate form-control"
                                type="text" />
                            <span className="unit">%</span>
                        </div>
                        <button
                            onClick={this.rateHandler.bind(this, index, 'plus')}
                            type="button"
                            className="btn btn-default btn-spin">+</button>
                        <div className="btn-action-row-wrap">
                            <button
                                disabled={this.list.length === this.state.max || item.end == INFINITE}
                                onClick={this.rowHandler.bind(this, index, 'add')}
                                type="button"
                                className="btn-plus btn btn-default">添加阶段</button>
                            <button
                                disabled={this.list.length === this.state.min}
                                onClick={this.rowHandler.bind(this, index, 'del')}
                                type="button"
                                className="btn-dim btn btn-default">删除阶段</button>
                        </div>
                    </td>
                </tr>
            )
        })



        return (
            <div className="reward-rate-to-overdue">
                <div className="wrap add-row">
                    <table className="table table-bordered table-condensed table-striped">
                        <colgroup>
                            <col className="col-level"></col>
                            <col className="col-day-num"></col>
                            <col className="col-rate-num"></col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>阶段</th>
                                <th>逾期天数</th>
                                <th>奖金比例</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
module.exports = RewardRateToOverdue;
