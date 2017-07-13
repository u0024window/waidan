/**
 * 案件信息
 *
 */
import React from 'react';
import ListTable from '../../common/list-table/index.jsx';
import {relationMap} from '../../common/status2text.js';
import _ from 'lodash';

var concatItems = [
    {
        name: '联系人',
        id: 'contactNameTxt'
    },
    {
        name:'手机号',
        id: 'contactMobileTxt',
        style: {
            width: '150px'
        }
    },
    {
        name:'关系',
        id: 'relationTxt'
    }
];

class DebtorInfoRelation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: this.props.isEditing,
            concatData:  this.props.contactList
        }
    }
    getResult() {
        var r = [];
        var list = this.state.concatData || [];

        list.forEach(function (item) {
            r.push({
                relation: item['relation'],
                contactName: item['contactName'],
                contactMobile: item['contactMobile']
            })
        })

        return JSON.stringify(r);
    }
    checkPhone (item) {
        let phone = item['contactMobile'];
        let name = item['contactName'];
        
        if (name) {
            return phone && _.isNumber(+phone)
        }
        else {
            return (phone === '' || (phone && _.isNumber(+phone)));
        }
    }
    checkName (item) {
        let phone = item['contactMobile'];
        let name = item['contactName'];
        
        if (String(phone)){
            return name;
        }
        return true;
    }
    handleChange(index) {
        return (e) => {
            this.state.concatData[index][e.target.name] = e.target.value;
            this.setState({})
        }
    }
    getContactName(item, index) {
        let val = item['contactName'];
        return (
            <input
                style={!this.checkName(item) ? {border: '1px solid red'} : {}}
                name="contactName"
                onChange={this.handleChange(index)}
                type="text"
                value={val}
            />
        );
    }
    getContactMobile(item, index) {
        let val = item['contactMobile'];
        return (
            <input
                style={!this.checkPhone(item) ? {border: '1px solid red'} : {}}
                name="contactMobile"
                onChange={this.handleChange(index)}
                type="text"
                value={val}
            />
        );
    }
    filter(data) {
        var r = [];
        Object.keys(relationMap).forEach(function (relation) {
            let findItem = _.find(data, {'relation': relation});
            if (findItem) {
                r.push(findItem)
            }
            else {
                r.push({
                    relation: relation,
                    contactName: '',
                    contactMobile: ''
                })
            }
        });
        data = r;
        return data.map((item, index) => {
            item['relationTxt'] = <span className="wrap">{relationMap[item['relation']]}</span>;
            if (this.state.isEditing) {
                item['contactNameTxt'] = this.getContactName(item, index);
                item['contactMobileTxt'] = this.getContactMobile(item,  index);
            }
            else {
                let styleName = {};
                if (!this.checkName(item)) {
                    styleName = {border: "1px solid red"}
                    this.state.isException = true;
                }
                item['contactNameTxt'] = <span style={styleName} className="wrap">{item['contactName']}</span>;

                let stylePhone = {};
                if (!this.checkPhone(item)) {
                    stylePhone = {border: "1px solid red"}
                    this.state.isException = true;
                }
                item['contactMobileTxt'] = <span style={stylePhone} className="wrap">{item['contactMobile']}</span>;
            }
            return item;
        })
    }
    isException() {
        return this.state.isException ? true : false;
    }
    render() {
        this.state.concatData = this.filter(this.state.concatData || []);

        return (
            <div className="relation">
                <ListTable items={concatItems} data={this.state.concatData} />
            </div>
        );
    }
}
module.exports = DebtorInfoRelation;
