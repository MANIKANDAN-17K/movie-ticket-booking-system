import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState("");

  const handleSubmit = () => {
    const bookingData = {
      movie,
      name,
      email,
      seats,
    };

    console.log(bookingData);

    navigate("/confirmation", {
      state: bookingData,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-8 w-96">

        <h1 className="text-3xl font-bold mb-6">
          Book Ticket
        </h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Selected Movie
          </h2>

          <p className="text-gray-600">
            {movie?.title}
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="number"
          placeholder="Number of Seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full p-3 rounded"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  );
}

export default Booking;