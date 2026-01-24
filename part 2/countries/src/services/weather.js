import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getCityWeather = (city) => {
    const request = axios.get(`${baseUrl}?q=${city}&appid=${apiKey}`)
    return request.then(response => response.data)
}

export default {
    getCityWeather
}