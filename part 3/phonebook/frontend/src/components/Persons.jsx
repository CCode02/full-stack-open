import Person from './Person'

const Persons = ({ personsToShow, handleDeletePerson }) =>
    personsToShow.map(person =>
        <Person key={person.name} person={person} handleDeletePerson={() => handleDeletePerson(person.id)} />
    )

export default Persons