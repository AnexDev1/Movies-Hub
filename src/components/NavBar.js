export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
//Stateless Components (Presentational Component)
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>MoviesHub</h1>
    </div>
  );
}
