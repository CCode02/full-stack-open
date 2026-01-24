import { useState, useEffect } from "react"
import weatherService from "../services/weather"

const CapitalWeather = ({ weather }) => {
    return (
        <div>
            <div>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</div>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather.description} />
            <div>Wind {weather.wind.speed} m/s</div>
        </div>
    )
}

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        weatherService.getCityWeather(country.capital)
            .then(returnedWeather => {
                setWeather(returnedWeather)
            })
    }, [])


    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>Capital {country.capital}</div>
            <div>Area {country.area}</div>
            <h1>Languages</h1>
            <ul>
                {Object.values(country.languages).map(language =>
                    <li key={language}>{language}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <h1>Weather in {country.capital}</h1>
            {weather ? <CapitalWeather weather={weather} /> : null}
        </div>
    )
}

export default Country