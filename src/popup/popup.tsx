import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import WeatherCard from './WeatherCard'
import './popup.css'
import 'fontsource-roboto'
import { Grid, Box, InputBase, IconButton, Paper } from '@material-ui/core'
import { 
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@material-ui/icons'
import { setStoredCities, getStoredCitites, setStoredOptions, getStoredOptions, LocalStorageOptions } from '../utils/storage'
import { Messages } from '../utils/messages'


const App: React.FC<{}> = () => {
  
  const [cities, setCities] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>("")
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    getStoredCitites().then((cities) => {setCities(cities)})
    getStoredOptions().then((options) => {setOptions(options)})
  }, [])

  const handleCityButtonClick = () => {
    if (cityInput.length > 0) {
      const updatedCities = [...cities, cityInput]
      setStoredCities(updatedCities).then( () => {
        setCities(updatedCities)
        setCityInput("")
    })
    }
  }

  const handleOverlayButtonClick = () => {
    chrome.tabs.query(
      {
        active: true,
      }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(
            tabs[0].id, Messages.TOGGLE_OVERLAY
          )
        }
      }
    )
  }


  const handleCityDeleteButtonClick = ( index: number) => {
    cities.splice(index, 1)
    const updatedCities = [...cities]
    setStoredCities(updatedCities).then( () => {
      setCities(updatedCities)
    })
  } 

  const handleTempScaleButtonClick = () => {
    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale == 'metric' ? 'imperial' : 'metric'
    }
    setStoredOptions(updatedOptions).then( () => {
      setOptions(updatedOptions)
    })
  }

  if (!options) {
    return null
  }

  return (
      <Box mx="8px" my="16px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
        <Paper>
          <Box px='15px' py='5px'>
            <InputBase placeholder="Add a city" value={cityInput} onChange={(event) => setCityInput(event.target.value)}/>
            <IconButton onClick={handleCityButtonClick}>
              <AddIcon />
            </IconButton>
          </Box>
        </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale == 'metric' ? '°C' : '°F'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {
        options.homeCity != '' && 
        <WeatherCard city={options.homeCity} tempScale={options.tempScale}/>
      }
      {
        cities.map((city, index) => <WeatherCard 
        tempScale={options.tempScale} 
        city={city} key={index} onDelete={() => handleCityDeleteButtonClick(index)}/>)
      }
      <Box height='16px'/>
      </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
