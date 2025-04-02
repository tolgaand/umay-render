import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import HomeView from "./views/home";
import DemoView from "./views/demo";
import NotFoundView from "./views/NotFoundView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/demos" element={<DemoView />} />
        <Route path="/demos/:id" element={<DemoView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
