import React from 'react'
import "./Screen.css"

export default function Screen(props) {
    return (
        <div className="screen">
            <h1>{props.currentValue}</h1>
        </div>
    );
}