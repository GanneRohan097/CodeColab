import React, { useState } from "react";
import { FaPlus, FaSignInAlt, FaUser, FaHashtag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [enteredId, setEnteredId] = useState();
  const navigate = useNavigate();
  const [join, setJoin] = useState(true);
  async function getId() {
    try {
      const res = await fetch("https://codecolab-e7rb.onrender.com/getId");
      const data = await res.json();
      setId(data.id);
      navigate(`/room/${data.id}`, {
        state: {
          name: adminName,
          isAdmin: true
        }
      });
    } catch (err) {
      console.log("Server error");
    }
  }
  function joinRoom() {
  
      navigate(`/room/${enteredId}`, {
        state: {
          name,
          isAdmin: false
        }
      });
    
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md grid md:grid-cols-2 overflow-hidden">
        <div className="p-8 border-b md:border-b-0 md:border-r">
          <h2 className="text-2xl font-semibold mb-2">Create Room</h2>

          <p className="text-gray-600 mb-6">
            Create a new room and share the room ID.
          </p>

          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={getId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2"
          >
            <FaPlus />
            Create Room
          </button>

          {id !== 0 && (
            <div className="mt-5 border rounded-md p-3 bg-gray-50 flex justify-between items-center">
              <span className="text-gray-700">Room ID</span>

              <div className="flex items-center gap-2 font-semibold">
                <FaHashtag />
                {id}
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-2">Join Room</h2>

          <p className="text-gray-600 mb-6">
            Enter the room ID shared by your friend.
          </p>

          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative mb-5">
            <FaHashtag className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="number"
              value={enteredId}
              onChange={(e) => setEnteredId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => joinRoom()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center gap-2">
            <FaSignInAlt />
            Join Room
          </button>
          {!(join) && <p className="text-red-600">Incorrect code</p>}
        </div>
      </div>
    </div>
  );
};