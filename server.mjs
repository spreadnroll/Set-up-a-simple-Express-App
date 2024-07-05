import express from "express";
import morgan from "morgan";
import "express-async-errors";
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

let planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.get('/api/planets', (req, res) => {
    res.status(200).json(planets)
})

app.get("/api/planets/:id", (req, res) => {
    const {id} = req.params;
    const planteParseInt = parseInt(id, 10)
    const planet = planets.find(p => p.id === planteParseInt)
    if (planet) {
        res.status(200).json(planet);
    } else {
        res.status(404).json({ message: 'Planet not found' });
    }
});

let planetScheme = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
})

app.post('/api/planets', (req, res) => {
  const { error } = planetScheme.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id, name } = req.body;
  const newPlanet = { id, name };
  planets.push(newPlanet);

  res.status(201).json({ message: 'The Planet was created!', newPlanet });
});

app.put('/api/planets/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const planetId = parseInt(id, 10);
  planets = planets.map(p => p.id === planetId ? { ...p, name } : p);
  
  res.status(200).json({ message: 'Planet updated', planets });
});

app.delete('/api/planets/:id', (req, res) => {
  const { id } = req.params;

  const planetId = parseInt(id, 10);
  planets = planets.filter(p => p.id !== planetId);
  
  res.status(200).json({ message: 'Planet deleted', planets });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
