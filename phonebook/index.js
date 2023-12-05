require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan('tiny'))

morgan.token('body',(request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :response-time[4] :body'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }

]


app.get('/api/persons' , (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })

})

app.get('/info', async (request, response, next) => {
  try {
    const howManyPersons = await Person.countDocuments().then(count => count)
    const timestamp = 1637551200000
    const date = new Date(timestamp)
    response.send(`<p>Phonebook has info for ${howManyPersons} people</p><p>${date}</p>`)
  } catch (error){
    next(error)
  }

})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

/*const generatedId = () => {
    const maxId = persons.reduce((max, person) => (person.id > max ? person.id : max), persons[0].id)
    return Math.floor(Math.random() * (maxId + 200))
} */

app.post('/api/persons',(request, response, next) => {
  const body = request.body

  const person = new Person ({

    name: body.name,
    number: body.number,
  })
  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'content is missing'
    })
  }
  else {
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
      .catch(error => next(error))
  }

})

app.put('/api/persons/:id',(request, response, next) => {
  const body = request.body

  const person = {

    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        // If the person with the specified ID is not found, return a 404 error
        response.status(404).end()
      }
    })
    .catch(error => next(error))


})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})