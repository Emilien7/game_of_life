import React from 'react';
import Box from './Box'
import '../style.css';

export default class Field extends React.Component{

    render() {
        let rowsArr = [];
        let boxClass = "";
        let width = this.props.cols * 22;
        for (let i = 0; i < this.props.rows; i++) {
            for (let j = 0; j < this.props.cols; j++) {
                let boxId = i + "_" + j;
                boxClass = this.props.fieldFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        boxId={boxId}
                        row={i}
                        col={j}
                        selectBox={this.props.selectBox}
                    />
                )
            }
        }
        return(
            <div className={'field'} style={{width: width}}>
                {rowsArr}
            </div>
        )
    }
}