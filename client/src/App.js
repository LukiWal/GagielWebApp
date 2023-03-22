import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Game from './pages/Game';
import NoPage from './pages/NotPage';
import CreateGame from './pages/CreateGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  
        <Route index element={<Home />} />
        <Route path="/game" element={<Game />} >
          <Route path=":roomId" element={<Game />} />
        </Route>
       
        <Route path="*" element={<NoPage />} />
        <Route path="/create" element={<CreateGame/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
