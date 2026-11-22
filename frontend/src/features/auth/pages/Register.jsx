import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import "../styles/register.scss";
import { Link, useNavigate } from "react-router";
import "../../shared/styles/global.scss";
import { useAuth } from "../hooks/useAuth";
import {
  AudioLines,
  Mail,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Music2,
  Headphones,
  Sparkles,
} from "lucide-react";


const Register = () => {
  const { handleRegister, loading } = useAuth();
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    const result = await handleRegister({
      email: email.trim(),
      username: username.trim(),
      password,
    });

    // Navigate only when registration succeeds
    if (result === true) {
      navigate("/");
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.",
    );
  }
};


  return (
    <main className="register-page">
      {/* LEFT EDITORIAL SECTION */}
      <section className="register-visual">
        <header className="brand">
          <h2>
            Moodify<span>.</span>
          </h2>
          <div className="brand-divider" />
          <p>Mood Based Music Player</p>
        </header>

        <div className="visual-content">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            YOUR JOURNEY STARTS HERE
          </span>

          <h1>
            Find Your
            <br />
            Sound.
            <br />
            <span>Feel More.</span>
          </h1>

          <p className="visual-description">
            One account. Endless emotions.
            <br />
            Create your space, explore new
            <br />
            sounds and find your rhythm.
          </p>

          <div className="register-highlight">
            <Sparkles size={18} />
            <span>A soundtrack for every version of you.</span>
          </div>
        </div>

        {/* VINYL ARTWORK */}
        <div className="artwork">
          <div className="artwork-glow" />

          <div className="sunset-disc">
            <div className="disc-grooves">
              <div className="disc-label">
                <div className="sunset-sky">
                  <span className="moon">☾</span>
                  <div className="sunset-sun" />
                  <div className="mountains" />
                </div>
              </div>
            </div>
          </div>

          <div className="artwork-caption">
            <span>02 / YOUR SOUNDTRACK</span>
            <span>DISCOVER YOURSELF</span>
          </div>
        </div>

        {/* FLOATING CARD */}
        <div className="floating-mood-card">
          <div className="mood-card-icon">
            <Headphones size={21} />
          </div>

          <div>
            <span>YOUR PERSONAL MUSIC SPACE</span>
            <h4>Something feels different.</h4>
          </div>
        </div>

        {/* MINI PLAYER */}
        <div className="mini-player">
          <div className="mini-player-art">
            <Music2 size={25} />
          </div>

          <div className="mini-player-info">
            <span>YOUR NEXT FAVOURITE</span>
            <h4>Good Things Take Time</h4>
            <p>Let the music find you.</p>
          </div>

          <AudioLines className="player-wave" size={27} />
        </div>

        <div className="visual-footer">
          <span>DISCOVER YOUR SOUND.</span>
          <AudioLines size={19} />
          <span>LIVE YOUR MOOD.</span>
        </div>
      </section>

      {/* RIGHT REGISTER SECTION */}
      <section className="register-form-section">
        <div className="form-top-label">
          <span>JOIN THE EXPERIENCE</span>
          <span>
            MOODIFY <b>✳</b>
          </span>
        </div>

        <div className="form-container">
          <div className="form-heading">
            <div className="form-logo">
              <AudioLines size={27} />
            </div>

            <span className="form-eyebrow">CREATE YOUR ACCOUNT</span>

            <h2>
              Get Started<span>.</span>
            </h2>

            <p>Your music journey begins with you.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="register-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}
            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>

              <div className="input-wrapper">
                <Mail size={20} />

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* USERNAME */}
            <div className="form-group">
              <label htmlFor="register-username">Username</label>

              <div className="input-wrapper">
                <UserRound size={20} />

                <input
                  id="register-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="register-password">Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={20} />

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Registering..." : "Create Account"}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="form-divider">
            <span />
            <AudioLines size={25} />
            <span />
          </div>

          <p className="login-link">
            Already part of Moodify?
            <Link to="/login">
              Log In <ArrowRight size={15} />
            </Link>
          </p>
        </div>

        <div className="form-bottom-label">
          <span>MADE WITH MUSIC</span>
          <span>MOODIFY © 2026</span>
        </div>
      </section>
    </main>
  );
};

export default Register;
