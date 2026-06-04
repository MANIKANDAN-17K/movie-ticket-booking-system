import { useLocation, Link } from "react-router-dom";

function Confirmation() {
  const location = useLocation();

  const booking = location.state;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-[450px]">

        <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
          Booking Successful �
        </h1>

        <div className="space-y-3">

          <p>
            <strong>Movie:</strong> {booking?.movie?.title}
          </p>

          <p>
            <strong>Name:</strong> {booking?.name}
          </p>

          <p>
            <strong>Email:</strong> {booking?.email}
          </p>

          <p>
            <strong>Seats:</strong> {booking?.seats}
          </p>

        </div>

        <Link
          to="/"
          className="block mt-6 bg-blue-500 text-white text-center p-3 rounded hover:bg-blue-600"
        >
          Back To Home
        </Link>

      </div>

    </div>
  );
}

export default Confirmation;