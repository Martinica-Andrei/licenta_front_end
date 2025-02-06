import React, { useState, useEffect } from 'react'
import styles from '../css/RemovableFeature.module.css'

const RemovableFeature = ({ id, name, remove }) => {

    const [showCloseBtn, setShowCloseBtn] = useState(false)

    const mouseLeave = () => {
        setShowCloseBtn(false)
    }

    const mouseMove = () =>{
        if (showCloseBtn === false){
            setShowCloseBtn(true)
        }
    }

    return (
        <div className={styles['feature']}  onMouseLeave={mouseLeave} onMouseMove={mouseMove}>
            {showCloseBtn && <button className={styles['close-btn']} onClick={() => remove(id)}>X</button>}
            <p>{name}</p>
        </div>
    )
}

export default RemovableFeature