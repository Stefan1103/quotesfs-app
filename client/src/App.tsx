import "./sass/app.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RandomQuote from "./pages/RandomQuote";
import Error from "./pages/Error";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="randomQuote" element={<RandomQuote />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
