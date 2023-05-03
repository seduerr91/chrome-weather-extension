import React, { useEffect, useState } from 'react'
import { fetchOpenWeatherData, OpenWeatherData, OpenWeatherTempScale } from '../utils/api'
import { Button, CardActions, Typography, Card, CardContent, Box } from '@mui/material'
import './WeatherCard.css'

const WeatherCardContainer: React.FC<{
    children: React.ReactNode
    onDelete?: () => void
}> = ({children, onDelete }) => { 
    return (
        <Box mx={'4px'} my={'16px'}>
            <Card>
                <CardContent>
                { children }
                </CardContent>
                { onDelete && 
                <CardActions>
                    <Typography className='weatherCard-body'><Button color='secondary' onClick={onDelete}>Delete</Button></Typography>
                </CardActions>
                }
            </Card>
        </Box>
        )
}

type WeatherCardState = "loading" | "error" | "ready"

const WeatherCard: React.FC<{ 
    city: string
    tempScale: OpenWeatherTempScale
    onDelete?: () => void
}> = ( { city, tempScale, onDelete }) => {
    
    const [cardState, setCardState] = useState<WeatherCardState>("loading")
    const [weatherData, setWeatherData] = useState<OpenWeatherData | any>(null)

    useEffect(() => {
        fetchOpenWeatherData(city, tempScale)
        .then((data) => {
        setWeatherData(data)
        setCardState("ready")
        })
        .catch((err) => {setCardState("error")})
    }, [city, tempScale])
    
    if (cardState == "error" || cardState == "loading") {
        return <WeatherCardContainer onDelete={onDelete}>
            <Typography className="weatherCard-title">{city}</Typography>
            <Typography className="weatherCard-body">
            {
                    cardState == "error" ? "Error: Could not retrieve weather data for this city." : "Loading..."
                }
            </Typography>
            </WeatherCardContainer>
    }

    return (
        <WeatherCardContainer onDelete={onDelete}>
            <Typography className="weatherCard-title">{weatherData.name}</Typography>
            <Typography className="weatherCard-body">Description: {weatherData.weather[0].description}</Typography>
            <Typography className="weatherCard-body">Temperature: {Math.round(weatherData.main.temp)}</Typography>
            <Typography className="weatherCard-body">Feels like: {Math.round(weatherData.main.feels_like)}</Typography>
        </WeatherCardContainer>
        )

}

export default WeatherCard