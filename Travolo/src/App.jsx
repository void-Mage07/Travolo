import { useState } from "react";
import "./App.css";
import Art from "./Art";
import Quest from "./Quest";
import Badges from "./Badges";
import fortMapImg from "./assets/amer-fort-map.svg";
import rajasthaniBoy from './assets/rajasthani-boy.png';

const places = [
  {
    id: "sheesh",
    name: "Sheesh Mahal",
    icon: "✦",
    x: 31,
    y: 33,
    discovered: true,
    text: "This sparkly Mirror Palace was the queen's favourite room! Just one tiny candle could make a thousand little mirrors twinkle like stars.",
  },
  {
    id: "khass",
    name: "Diwan-e-Khass",
    icon: "♛",
    x: 50,
    y: 24,
    discovered: true,
    text: "This was the king's private meeting room, where he welcomed special guests to talk about important royal secrets.",
  },
  {
    id: "sukh",
    name: "Sukh Niwas",
    icon: "❋",
    x: 68,
    y: 28,
    discovered: false,
    text: "Feeling hot? This clever palace had water flowing through its walls to keep the royal family cool all summer long.",
  },
  {
    id: "aam",
    name: "Diwan-e-Aam",
    icon: "♜",
    x: 50,
    y: 46,
    discovered: true,
    text: "This grand pillared hall was where the king listened to his people's worries, kind of like a royal town hall meeting!",
  },
  {
    id: "zenana",
    name: "Zenana",
    icon: "✿",
    x: 72,
    y: 47,
    discovered: false,
    text: "A peaceful, private courtyard where the queens and royal ladies relaxed, away from the busy fort outside.",
  },
  {
    id: "jaleb",
    name: "Jaleb Chowk",
    icon: "⚔",
    x: 30,
    y: 62,
    discovered: false,
    text: "Grab your shield! This huge courtyard is where brave soldiers lined up with their swords before marching off to duty.",
  },
  {
    id: "ganesh",
    name: "Ganesh Pol",
    icon: "☸",
    x: 48,
    y: 74,
    discovered: false,
    text: "This colourful painted gateway welcomed everyone into the king's private palace — decorated for extra good luck!",
  },
  {
    id: "suraj",
    name: "Suraj Pol",
    icon: "☀",
    x: 75,
    y: 75,
    discovered: false,
    text: "The Sun Gate! Facing the morning sunrise, this grand gate greeted royal processions and visitors arriving at dawn.",
  },
];

