/**
 * 案件信息
 *
 */
import React from 'react';
import ColTable from './col-table-component.jsx';
import _ from 'lodash';

var addressItems = [
    {id: 'debtorSnAddressTxt', name: '户籍地址'},
    {id: 'debtorUsualAddressTxt', name: '居住地址'},
    {id: 'debtorCompanyAddressTxt', name: '工作地址'},
    {id: 'debtorEcAddressTxt', name: '电商地址'}
];

class DebtorInfoAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: this.props.isEditing,
            addressData: this.props.data || {},
            regions: this.props.regions || {}
        }

        this.provinceOptions = this.props.province.map(function (item) {
            return <option key={item.code} value={item.code}>{item.name}</option>
        });
        this.provinceOptions.unshift(<option key="" value=""></option>);
    }
    getResult() {
        var r = {
            debtorSnRegionId: this.state.addressData.debtorSnRegionId,
            debtorSnAddress: this.state.addressData.debtorSnAddress,
            debtorUsualAddressId: this.state.addressData.debtorUsualAddressId,
            debtorUsualAddress: this.state.addressData.debtorUsualAddress,
            debtorCompanyAddressId: this.state.addressData.debtorCompanyAddressId,
            debtorCompanyAddress: this.state.addressData.debtorCompanyAddress,
            debtorEcAddressId: this.state.addressData.debtorEcAddressId,
            debtorEcAddress: this.state.addressData.debtorEcAddress
        }

        return r;
    }
    getOptions(list) {
        list = list || [];
        var options = [];
        list.map(function (item) {
            options.push(<option key={item.code} value={item.code}>{item.name}</option>);
        });
        options.unshift(<option key="" value=""></option>);
        return options;
    }
    getRegion(code) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/api/region/queryByCode',
                type: 'POST',
                data: {
                    code: code
                },
                success: function(res) {
                    if (0 !== +_.get(res, 'error.returnCode')) {
                        alert(_.get(res, 'error.returnUserMessage'))
                        reject(res);
                    }
                    resolve(res.data);
                },
                error: function() {
                    reject('服务异常');
                }
            })
        })
    }
    checkInput(data, province, city, region, address) {
        if (address === 'debtorSnAddress') {
            return data[address];
        }
        if (!data[province] && !data[city] && !data[region]) {
            return true;
        }

        return data[address];
    }
    getDom(province, city, region, address) {
        var data = this.state.addressData;
        var warnStyle = {border: '1px solid red'};
        if ("" === data[province]) {
            data[city] = "";
        }
        if ("" === data[city]) {
            data[region] = "";
        }
        return (
            <div className="address-select">
                <select
                    name={province}
                    value={data[province]}
                    style={(data[address] && !data[province]) ? warnStyle : {}}
                    onChange={this.handleSelectChange.bind(this)}
                >
                {this.provinceOptions}
                </select>
                <select
                    name={city}
                    style={(data[address] && !data[city]) ? warnStyle : {}}
                    value={data[city]}
                    onChange={this.handleSelectChange.bind(this)}
                >
                {this.getOptions(this.state.regions[data[province]])}
                </select>
                <select
                    name={region}
                    style={(data[address] && !data[region]) ? warnStyle : {}}
                    value={data[region]}
                    onChange={this.handleChange.bind(this)}
                >
                {this.getOptions(this.state.regions[data[city]])}
                </select>
                <input
                    name={address}
                    type="text"
                    style={!this.checkInput(data, province, city, region, address) ? warnStyle : {}}
                    value={data[address]}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        )
    }
    handleChange (e) {
        this.state.addressData[e.target.name] = e.target.value;
        this.setState({})
    }
    handleSelectChange (e) {
        var selecedCode = e.target.value;
        this.state.addressData[e.target.name] = selecedCode;
        var self = this;
        console.log(self.state.regions);
        this.getRegion(selecedCode).then(function (data){
            console.log('region return', data);
            if ("" !== selecedCode) {
                self.state.regions[selecedCode] = data;
            }
            self.setState({
                regions: self.state.regions
            })
        })
    }
    filter(data) {
        if (this.state.isEditing) {
            data['debtorSnAddressTxt'] = this.getDom(
                "snProvince",
                'snCity',
                'debtorSnRegionId',
                'debtorSnAddress'
            );
            data['debtorUsualAddressTxt'] = this.getDom(
                'usualProvince',
                'usualCity',
                'debtorUsualAddressId',
                'debtorUsualAddress'
            );
            data['debtorCompanyAddressTxt'] = this.getDom(
                'companyProvince',
                'companyCity',
                'debtorCompanyAddressId',
                'debtorCompanyAddress'
            );
            data['debtorEcAddressTxt'] = this.getDom(
                'ecProvince',
                'ecCity',
                'debtorEcAddressId',
                'debtorEcAddress'
            );
        }
        else {
            var exceStyle = {border: "1px solid red"};
            var snStyle = {};
            var usualStyle = {};
            var companyStyle = {};
            var ecStyle = {};
            if (!data['debtorSnAddress'] || this.checkNull(data["snProvince"], data['snCity'], data['debtorSnRegionId'])) {
                snStyle = exceStyle;
                this.state.isException = true;
            }

            if (data['debtorUsualAddress'] && this.checkNull(data["usualProvince"], data['usualCity'], data['debtorUsualAddressId'])) {
                usualStyle = exceStyle;
                this.state.isException = true;
            }

            if (data['debtorCompanyAddress'] && this.checkNull(data["companyProvince"], data['companyCity'], data['debtorCompanyAddressId'])) {
                companyStyle = exceStyle;
                this.state.isException = true;
            }

            if (data['debtorEcAddress'] && this.checkNull(data["ecProvince"], data['ecCity'], data['debtorEcAddressId'])) {
                ecStyle = exceStyle;
                this.state.isException = true;
            }
            data['debtorSnAddressTxt'] = <span style={snStyle} className="wrap">{data['debtorSnAddress']}</span>;
            data['debtorUsualAddressTxt'] =  <span style={usualStyle} className="wrap">{data['debtorUsualAddress']}</span>;
            data['debtorCompanyAddressTxt'] = <span style={companyStyle} className="wrap">{data['debtorCompanyAddress']}</span>;
            data['debtorEcAddressTxt'] = <span style={ecStyle} className="wrap">{data['debtorEcAddress']}</span>;
        }
        return data;
    }
    checkNull(province, city, region) {
        return !province || !city || !region
    }
    isException () {
        return this.state.isException ? true : false;
    }
    render() {
        return (
            <ColTable
                items={addressItems}
                data={this.filter(this.state.addressData)}
                columnNum="1"
            />
        );
    }
}
module.exports = DebtorInfoAddress;
