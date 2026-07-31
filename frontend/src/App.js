import { Home } from "./components/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Room from "./components/Room";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/room/:id" element={<Room/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
