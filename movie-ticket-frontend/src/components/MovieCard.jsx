function MovieCard({ title, rating, onBook }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 w-72">

      <div className="h-40 bg-gray-300 rounded mb-4 flex items-center justify-center">
        Poster
      </div>

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="text-gray-600">
        Rating: ⭐ {rating}
      </p>

      <button
        onClick={onBook}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Book Now
      </button>

    </div>
  );
}

export default MovieCard;