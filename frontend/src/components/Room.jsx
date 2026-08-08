import React, { useState, useEffect } from "react";
import { FaCode, FaHashtag } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
const Room = () => {
    const { id } = useParams();
    const socket = useRef(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.name;
    const isAdmin = state?.isAdmin;
    const [language, setLanguage] = useState("javascript");
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("// Start coding...");
    const [leavingUser, setLeavingUser] = useState("");
    const [langChangedUser, setLangChangedUser] = useState("");
    //Without DB how data is sharing?
    //The data is not being stored anywhere. It is only living in your server's RAM
    useEffect(() => {
        socket.current = new WebSocket("wss://codecolab-e7rb.onrender.com/");//ws://localhost:7000/  wss://codecolab-e7rb.onrender.com/
        socket.current.onopen = () => {
            console.log("Connected to server");
            //socket.send("Hello server..");
            //Now the browser will send the text "Hello Server" immediately after connecting.
            socket.current.send(
                JSON.stringify({
                    type: "join-room",
                    roomId: id,
                    username: userName
                })
            );
        }
        //immediately after new WebSocket(...), the connection may not be ready yet, and you'll get an error
        // so onopen tells you "The connection is established. You can now communicate."

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if (data.type === "participants") {
                setParticipants(data.users);
            }
            //console.log(participants)
            if (data.type === "code-change") {
                setCode(data.code);
            }
            if (data.type === "leaving-room") {
                setLeavingUser(data.username);
                setTimeout(() => {
                    setLeavingUser("");
                }, 8500);
            }
            if (data.type === "change-lang") {
                setLanguage(data.lang);
                setLangChangedUser(data.username)
                setTimeout(() => {
                    setLangChangedUser("");
                }, 2500);
            }
        }
        // ⬆️ receives msg from server
        return () => {
            socket.current.close();
        };
    }, []);
    async function leave() {
        setLoading(true);
        socket.current.send(
            JSON.stringify({
                type: "leave-room",
                roomId: id,
                username: userName
            })
        );
        setTimeout(() => {
            socket.current.close();
        }, 300);
        setTimeout(() => {
            setLoading(false);
            navigate("/");
        }, 9000);
    }
    async function changeLang(e) {
        setLanguage(e.target.value);
        socket.current.send(
            JSON.stringify({
                type: "change-lang",
                lang: e.target.value,
                username: userName,
                roomId: id
            })
        )


    }
    return (
        <div className="min-h-screen bg-blue-100">
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg p-5 flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Code Colab</h1>
                        {isAdmin && <p>{userName}</p>}
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md">
                        <FaHashtag />
                        <span className="font-semibold">{id}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <FaCode className="text-blue-600" />
                        <span className="font-medium hidden md:block">Language</span>

                        <select
                            value={language}
                            onChange={(e) => changeLang(e)}
                            className="border rounded-md px-3 py-2 outline-none"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        {/* <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
                            Run
                        </button> */}

                        <button
                            onClick={() => leave()}
                            className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-md"
                        >

                            {loading ? <div className="relative bg-blac w-10 h-10  animate-spin [animation-duration:0.3s]">
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-full shadow-lg"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                            </div>
                                : "Leave Room"}
                        </button>
                    </div>
                </div>
                {leavingUser && (
                    <div className="flex bg-yellow-500 border border-yellow-300 font-semibold px-4 py-1  rounded mb-4 animate-pulse">
                        {(leavingUser === userName) ? "You" : <p className="mr-1">{leavingUser} is</p>} leaving the room...
                    </div>
                )}
                {langChangedUser && (
                    <div className="flex bg-blue-500 border font-semibold px-4 py-1  rounded mb-4 animate-pulse">
                        {(langChangedUser === userName) ? "You" : <p className="mr-1">{langChangedUser}</p>} changed language to {language}
                    </div>
                )}
                <div className="sm:flex w-[100%]">
                    <div className="rounded-lg overflow-hidden h-[67vh] mb-4 w-[100%]">
                        <Editor
                            height="100%"
                            language={language}
                            theme="blue-dark"
                            beforeMount={handleEditorWillMount}
                            value={code}
                            onChange={(value) => {
                                const newCode = value || "";
                                setCode(newCode);

                                socket.current.send(
                                    JSON.stringify({
                                        type: "code-change",
                                        roomId: id,
                                        code: newCode
                                    })
                                );
                            }}

                        />
                    </div>
                    <div className="bg-white rounded-r-lg p-5 mb-6 sm:w-[30%]">
                        <h2 className="text-lg font-semibold mb-4">
                            Participants ({participants.length})
                        </h2>

                        <div className="space-y-3 h-[51vh] overflow-y-scroll">
                            {participants.map((participant, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {participant.charAt(0).toUpperCase()}
                                        </div>

                                        <span className="font-medium text-gray-800 hidden lg:block ">
                                            {participant}
                                        </span>
                                    </div>

                                    {participant === userName && (
                                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            You
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#0F172A] rounded-lg p-4">
                        <h2 className="text-white font-semibold mb-3">Input</h2>

                        <textarea
                            placeholder="Enter custom input..."
                            className="w-full h-40 bg-[#1E293B] text-white rounded-md p-3 resize-none outline-none"
                        />
                    </div>

                    <div className="bg-[#0F172A] rounded-lg p-4">
                        <h2 className="text-white font-semibold mb-3">Output</h2>

                        <pre className="h-40 bg-[#1E293B] text-green-400 rounded-md p-3 overflow-auto">
                            Output will appear here...
                        </pre>
                    </div>
                </div> */}
            </div>
        </div>
    );

    function handleEditorWillMount(monaco) {
        monaco.editor.defineTheme("blue-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#0F172A",
                "editor.foreground": "#E2E8F0",
                "editorLineNumber.foreground": "#64748B",
                "editorCursor.foreground": "#38BDF8",
                "editor.selectionBackground": "#1D4ED8AA",
                "editor.inactiveSelectionBackground": "#1E3A8A66",
                "editor.lineHighlightBackground": "#1E293B",
            },
        });
    }
};

export default Room;