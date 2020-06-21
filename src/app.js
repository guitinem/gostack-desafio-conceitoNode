const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({message: 'Id not valid'});
  }

  return next();
};

function checkRepository(req, res, next) {
  const { id } = req.params;

  const repositoryId = repositories.findIndex(item => item.id == id);

  if(repositoryId < 0) {
    return res.status(404).json({message: 'Repository not found'});
  }
  res.locals.index = repositoryId;

  return next();
}

app.use('/repositories/:id', validateId, checkRepository);
app.use('/repositories/:id/like', validateId, checkRepository);


/**
 * Routes
 */
app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const {  title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { index }   = res.locals;
  const { title, url, techs } = req.body;

  const repository = {
    id: repositories[index].id,
    title,
    url,
    techs,
    likes: repositories[index].likes
  }

  repositories[index] = repository;

  return res.json(repository)
});

app.delete("/repositories/:id", (req, res) => {
  const { index } = res.locals;

  repositories.splice(index, 1);

  res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { index } = res.locals;
  
  repositories[index].likes += 1;
  res.json(repositories[index]);
});

module.exports = app;
