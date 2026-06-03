import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

function Home() {

    const [selectedMovie, setSelectedMovie] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    
    const movies = [
        {
            id: 1,
            title: "Avengers Endgame",
            rating: 8.5
        },
        {
            id: 2,
            title: "Interstellar",
            rating: 9.0
        },
        {
            id: 3,
            title: "Inception",
            rating: 8.8
        }
    ];
    const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <>
      <Navbar />

      <div className="p-8">

        <h2 className="text-2xl font-bold mb-4">
          Selected Movie:
          {" "}
          {selectedMovie || "None"}
        </h2>
        <input
            type="text"
            placeholder="Search movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full mb-6"
            />

        <div className="flex gap-6 flex-wrap">

          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              rating={movie.rating}
              onBook={() => setSelectedMovie(movie.title)}
            />
          ))}

        </div>

      </div>
    </>
  );
}

export default Home;