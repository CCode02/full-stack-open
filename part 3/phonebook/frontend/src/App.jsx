import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from "./components/Notification";

const App = () => {
  const messageTypes = {
    success: 'successMessage',
    error: 'errorMessage'
  }
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
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [messageType, setMessageType] = useState(messageTypes.success)

  const addNewName = (event) => {
    event.preventDefault()
    const personFinded = persons.find(person => person.name === newName)
    if (!personFinded) {
      const newPerson = { name: newName, number: newNumber }
      personsService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setFilteredPersons(persons.concat(returnedPerson).filter(person => person.name.toLowerCase().includes(filter)))
          setMessageType(messageTypes.success)
          setNotificationMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessageType(messageTypes.error)
          setNotificationMessage(error.response.data.error)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...personFinded, number: newNumber }
        personsService.update(changedPerson, changedPerson.id)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== changedPerson.id ? p : changedPerson))
            setFilteredPersons(filteredPersons.map(p => p.id !== changedPerson.id ? p : changedPerson))
            setMessageType(messageTypes.success)
            setNotificationMessage(`${returnedPerson.name} updated`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setPersons(persons.filter(p => p.id !== changedPerson.id))
            setFilteredPersons(filteredPersons.filter(p => p.id !== changedPerson.id))
            setMessageType(messageTypes.error)
            setNotificationMessage(`Information of '${changedPerson.name}' has already been removed from server`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
      }
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
          setMessageType(messageTypes.success)
          setNotificationMessage(`${deletedPerson.name} deleted`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} messageType={messageType}/>
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