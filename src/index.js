const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function ChecksIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  repository = repositories.find((repository)=> repository.id === id);
  
  if (!repository)
  return response.status(404).json({ error: "Repository not found" });
  
  repositoryIndex = repositories.findIndex(repository => repository.id === id);
  request.repository = repository;
  request.id = repositoryIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", ChecksIfRepositoryExists, (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request;  

  const repository = { ...repositories[id], ...{title, url, techs} };

  repositories[id] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", ChecksIfRepositoryExists,(request, response) => {
  const {id} = request;

  repositories.splice(id, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", ChecksIfRepositoryExists, (request, response) => {
  const {id} = request;
  const likes = ++repositories[id].likes;
  return response.status(200).json({likes});
});

module.exports = app;
