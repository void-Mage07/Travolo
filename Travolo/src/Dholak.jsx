import { useEffect, useRef, useState } from "react";
import "./Dholak.css";

export default function Dholak({ onBack, onEarnXP , onComplete}) {
  const audioContextRef = useRef(null);

  const [leftHit, setLeftHit] = useState(false);
  const [rightHit, setRightHit] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
const xpAwarded = useRef(false);
useEffect(() => {
  if (gameCompleted && !xpAwarded.current) {
    xpAwarded.current = true;

    // Give 20 XP to the main Travolo XP system
    onEarnXP?.(20);

    // Tell App.jsx that the Dholak challenge is complete
    onComplete?.();
  }
}, [gameCompleted, onEarnXP, onComplete]);

  // Create AudioContext only after user interaction
  const getAudioContext = async () => {
  if (!audioContextRef.current) {
    audioContextRef.current = new (
      window.AudioContext || window.webkitAudioContext
    )();
  }

  const ctx = audioContextRef.current;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  return ctx;
};
  // Deep bass dholak sound
  const playBass = async () => {
    if (gameCompleted) return;
  const ctx = await getAudioContext();

  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(140, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    55,
    now + 0.2
  );

  gain.gain.setValueAtTime(0.9, now);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    now + 0.3
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.3);

  animateHit("left");

  setScore((prev) => {
    const newScore = prev + 10;

    if (newScore >= 100) {
      setGameCompleted(true);
    }

    return newScore;
  });
};

  // Higher pitched dholak sound
  const playTreble = async () => {
    if (gameCompleted) return;
  const ctx = await getAudioContext();

  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "triangle";

  oscillator.frequency.setValueAtTime(300, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    130,
    now + 0.15
  );

  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    now + 0.2
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.2);

  animateHit("right");

  setScore((prev) => {
    const newScore = prev + 10;

    if (newScore >= 100) {
      setGameCompleted(true);
    }

    return newScore;
  });
};

  // Visual animation when drum is hit
  const animateHit = (side) => {
    if (side === "left") {
      setLeftHit(true);

      setTimeout(() => {
        setLeftHit(false);
      }, 120);
    } else {
      setRightHit(true);

      setTimeout(() => {
        setRightHit(false);
      }, 120);
    }
  };

  // Keyboard controls
  useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.repeat) return;

    if (event.key.toLowerCase() === "a") {
      playBass();
    }

    if (event.key.toLowerCase() === "d") {
      playTreble();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, []);

  return (
    <div className="dholak-page">

      {/* Top bar */}
      <header className="dholak-header">
        <button className="dholak-back" onClick={onBack}>
          ← Back to Map
        </button>

        <div className="dholak-title">
          <span>🥁</span>
          <div>
            <h1>Play the Dholak</h1>
            <p>Make some Rajasthani rhythm!</p>
          </div>
        </div>

        <div className="dholak-stats">
          <div>
          <b>+20 XP</b>
          <span>XP Reward</span>
         </div>

          <div>
            🎵
            <b>{score}</b>
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="dholak-instructions">
        <h2>🥁 Let's Play!</h2>

        <p>
          Tap the drum heads or use your keyboard.
        </p>

        <div className="key-hints">
          <span>
            <kbd>A</kbd> Deep Beat
          </span>

          <span>
            <kbd>D</kbd> High Beat
          </span>
        </div>
      </div>

      {/* Instrument */}
      <main className="dholak-stage">

        <div className="dholak-body">

          {/* Left drum head */}
          <button
            className={`drum-head left-head ${
              leftHit ? "hit" : ""
            }`}
            onPointerDown={playBass}
            aria-label="Play deep dholak beat"
          >
            <div className="head-inner">
              <span>BOOM</span>
              <small>Deep Beat</small>
            </div>
          </button>

          {/* Drum body */}
          <div className="drum-middle">
            <div className="rope rope-one"></div>
            <div className="rope rope-two"></div>
            <div className="rope rope-three"></div>

            <div className="drum-decoration">
              ✦
            </div>
          </div>

          {/* Right drum head */}
          <button
            className={`drum-head right-head ${
              rightHit ? "hit" : ""
            }`}
            onPointerDown={playTreble}
            aria-label="Play high dholak beat"
          >
            <div className="head-inner">
              <span>TAK</span>
              <small>High Beat</small>
            </div>
          </button>

        </div>

        {/* Score message */}
        <div className="dholak-message">

          {score === 0 ? (
            <>
              <span>👋</span>
              <p>Give the dholak a tap!</p>
            </>
          ) : score < 100 ? (
            <>
              <span>🎶</span>
              <p>Keep the rhythm going!</p>
            </>
          ) : (
            <>
              <span>🔥</span>
              <p>You're becoming a Dholak Star!</p>
            </>
          )}

        </div>

      </main>

      {/* Bottom */}
      <footer className="dholak-footer">

        <div>
          🏆
          <b>{score / 10}</b>
          <span>Beats Played</span>
        </div>

        <div>
          ⭐
          <b>{xp}</b>
          <span>XP Earned</span>
        </div>

      </footer>

    </div>
  );
}