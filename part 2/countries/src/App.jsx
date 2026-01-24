import { useState, useEffect } from "react"
import countriesService from "./services/countries"
import Countries from "./components/Countries"
const App = () => {

  const [countryName, setCountryName] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  useEffect(() => {
    countriesService.getAll().then(allCountries => {
      setCountries(allCountries)
    })
  }, [])

  const handleCountryNameChange = (event) => {
    setCountryName(event.target.value)
    setCountriesToShow(countries.filter(c => c.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const handleShowContry = (officialName) => {
    setCountriesToShow(countries.filter(c => c.name.official === officialName))
  }

  return (
    <>
      <div>find countries <input onChange={handleCountryNameChange} value={countryName} /></div>
      <Countries countries={countriesToShow} handleShowContry={handleShowContry} />
    </>
  )
}

export default App
