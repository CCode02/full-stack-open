import Country from "./Country";

const Countries = ({ countries }) => {
    const numCountries = countries.length

    if (numCountries > 10) {
        return <div>Too many matches, specify another filter</div>
    }

    if (numCountries > 1) {
        return countries.map(countrie =>
            <div key={countrie.name.official}>{countrie.name.common}</div>
        )
    }

    if (numCountries === 1) {
        return <Country country={countries[0]} />
    }

    return null
}

export default Countries