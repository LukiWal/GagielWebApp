import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Game from './pages/Game';
import NoPage from './pages/NotPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  
        <Route index element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<NoPage />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
