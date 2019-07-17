import React from 'react';

export default class Box extends React.Component{
    constructor(props) {
        super(props);
        this.selectBox = this.selectBox.bind(this);
    }

    selectBox() {
        this.props.selectBox(this.props.row, this.props.col)
    };
    render() {
        return(
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        )
    }
}