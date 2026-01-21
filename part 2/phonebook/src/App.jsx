import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import axios from 'axios'

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    personsService.getAll().then(initialState => {
      setPersons(initialState)
      setFilteredPersons(initialState)
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)

  const addNewName = (event) => {
    event.preventDefault()

    if (!persons.find(person => person.name === newName)) {
      const newPerson = { name: newName, number: newNumber }
      personsService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setFilteredPersons(persons.concat(returnedPerson).filter(person => person.name.toLowerCase().includes(filter)))
        })
    } else {
      alert(`${newName} is already added to phonebook`)
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    const filtered = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setFilteredPersons(filtered)
  }

  const handleDeletePerson = (id) => {
    const personDelete = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${personDelete.name}?`)) {
      personsService.deletePerson(id)
        .then(deletedPerson => {
          setPersons(persons.filter(p => p.id !== id))
          setFilteredPersons(filteredPersons.filter(p => p.id !== id))
          alert(`${deletedPerson.name} deleted`)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addNewName={addNewName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={filteredPersons} handleDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App