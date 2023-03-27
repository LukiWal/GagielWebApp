import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Game from './pages/Game';
import NoPage from './pages/NotPage';
import CreateGame from './pages/CreateGame';
import { generateId } from './helper/helperFunctions';
import { useEffect, useState } from "react";
import JoinGame from './pages/JoinGame';

function App() {
  const [sessionId, setSessionId] = useState(JSON.parse(localStorage.getItem('sessionId')));
    
  useEffect(() => {
      if(localStorage.getItem('sessionId') === null){
          const newId = generateId(10, true);
          setSessionId(newId);
          localStorage.setItem('sessionId', JSON.stringify(newId));
      }  
  }, []);

  return (
    <BrowserRouter>
      <Routes>
  
        <Route index element={<Home sessionId={sessionId}/>} />
        <Route path="/game" element={<Game sessionId={sessionId}/>} >
          <Route path=":roomId" element={<Game sessionId={sessionId} />} />
        </Route>
       
        <Route path="*" element={<NoPage sessionId={sessionId} />} />
        <Route path="/create" element={<CreateGame sessionId={sessionId} />}/>
        <Route path="/join" element={<JoinGame sessionId={sessionId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
