import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Switch,
  Card,
  CardContent,
  TextField,
  Grid,
  Typography,
  Box,
  Button
} from '@material-ui/core'
import 'fontsource-roboto'
import './options.css'
import { getStoredOptions, LocalStorageOptions, setStoredOptions } from '../utils/storage'

type FormState = 'ready' | 'saving'

const App: React.FC<{}> = () => {
  
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [formState, setFormState] = useState<FormState>('ready')

  useEffect(() => {
    getStoredOptions().then((options) => {setOptions(options)})
  }, [])
  
  const isFieldDisabled = formState === 'saving'

  const handleAutoOverlayChange  = ( hasAutoOverlay: boolean) => {
      setOptions({
        ...options,
        hasAutoOverlay: hasAutoOverlay
    })
  }

  const handleSaveButtonClick = () => {
    setFormState('saving')
    setStoredOptions(options).then( () => {
      setTimeout(() => {
        setFormState('ready')
      }, 1000)
    })
  }

  const handleHomeCityChange = (homeCity: string) => {
    setOptions({
      ...options, 
      homeCity: homeCity
    })
  }

  if (!options) {
    return null
  }

  return (
    <Box mx='10%' my='2%'>
      <Card>
      <CardContent>
        <Grid container direction='column' spacing={4}>
          <Grid item>
            <Typography variant='h5'>Weather Extension Options</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1'>Auto toggle overlay on webpage load</Typography>
              <Switch 
              color='primary'
              checked={options.hasAutoOverlay}
              onChange={(event, checked) => handleAutoOverlayChange(checked)}
              disabled={isFieldDisabled}
              />
          </Grid>
          <Grid item>
            <Typography variant='body1'>Home city name</Typography>
            <TextField disabled={isFieldDisabled} fullWidth placeholder="Enter a home city name" value={options.homeCity} onChange={event => handleHomeCityChange(event.target.value)}/>
          </Grid>
          <Grid item>
            <Button disabled={isFieldDisabled} variant="contained" color='primary' onClick={handleSaveButtonClick}>
              {formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
