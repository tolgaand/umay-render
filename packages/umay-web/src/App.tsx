import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import HomeView from "./views/home";
import DemoView from "./views/demo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/demos" element={<DemoView />} />
        <Route path="/demos/:id" element={<DemoView />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
