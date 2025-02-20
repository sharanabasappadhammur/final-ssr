import "./App.css";
import CoffeeNewsFeeds from "./CoffeeNewsFeeds";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coffeenewsfeeds" element={<CoffeeNewsFeeds />} />
      {/* <Route path="/dashboard/coffeenews/:newsId" element={<NewsReadMore />} /> */}
    </Routes>
  );
}

export default App;
