import { ArrowLeft, Home, Music2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import "./NotFound.scss";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <div className="not-found__card">
        <div className="not-found__mark" aria-hidden="true">
          <Music2 size={26} />
        </div>
        <p className="not-found__eyebrow">Lost in the playlist</p>
        <h1>404</h1>
        <h2>This page isn’t on the tracklist.</h2>
        <p className="not-found__description">
          The link may be out of tune, or the page may have moved.
        </p>
        <div className="not-found__actions">
          <button className="not-found__back" onClick={() => navigate(-1)}>
            <ArrowLeft size={17} />
            Go back
          </button>
          <Link className="not-found__home" to="/">
            <Home size={17} />
            Back to Moodify
          </Link>
        </div>
      </div>
    </main>
  );
}
