import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import HomeView from "./views/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
