// pages/CoffeeNewsFeeds.jsx
import { Link } from "react-router-dom";

function CoffeeNewsFeeds() {
  const news = [
    { id: 200, title: "Coffee News #1", description: "Read more about coffee" },
    {
      id: 201,
      title: "Coffee News #2",
      description: "Read more about coffee culture"
    }
  ];

  return (
    <div>
      <h1>Coffee News Feeds</h1>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link to={`/dashboard/coffeenews?newsId=${item.id}`}>
              Read more
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoffeeNewsFeeds;
