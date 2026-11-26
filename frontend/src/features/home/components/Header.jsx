import { LogOut, Moon, Search, Sun, Upload } from "lucide-react";
import { Link } from "react-router";
import "../styles/Header.scss";

export default function Header({
  search,
  onSearchChange,
  theme,
  onToggleTheme,
  user,
  onLogout,
  logoutError,
}) {
  const initial = user?.username?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <header className="topbar">
      <Link className="brand" to="/">Moodify<span className="brand__dot">.</span></Link>
      <div className="topbar__tagline">Mood Based Music Player</div>

      <label className="searchbox">
        <Search size={19} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search songs, artists..."
          aria-label="Search songs and artists"
        />
      </label>

      <Link className="upload-button" to="/upload" aria-label="Upload a song">
        <Upload size={17} />
        <span>Upload</span>
      </Link>

      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
      </button>

      <button className="logout-button" onClick={onLogout} aria-label="Log out" title="Log out">
        <LogOut size={18} />
        <span>Log out</span>
      </button>

      <span
        className="profile"
        role="img"
        aria-label={`${user?.username || "User"} profile`}
        title={user?.username || "User"}
      >
        <span>{initial}</span>
      </span>
      {logoutError && <span className="topbar__error" role="alert">{logoutError}</span>}
    </header>
  );
}
