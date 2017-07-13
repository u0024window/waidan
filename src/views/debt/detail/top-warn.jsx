/**
 * 案件信息
 *
 */
import React from 'react';

const ADDRESS_ERROR_TXT = '案件地址信息错误';
const CONTACT_ERROR_TXT = '案件联系人信息错误';
const SUSPECTED_REPEAT_PRE = '案件疑似重复，涉及案件编号：';

class TopWarn extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let content = [];
        let data = this.props.data;

        data.addressError && content.push(ADDRESS_ERROR_TXT);
        data.contactError && content.push(CONTACT_ERROR_TXT);

        if (data.suspectedRepeat && data.suspectedRepeat.length > 0) {
            let debtUrlList = [];
            data.suspectedRepeat.forEach((item) => {
                if (data.readOnly) {
                    debtUrlList.push(`<span>${item.debtContract}</span>`)
                }
                else {
                    debtUrlList.push(`<a target="_blank" href="/debt/detail/${item.debtId}?readOnly=1">${item.debtContract}</a>`)
                }
            })
            content.push(SUSPECTED_REPEAT_PRE + debtUrlList.join('、'));
        }
        content = content.join('；');

        return (
            <div className="top-warn" style={{wordWrap: "break-word", wordBreak: "break-all"}}>
                {content &&
                    <div className="alert alert-danger" dangerouslySetInnerHTML={{__html: content}}></div>
                }
            </div>
        );
    }
}
module.exports = TopWarn;







