import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="container page-space empty-state">
      <p className="eyebrow">404 · NOT ON THE MENU</p>
      <h1>A little lost?</h1>
      <p>Let’s get you back to something delicious.</p>
      <Link className="button" to="/menu">
        Explore the menu
      </Link>
    </div>
  );
}
