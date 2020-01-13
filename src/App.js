import React from 'react';
import Screen from "./Screen.js"
import Button from "./Button.js"
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenValue: 0,
      currentInput: 0,
      currentFunction: null,
      shouldBuffer: false,
      shouldClear: false,
      isFloat: 0
    };

    // Bind the Functions
    this.handleDigitPress = this.handleDigitPress.bind(this);
    this.handleFunctionPress = this.handleFunctionPress.bind(this);
    this.handleEqualPress = this.handleEqualPress.bind(this);
    this.handlePercentPress = this.handlePercentPress.bind(this);
    this.handleClearPress = this.handleClearPress.bind(this);
    this.handleDecimalPress = this.handleDecimalPress.bind(this);
  }

  doCalc() {
    // Returns the value of the current calculation and returns null if there is an error
    if (this.state.currentFunction === null) return null;

    const operation = this.state.currentFunction.innerText;

    // TODO: Have the calculator print "Error" when this happens
    if (this.state.screenValue === 0 && operation === "÷") return null

    let value = 0;

    switch (operation) {
      case "+":
        value = this.state.currentInput + this.state.screenValue;
        break;

      case "-":
        value = this.state.currentInput - this.state.screenValue;
        break;

      case "x":
        value = this.state.currentInput * this.state.screenValue;
        break;

      case "÷":
        value = this.state.currentInput / this.state.screenValue;
        break;
      default:
        value = 0;
    }

    return value;
  }

  handleDigitPress(e) {
    const targetText = e.target.innerText;

    if (!this.state.shouldBuffer) {
      if (this.state.currentFunction !== null && this.state.currentFunction.classList.contains("highlighted"))
        this.state.currentFunction.classList.remove("highlighted");

      if (this.state.isFloat === 0) {
        this.processDigitPress(targetText);
      } else {
        this.processFloatPress(targetText);
      }
    } else {
      // Unhiglight the button
      this.state.currentFunction.classList.remove("highlighted");

      // Update the screen and current input values if we should buffer the screenValue
      this.setState({currentInput: this.state.screenValue, screenValue: 0, shouldBuffer: false}, () => {
        if (this.state.isFloat === 0) {
          this.processDigitPress(targetText);
        } else {
          this.processFloatPress(targetText);
       }
      });
    }
  }

  processDigitPress(numString) {
    const digitValue = parseInt(numString, 10);

    const newValue = this.state.shouldClear ? digitValue: this.state.screenValue * 10 + digitValue;

    this.setState({screenValue: newValue, shouldClear: false});
  }

  processFloatPress(numString) {
    const digitValue = parseInt(numString, 10);
    const newValue = parseFloat(this.state.screenValue) + (digitValue * Math.pow(10, -1 * this.state.isFloat));

    this.setState({screenValue: newValue, isFloat: this.state.isFloat + 1});
  }

  handleFunctionPress(e) {
    if (this.state.shouldBuffer) return;

    const pressedFunction = e.target;

    // If a function had already been selected, do the calculation of what was on screen and the currentValue first
    if (this.state.currentFunction !== null) {
      const newScreen = this.doCalc();

      // Make sure the operation did not result in an error
      if (newScreen === null) {
        this.setState({screenValue: "Error", currentInput: 0, currentFunction: null, shouldBuffer: false, isFloat: 0});
        return;
      }

      pressedFunction.classList.add("highlighted");
      this.setState({screenValue: newScreen, currentInput: 0, currentFunction: pressedFunction, shouldBuffer: true, isFloat: 0});
    } else {
      // Highlight the function button that was pressed
      pressedFunction.classList.add("highlighted");

      // Set the current function to the correct one
      this.setState({currentFunction: pressedFunction, shouldBuffer: true, isFloat: 0});
    }
  }

  handleEqualPress(e) {
    if (this.state.currentFunction === null) return;

    const newScreen = this.doCalc();

    if (newScreen === null) {
      this.setState({screenValue: "Error", currentInput: 0, currentFunction: null, shouldBuffer: false, shouldClear: true, isFloat: 0});
    } else {
      this.setState({screenValue: newScreen, currentInput: 0, currentFunction: null, shouldBuffer: false, shouldClear: true, isFloat: 0});
    }
  }

  handleDecimalPress(e) {
    if (this.state.isFloat > 0) return;

    // When shouldBuffer is true save the current value of the screen
    if (this.state.shouldBuffer) {
      const oldScreen = this.state.screenValue;
      this.setState({screenValue: "0.", currentInput: oldScreen, shouldBuffer: false, isFloat: 1});
    } else {
      const newScreen = this.state.shouldClear ? "0." : this.state.screenValue + ".";
      this.setState({screenValue: newScreen, shouldClear: false, isFloat: 1});
    }
  }

  handleClearPress(e) {

    // If the clear button is pressed with a nonzero value on the screen, reset the screen value to 0 but keep the currentInput and highlight the function that was selected
    if (this.state.screenValue !== 0) {
      this.setState({screenValue: 0, isFloat: 0});

      if (this.state.currentFunction !== null)
        this.state.currentFunction.classList.add("highlighted");
    } else {
      // If the clear button is pressed with a zero value on the screen clear the currentInput and the currentFunction as well
      if (this.state.currentFunction !== null && this.state.currentFunction.classList.contains("highlighted"))
        this.state.currentFunction.classList.remove("highlighted");

      this.setState({currentInput: 0, currentFunction: null, shouldBuffer: false, isFloat: 0})
    }
  }

  handlePlusMinusPress(e) {
    if (this.state.screenValue === 0) return;

    this.setState({screenValue: -1 * this.state.screenValue});
  }

  handlePercentPress(e) {
    if (this.state.screenValue === 0) return;

    this.setState({screenValue: this.state.screenValue * Math.pow(10, -2), isFloat: this.state.isFloat + 2});

  }

  render() {
    return (
      <>
      <Screen currentValue={this.state.screenValue} />
      <div className="calc-body">
        <Button pressHandler={e => this.handleClearPress(e)} type="op" symbol={this.state.screenValue === 0 ? "AC" : "C"}/>
        <Button pressHandler={e => this.handlePlusMinusPress(e)}  type="op" symbol="±"/>
        <Button pressHandler={e => this.handlePercentPress(e)} type="op" symbol="%"/>
        <Button pressHandler={e => this.handleFunctionPress(e)} type="function" symbol="÷"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="7"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="8"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="9"/>
        <Button pressHandler={e => this.handleFunctionPress(e)} type="function" symbol="x"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="4"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="5"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="6"/>
        <Button pressHandler={e => this.handleFunctionPress(e)} type="function" symbol="-"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="1"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="2"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="3"/>
        <Button pressHandler={e => this.handleFunctionPress(e)} type="function" symbol="+"/>
        <Button pressHandler={e => this.handleDigitPress(e)} type="digit" symbol="0"/>
        <Button pressHandler={e => this.handleDecimalPress(e)} type="digit" symbol="."/>
        <Button pressHandler={e => this.handleEqualPress(e)} type="function" symbol="="/>
      </div>
      </>
    );
  }
}

export default App;