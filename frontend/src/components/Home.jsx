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
  const [loading, setLoading] = useState(false);
  const [roomNotFound, setRoomNotFound] = useState(false);
  async function getId(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(" https://codecolab-e7rb.onrender.com/getId");//http://localhost:7000/getId  https://codecolab-e7rb.onrender.com/getId
      const data = await res.json();
      setId(data.id);
      setLoading(false);
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
  async function joinRoom(e) {
    e.preventDefault();
    const res = await fetch(` https://codecolab-e7rb.onrender.com/join/${enteredId}`)
    const data = await res.json();
    if (data.success === true) {
      setRoomNotFound(false);
      navigate(`/room/${enteredId}`, {
        state: {
          name,
          isAdmin: false
        }
      });
    }
    else {
      setRoomNotFound(true);
    }


  }

  return (
    <div className="min-h-screen bg-[#0B1120] bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.12),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(251,191,36,0.10),transparent_35%)] flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 text-teal-400 font-mono text-sm tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            CodeColab
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-100 font-mono tracking-tight">
            &lt;/&gt; Code together
          </h1>
        </div>

        <div className="w-full bg-slate-200 rounded-2xl  border-slate-200 grid md:grid-cols-2 overflow-hidden">
          <div className="p-8 md:border-r border-slate-200 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-teal-500/0" />
            <h2 className="text-xl font-semibold mb-1 text-slate-900 flex items-center gap-2">
              <FaPlus className="text-teal-500 text-sm" />
              Create Room
            </h2>

            <p className="text-slate-500 text-sm mb-6">
              Create a new room and share the room ID.
            </p>
            <form onSubmit={getId}>
              <div className="relative mb-4">
                <FaUser className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>
              <div>

              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2 h-12 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
              >
                <FaPlus />

                Create Room
                {loading &&
                  <div className="relative bg-blac w-10 h-10  animate-spin [animation-duration:0.3s]">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full shadow-lg"></div>
                  </div>
                }
              </button>
            </form>

            {id !== 0 && (
              <div className="mt-5 border border-teal-500/30 rounded-lg p-3 bg-teal-50 flex justify-between items-center">
                <span className="text-slate-500 text-sm">Room ID</span>

                <div className="flex items-center gap-2 font-mono font-semibold text-teal-600">
                  <FaHashtag className="text-xs" />
                  {id}
                </div>
              </div>
            )}
          </div>
          <form onSubmit={joinRoom}>


            <div className="p-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-500/0" />
              <h2 className="text-xl font-semibold mb-1 text-slate-900 flex items-center gap-2">
                <FaSignInAlt className="text-amber-500 text-sm" />
                Join Room
              </h2>

              <p className="text-slate-500 text-sm mb-6">
                Enter the room ID shared by your friend.
              </p>

              <div className="relative mb-4">
                <FaUser className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>

              <div className="relative mb-5">
                <FaHashtag className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="number"
                  required
                  value={enteredId}
                  onChange={(e) => setEnteredId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>

              <button
                type="submit"
                required
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-12 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20">
                <FaSignInAlt />
                Join Room
              </button>
              {roomNotFound && <p className="text-red-500 text-sm mt-3 font-medium">Room not found</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};