function Compass() {
  return (
    <div className="compass" aria-hidden="true">
      <span className="compass-n">N</span>
      <svg className="compass-rose" viewBox="0 0 64 64">
        <polygon className="rose-h" points="4,32 28,28 60,32 28,36" />
        <polygon className="rose-v" points="32,4 36,28 32,60 28,28" />
        <circle className="rose-ring" cx="32" cy="32" r="26" />
        <circle className="rose-hub" cx="32" cy="32" r="6" />
      </svg>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  // "map" | "art" | "quest" | "badges"
  const [page, setPage] = useState("map");
  const discoveredCount = places.filter((p) => p.discovered).length;

  if (page === "art") return <Art onBack={() => setPage("map")} />;
  if (page === "quest") return <Quest onBack={() => setPage("map")} />;
  if (page === "badges") return <Badges onBack={() => setPage("map")} />;

  const openPlace = (place) =>
    setSelected((cur) => (cur?.id === place.id ? null : place));

  return (
    <div className="fort-app">
      <div className="fort-shell">
        <header className="fort-top">
          <div className="signboard-wrap">
            <div className="signboard">
              <small style={{ display: 'block', letterSpacing: '2px', color: '#7a5a3a' }}>TRAVOLO PRESENTS</small>
                <h1 style={{ margin: '5px 0', fontSize: '2.5rem', color: '#3a2010', fontWeight: '900' }}>AMER FORT</h1>
                  <em style={{ display: 'block', fontStyle: 'normal', letterSpacing: '1px', color: '#7a5a3a' }}>JAIPUR • RAJASTHAN</em>
                    </div>
                  <div className="ribbon">EXPLORE • LEARN • PLAY</div>
                </div>
          <div className="top-pills">
            <span>⭐ 1200 XP</span>
            <span>🛡️ Level 4</span>
            <button aria-label="Menu">☰</button>
          </div>
        </header>

        {/* AI chatbot CTA — sits in the open sky area below the XP box */}
        <div className="chatbot-banner-wrap">
          <button className="chatbot-banner" onClick={() => alert("Chatbot coming soon!")}>
            <span className="chatbot-icon">🤖</span>
            <span className="chatbot-text">
              <b>Test Your Knowledge!</b>
              <small>Answer fun questions about Amer Fort to earn XP &amp; Badges</small>
            </span>
            <span className="chatbot-arrow">➜</span>
          </button>
        </div>

        <div className="fort-body">
          <nav className="side-nav" aria-label="Sections">
            <button
              className={`nav-item ${page === "map" ? "active" : ""}`}
              onClick={() => setPage("map")}
            >
              <span>🗺️</span>Map
            </button>
            <button
              className={`nav-item ${page === "quest" ? "active" : ""}`}
              onClick={() => setPage("quest")}
            >
              <span>📜</span>Quests
            </button>
            <button
              className={`nav-item ${page === "badges" ? "active" : ""}`}
              onClick={() => setPage("badges")}
            >
              <span>🏅</span>Badges
            </button>
            <button className="nav-item">
              <span>🧑</span>Profile
            </button>
          </nav>

          <main className="fort-frame">
            <section
              className="fort-map"
              style={{ backgroundImage: `url(${fortMapImg})` }}
              aria-label="Illustrated map of Amer Fort"
            >
              <Compass />

              {places.map((place) => (
                <button
                  key={place.id}
                  className={`map-pin ${
                    selected?.id === place.id ? "chosen" : ""
                  } ${place.discovered ? "found" : ""}`}
                  style={{ left: `${place.x}%`, top: `${place.y}%` }}
                  onClick={() => openPlace(place)}
                >
                  <span className="pin-drop" aria-hidden="true">
                    <i className="pin-icon">{place.icon}</i>
                  </span>
                  <b>{place.name}</b>
                </button>
              ))}

            {!selected && (
              <div className="map-hint">
    <img 
      src={rajasthaniBoy} 
      alt="Rajasthani boy sticker" 
      style={{
        width: '5.5em',          
        height: '5.5em',
        objectFit: 'contain',     
        mixBlendMode: 'multiply' ,
        transform: 'scale(2.6)', 
        transformOrigin: 'center center',
        marginLeft: '25px',
        marginRight: '35px'
      }} 
    />
    <p>
      <b>Ready to explore?</b>
      <br />
      Tap a fort place to hear its story!
    </p>
  </div>
)}


              {selected && (
                <aside className="place-card">
                  <button
                    className="card-close"
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div className="card-photo">
                    <span>{selected.icon}</span>
                  </div>
                  <h2>{selected.name}</h2>
                  <p className="place-text">{selected.text}</p>

                  
                  <button className="card-action verify">
                    <span>🔍</span> Verify
                  </button>
                  {selected.id === "sheesh" && (
                    <button
                      className="card-action art"
                      onClick={() => setPage("art")}
                    >
                      <span>✦</span> Make Glass Art
                    </button>
                  )}
                </aside>
              )}
            </section>
          </main>
        </div>

        <footer className="fort-footer">
          <div className="footer-guide">
            {" "}
            <span>
              Click on any place
              <br />
              to explore its story!
            </span>
          </div>
          <button className="dholak">
            ♪ <b>🥁 PLAY DHOLAK</b> ♪
          </button>
          <div className="explorer">
            <b>🏰 FORT EXPLORER</b>
            <small>
              {discoveredCount} / {places.length} DISCOVERED
            </small>
            <i>
              <em
                style={{
                  width: `${(discoveredCount / places.length) * 100}%`,
                }}
              />
            </i>
          </div>
        </footer>
      </div>
    </div>
  );
}