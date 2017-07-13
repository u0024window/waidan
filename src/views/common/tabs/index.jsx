import React from 'react';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        var cur = this.props.active;
        var listData = this.props.listData || [];
        this.dom = [];

        listData.forEach((item, index) => {
            this.dom.push(<li className={index === cur ? 'active': ''}><a href={item.url}>{item.name}</a></li>);
        })
    }
    render() {
        return (
            <div className="tabs-wrap">
                {this.dom.length > 0 &&
                    <ul className="nav nav-tabs">
                        {this.dom}
                    </ul>
                }
            </div>
        );
    }
}
export default Tabs;
