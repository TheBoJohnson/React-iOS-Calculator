import React from 'react'
import "./Button.css"

export default function Button(props) {
    return (
        <div onClick={props.pressHandler} className={`button ${props.type}-btn`} id={`the-${props.symbol}-btn`}>{props.symbol}</div>
    );
}