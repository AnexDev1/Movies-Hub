import { useEffect, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRatings";
import ErrorMessage from "./ErrorMessage";
import { useKey } from "./custom effects/useKey";
const KEY = "1f896906";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [error, setError] = useState("");
  useKey("Escape", onCloseMovie);
  const {
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
    Released: released,
    Runtime: runtime,
    Title: title,
    Year: year,
    imdbRating,
    Poster: poster,
  } = movie;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      poster,
      year,
      title,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatchedMovie(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function GetMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("Something went wrong!");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Detail not Found!");
          setMovie(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      GetMovieDetails();
    },
    [selectedId],

    useEffect(
      function () {
        if (!title) return;
        document.title = `Movie| ${title}`;

        return function () {
          document.title = "MoviesHub";
        };
      },
      [title]
    )
  );
  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>{`You rated this Movie ${watchedUserRating} ⭐`}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
