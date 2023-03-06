const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at https://localhost:3000/");
    });
  } catch (error) {
    console.log(`DATABASE ERROR : ${error}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectIntoResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};
// ALL MOVIES API;
app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT * 
    FROM
    movie;`;

  const getALLMoviesList = await db.all(getMovieQuery);
  response.send(
    getALLMoviesList.map((eachMovies) => {
      return convertDbObjectIntoResponseObject(eachMovies);
    })
  );
});
// ONE MOVIE DETAILS API;
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieDetails = `
    SELECT *
    FROM
    movie
    WHERE movie_id = ${movieId};`;

  const movieDetails = await db.get(getMovieDetails);
  response.send(convertDbObjectIntoResponseObject(movieDetails));
});

//POST MOVIE API;
app.post("/movies/", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;

  const addMoviesQuery = `
    INSERT INTO
    movie (director_id,movie_name,lead_actor)
    VALUES (${directorId}, '${movieName}', '${leadActor}');`;

  await db.run(addMoviesQuery);
  response.send("Movie Successfully Added");
});
//PUT API;
app.put("/movies/:movieId", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;
  const { movieId } = request.params;
  const putQuery = `
    UPDATE 
    movie 
    SET ( movie_id , director_id , movie_name ,lead_actor)
    VALUES (${movieId}, ${directorId},'${movieName}','${leadActor}');`;

  await db.run(putQuery);
  response.send("Movie Details Updated");
});

//DELETE MOVIE API;
app.delete("/movies/:moviesId", async (request, response) => {
  const { moviesId } = request.params;
  const deleteMovie = `
    DELETE FROM
    movie
    WHERE movie_id = ${moviesId};`;

  await db.run(deleteMovie);
  response.send("Movie Removed");
});

//ALL DIRECTORS API;

const convertDirectorDbObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const getDictory = `
    SELECT * 
    FROM 
    director;
    `;
  const allDirectories = await db.all(getDictory);
  response.send(
    allDirectories.map((eachDirect) => {
      return convertDirectorDbObjectToResponseObject(eachDirect);
    })
  );
});

//DIRECTOR MOVIES API;

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieNameOfDirector = `
    SELECT movie_name
    FROM movie
    WHERE director_id = ${directorId}`;

  const allMovienae = await run.all(getMovieNameOfDirector);
  response.send(
    allMovienae.map((eachmoviename) => {
      ({ movieName: eachmoviename.movie_name });
    })
  );
});

module.exports = app;
