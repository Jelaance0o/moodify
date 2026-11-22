import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import "../styles/login.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  AudioLines,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Music2,
  Heart,
  Play,
  Pause,
  Smile,
  Moon,
  Zap,
} from "lucide-react";

const Login = () => {
  const { handleLogin, loading } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);


   const submitHandler = async (e) => {
     e.preventDefault();

     await handleLogin({email, password});
     navigate("/")
   }; 



  return (
    <main className="login-page">
      {/* LEFT: EDITORIAL BRAND SECTION */}
      <section className="login-visual">
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
            YOUR MOOD. YOUR MUSIC.
          </span>

          <h1>
            Music for
            <br />
            Every <span>Mood.</span>
          </h1>

          <p className="visual-description">
            Every emotion deserves a soundtrack.
            <br />
            Discover music that understands
            <br />
            how you feel.
          </p>

          <div className="mood-tags">
            <span>
              <Smile size={15} /> Happy
            </span>
            <span>
              <Moon size={15} /> Calm
            </span>
            <span>
              <Zap size={15} /> Energetic
            </span>
          </div>
        </div>

        {/* DECORATIVE MUSIC ARTWORK */}
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
            <span>01 / FEEL THE MUSIC</span>
            <span>EST. FOR EVERY MOOD</span>
          </div>
        </div>

        {/* FLOATING MOOD CARD */}
        <div className="floating-mood-card">
          <div className="mood-card-icon">
            <Heart size={19} fill="currentColor" />
          </div>
          <div>
            <span>MADE FOR YOU</span>
            <h4>Music that feels right.</h4>
          </div>
        </div>

        {/* MINI MUSIC PLAYER */}
        <div className="mini-player">
          <div className="mini-player-art">
            <Music2 size={25} />
          </div>

          <div className="mini-player-info">
            <span>NOW PLAYING</span>
            <h4>Sunroof</h4>
            <p>Dazy & Nicky Youre</p>
          </div>

          <button type="button" className="mini-play">
            <Play size={18} fill="currentColor" />
          </button>
        </div>

        {/* DECORATIVE WAVEFORM */}
        <div className="visual-waveform">
          {Array.from({ length: 35 }).map((_, i) => (
            <span
              key={i}
              style={{
                height: `${12 + Math.abs(Math.sin(i * 0.65)) * 40}px`,
              }}
            />
          ))}
        </div>

        <div className="visual-footer">
          <span>LISTEN TO YOURSELF.</span>
          <AudioLines size={19} />
          <span>LIVE YOUR MOOD.</span>
        </div>
      </section>

      {/* RIGHT: LOGIN FORM */}
      <section className="login-form-section">
        <div className="form-top-label">
          <span>ALREADY A LISTENER?</span>
          <span>
            WELCOME BACK <b>✳</b>
          </span>
        </div>

        <div className="form-container">
          <div className="form-heading">
            <div className="form-logo">
              <AudioLines size={27} />
            </div>

            <span className="form-eyebrow">YOUR MUSIC SPACE</span>

            <h2>
              Welcome Back<span>.</span>
            </h2>

            <p>Your next favourite song is waiting.</p>
          </div>

          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>

              <div className="input-wrapper">
                <UserRound size={20} />

                <input
                  id="login-email"
                  type="text"
                  placeholder="Enter your email "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={20} />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/ForgotPassword">Forgot password?</Link>
            </div>

            <button type="submit" className="login-button">
              <span>Log In</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="form-divider">
            <span />
            <AudioLines size={25} />
            <span />
          </div>

          <p className="register-link">
            New to Moodify?
            <Link to="/Register">
              Create Account <ArrowRight size={15} />
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

export default Login;
