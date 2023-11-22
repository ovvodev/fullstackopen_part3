const express = require('express')
const app = express()

app.use(express.json())

let notes = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        i: 2,
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
    response.json(notes)
})

app.get('/info', (request, response) => {
    const howManyNotes = notes.length
    const timestamp = 1637551200000
    const date = new Date(timestamp)
    response.send(`<p>Phonebook has info for ${howManyNotes} people</p><p>${date}</p>`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)