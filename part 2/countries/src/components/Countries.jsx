import Country from "./Country";

const Countries = ({ countries, handleShowContry }) => {
    const numCountries = countries.length

    

    if (numCountries > 10) {
        return <div>Too many matches, specify another filter</div>
    }

    if (numCountries > 1) {
        return countries.map(country =>
            <div key={country.name.official}>
                {country.name.common}
                <button onClick={() => handleShowContry(country.name.official)}>Show</button>
            </div>
        )
    }

    if (numCountries === 1) {
        return <Country country={countries[0]} />
    }

    return null
}

export default Countries