import React from 'react';
import Field from './Field';
import lodash from 'lodash';
import divWithClassName from "react-bootstrap/es/utils/divWithClassName";

export default class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            generation: 0,
            rows: 1,
            cols: 1,
            fieldFull: Array(this.rows).fill(Array(this.cols).fill(false)),
            savedFieldStates: []
        };

        this.selectBox = this.selectBox.bind(this);
        this.setFieldSize = this.setFieldSize.bind(this);
        this.handleRowsInput = this.handleRowsInput.bind(this);
        this.handleColsInput = this.handleColsInput.bind(this);
        this.seed = this.seed.bind(this);
        this.start = this.start.bind(this);
        this.startBtn = this.startBtn.bind(this);
        this.pauseBtn = this.pauseBtn.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);

        this.rows = 0;
        this.cols = 0;
        this.currentFieldState = null;
        this.currentGeneration = null;
        this.saves = [];
        this.genSaves = [];
        this.fieldCopyArr = [];
    }

    // Выбор клетки
    selectBox(row, col) {
        let fieldCopy = arrayClone(this.state.fieldFull);
        fieldCopy[row][col] = !fieldCopy[row][col];
        this.setState({
            fieldFull: fieldCopy
        })
    };

    // Сохранение размеров поля
    handleRowsInput(e) {
        this.setState({
            rows: +e.target.value,
            fieldFull: Array(this.state.rows).fill(Array(this.state.cols).fill(false))
        })
    }

    handleColsInput(e) {
        this.setState({
            cols: +e.target.value
        })
    }

    // Отрисовка поля
    setFieldSize() {
        this.rows = this.state.rows;
        this.cols = this.state.cols;

        this.setState({
            fieldFull: Array(this.rows).fill(Array(this.cols).fill(false))
        })
    }

    // Начало игры
    startBtn() {
        this.intervalId = setInterval(this.start, 500);
    }

    pauseBtn() {
        clearInterval(this.intervalId);
    }

    // Логика игры
    start() {
        let field = this.state.fieldFull;
        let fieldCopy = arrayClone(field);
        let fieldArr = [];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0;
                if (i > 0) {
                    if (field[i - 1][j]) {
                        count++;
                    }
                }

                if (i > 0 && j > 0) {
                    if (field[i - 1][j - 1]) {
                        count++;
                    }
                }

                if (i > 0 && j < this.cols - 1) {
                    if (field[i - 1][j + 1]) {
                        count++;
                    }
                }

                if (j < this.cols - 1) {
                    if (field[i][j + 1]) {
                        count++;
                    }
                }

                if (j > 0) {
                    if (field[i][j - 1]) {
                        count++;
                    }
                }

                if (i < this.rows - 1) {
                    if (field[i + 1][j]) {
                        count++;
                    }
                }

                if (i < this.rows - 1 && j > 0) {
                    if (field[i + 1][j - 1]) {
                        count++;
                    }
                }

                if (i < this.rows - 1 && j < this.cols - 1) {
                    if (field[i + 1][j + 1]) {
                        count++;
                    }
                }

                if (field[i][j] && (count < 2 || count > 3)) {
                    fieldCopy[i][j] = false;
                }

                if (!field[i][j] && count === 3) {
                    fieldCopy[i][j] = true;
                }
                fieldArr.push(fieldCopy[i][j]);
            }
        }

        // Условия конца игры
        if (this.fieldCopyArr.some(e => lodash.isEqual(e, fieldCopy))) {
            clearInterval(this.intervalId);
        }
        this.fieldCopyArr.push(fieldCopy);
        this.setState({
            fieldFull: fieldCopy,
            generation: this.state.generation + 1
        });
        if (lodash.isEqual(this.state.fieldFull, field)) {
            clearInterval(this.intervalId);
        }
        if (fieldArr.every((e) => e === false)) {
            clearInterval(this.intervalId);
        }
    }

    // Рандомное распределение клеток
    seed() {
        let fieldCopy = arrayClone(this.state.fieldFull);
        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.cols; j++) {
                if (Math.floor(Math.random() * 4) === 1) {
                    fieldCopy[i][j] = true;
                }
            }
        }
        this.setState({
            fieldFull: fieldCopy
        })
    }

    save() {
        this.currentFieldState = this.state.fieldFull;
        this.currentGeneration = this.state.generation;
        this.saves.push(this.currentFieldState);
        this.genSaves.push(this.currentGeneration);
        this.setState({
            savedFieldStates: this.saves
        });
    }

    load() {
        this.setState({
            fieldFull: this.saves[select.selectedIndex - 1],
            generation: this.genSaves[select.selectedIndex - 1]
        })
    }

    render(){
        return(
            <div>
                <h1 className={'header'}>Game of Life</h1>
                <div className={'inputs'}>
                    <div>
                        <label htmlFor={'rows'}>Rows</label>
                        <input type="text" name={'rows'} onChange={ e => this.handleRowsInput(e) }/>
                    </div>
                    <div>
                        <label htmlFor={'cols'}>Cols</label>
                        <input type="text" name={'cols'} onChange={ e => this.handleColsInput(e) }/>
                    </div>

                </div>
                <div className={'buttons'}>
                    <button onClick={this.setFieldSize}>Ok</button>
                    {this.rows !== 0 && this.rows !== 0 &&
                        <div>
                            <button onClick={this.startBtn}>Start</button>
                            <button onClick={this.pauseBtn}>Pause</button>
                            <button onClick={this.seed}>Seed</button>
                            <button onClick={this.save}>Save</button>
                            <select id="select" defaultValue={'Load'} onChange={this.load}>
                                <option value="Load" disabled>Load</option>
                                {
                                    this.state.savedFieldStates.map((state, i) => {
                                        const desc = 'Save ' + ++i;
                                        return(
                                            <option value={i} key={i}>{desc}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    }

                </div>
                <Field
                    fieldFull={this.state.fieldFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />
                <div className={'generation'}>Generation: {this.state.generation}</div>
            </div>
        )
    }
}

// Копирование массива
function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}