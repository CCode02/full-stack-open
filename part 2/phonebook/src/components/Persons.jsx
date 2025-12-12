import Person from './Person'

const Persons = ({ personsToShow }) =>
    personsToShow.map(person =>
        <Person key={person.name} person={person} />
    )

export default Persons