import React, { useEffect, useState } from 'react'
import { getStoredOptions, LocalStorageOptions } from '../utils/storage'
import ReactDOM from 'react-dom'
import WeatherCard from '../components/WeatherCard'
import { Card } from '@material-ui/core'
import { Messages } from '../utils/messages'
import './contentScript.css'

const App: React.FC = () => {
    
    const [options, setOptions] = useState<LocalStorageOptions | null>(null)
    const [isActive, setIsActive] = useState<boolean>(false)
    
    useEffect(() => {
        getStoredOptions().then((options) => {
            setOptions(options)
            setIsActive(options.hasAutoOverlay)
        })
    }, [])

    useEffect(() => { 
        chrome.runtime.onMessage.addListener((message) => {
            if (message === Messages.TOGGLE_OVERLAY) {
                setIsActive(!isActive)
            }
        })
    }, [isActive])

    if (!options) {
        return null
    }

    return (
        <>
        {
        isActive &&
        <Card className="overlayCard">
            <WeatherCard city={options.homeCity} tempScale={options.tempScale} 
            onDelete={() => setIsActive(false)}/>
        </Card>
        }
        </>
    )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)