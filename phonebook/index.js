const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


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
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }

]


app.get('/api/persons' , (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const howManyPersons = Object.keys(persons).length
    const timestamp = 1637551200000
    const date = new Date(timestamp)
    response.send(`<p>Phonebook has info for ${howManyPersons} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    }else {
        response.status(404).end()
      } 
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end() 
})

const generatedId = () => {
    const maxId = persons.reduce((max, person) => (person.id > max ? person.id : max), persons[0].id)
    return Math.floor(Math.random() * (maxId + 200))
} 

app.post('/api/persons',(request, response) => {
    const body = request.body
    
    const person = {
        id: generatedId(),
        name: body.name,
        number: body.number,
    }
    if(!body.name || !body.number){
        return response.status(400).json({
            error: "content is missing"
          })
    } else if(persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
          })
    } 
    else {
        persons = persons.concat(person)
        response.json(person)
    }
    
})



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});