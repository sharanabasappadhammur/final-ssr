import { Link } from "react-router";

// pages/Home.jsx
function Home() {
  return (
    <div>
      <h1>Home Page...........................</h1>
      <p>Welcome to the Vite + React app with routing!</p>
      <Link to={`/dashboard/coffeenews`}>Read more</Link>
    </div>
  );
}

export default Home;
