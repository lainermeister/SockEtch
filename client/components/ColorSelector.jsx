import React from 'react'

const ColorSelector = ({ setColor }) => {
    const palette = ['#F6F7EB', '#E94F37', '#393E41', '#3F88C5', '#44BBA4']
    return <div id="color-picker" >
        {palette.map((color) => {
            return <button key={color} className="color-buttons"
                style={{ backgroundColor: color }}
                onClick={() => setColor(color)} />
        })}
    </div>
}

export default ColorSelector