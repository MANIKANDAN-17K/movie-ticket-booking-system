function Booking() {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white shadow-lg rounded-lg p-8 w-96">

        <h1 className="text-3xl font-bold mb-6">
          Book Ticket
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="number"
          placeholder="Number of Seats"
          className="border p-3 rounded w-full mb-4"
        />

        <button
          className="bg-blue-500 text-white w-full p-3 rounded"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  );
}

export default Booking;