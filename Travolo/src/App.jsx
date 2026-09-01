import { useState, useRef, useEffect } from "react";
import "./App.css";
import Art from "./Art";
import Dholak from "./Dholak";
import Profile from "./Profile";
import Quest from "./Quest";
import Badges from "./Badges";
import Quiz from "./quiz";
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
    photoTarget: "Take a photo of the Magic Flower engraving inside Sheesh Mahal.",
  },

  {
    id: "khass",
    name: "Diwan-e-Khass",
    icon: "♛",
    x: 50,
    y: 24,
    discovered: true,
    text: "This was the king's private meeting room, where he welcomed special guests to talk about important royal secrets.",
    photoTarget: "Take a photo of the main entrance of Diwan-e-Khass.",
  },

  {
    id: "sukh",
    name: "Sukh Niwas",
    icon: "❋",
    x: 68,
    y: 28,
    discovered: false,
    text: "Feeling hot? This clever palace had water flowing through its walls to keep the royal family cool all summer long.",
    photoTarget: "Take a photo of the water-channel cooling system inside Sukh Niwas.",
  },

  {
    id: "aam",
    name: "Diwan-e-Aam",
    icon: "♜",
    x: 50,
    y: 46,
    discovered: true,
    text: "This grand pillared hall was where the king listened to his people's worries, kind of like a royal town hall meeting!",
    photoTarget: "Take a photo showing the a set  of pillars in (2-4 pillars) of Diwan-e-Aam.",
  },

  {
    id: "zenana",
    name: "Zenana",
    icon: "✿",
    x: 72,
    y: 47,
    discovered: false,
    text: "A peaceful, private courtyard where the queens and royal ladies relaxed, away from the busy fort outside.",
    photoTarget: "Take a photo of the Baradari pavilion in the Zenana courtyard.",
  },

  {
    id: "jaleb",
    name: "Jaleb Chowk",
    icon: "⚔",
    x: 30,
    y: 62,
    discovered: false,
    text: "Grab your shield! This huge courtyard is where brave soldiers lined up with their swords before marching off to duty.",
    photoTarget: "Take a photo of the open area of Jaleb Chowk.",
  },

  {
    id: "ganesh",
    name: "Ganesh Pol",
    icon: "☸",
    x: 48,
    y: 74,
    discovered: false,
    text: "This colourful painted gateway welcomed everyone into the king's private palace — decorated for extra good luck!",
    photoTarget: "Take a photo of the Ganesh Pol entrance and its decorated gateway.",
  },

  {
    id: "suraj",
    name: "Suraj Pol",
    icon: "☀",
    x: 75,
    y: 75,
    discovered: false,
    text: "The Sun Gate! Facing the morning sunrise, this grand gate greeted royal processions and visitors arriving at dawn.",
    photoTarget: "Take a photo of the Suraj Pol entrance.",
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
  // "map" | "art" | "quest" | "badges" | "dholak"
  const [completedLocations, setCompletedLocations] = useState(false);
  const [completedInstrument, setCompletedInstrument] = useState(false);
  const [completedArt, setCompletedArt] = useState(false);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [page, setPage] = useState("map");
  const [xp, setXp] = useState(1200);

  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const fileInputRef = useRef(null);
  const [verifiedPlaces, setVerifiedPlaces] = useState([]);
  const verifyingPlaceRef = useRef(null);

const level = 4;

const discoveredCount = verifiedPlaces.length;

  if (page === "art") {
  return (
    <Art
      onBack={() => setPage("map")}
      onEarnXP={(amount) => setXp((prev) => prev + amount)}
      onComplete={() => setCompletedArt(true)}
    />
  );
}

if (page === "dholak") {
  return (
    <Dholak
      onBack={() => setPage("map")}
      onEarnXP={(amount) => setXp((prev) => prev + amount)}
      onComplete={() => setCompletedInstrument(true)}
    />
  );
}

if (page === "quest") {
  return <Quest onBack={() => setPage("map")} />;
}

if (page === "badges") {
  return <Badges 
      onBack={() => setPage("map")}
      completedLocations={completedLocations}
      completedInstrument={completedInstrument}
      completedArt={completedArt}
      completedQuiz={completedQuiz}
   />;
}

if (page === "profile") {
  return (
    <Profile
      totalXP={xp}
      onBack={() => setPage("map")}
    />
  );
}
  const handleVerify = () => {
  setVerifyResult(null);
  fileInputRef.current?.click();
};
if (page === "quiz") {
  return (
    <Quiz
      onBack={() => setPage("map")}
      onEarnXP={(amount) => setXp((prev) => prev + amount)}
      onComplete={() => setCompletedQuiz(true)}
    />
  );
}

const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file || !selected) return;
  const verificationPlaceId = selected.id;
  verifyingPlaceRef.current = verificationPlaceId;
  setVerifying(true);
  setVerifyResult(null);

  const formData = new FormData();

  formData.append("image", file);

  // Convert UI ID to the class name used by the ResNet model
  const locationMap = {
    sheesh: "sheesh_mahal",
    khass: "diwan_e_khas",
    sukh: "sukh_niwas",
    aam: "diwan_e_aam",
    zenana: "zenana",
    jaleb: "jaleb_chowk",
    ganesh: "ganesh_pol",
    suraj: "suraj_pol",
  };

  formData.append(
    "expected_location",
    locationMap[selected.id]
  );

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/verify",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Verification failed");
    }

    const result = await response.json();
    if(
  verifyingPlaceRef.current !== verificationPlaceId ||
  selected?.id !== verificationPlaceId
  ) {
  return;
}
    setVerifyResult(result);
    if (result.verified) {
  setVerifiedPlaces((prev) => {
    if (prev.includes(selected.id)) {
      return prev;
    }

    setXp((currentXP) => currentXP + 100);

    const updatedPlaces = [...prev, selected.id];

    // All locations have now been verified
    if (updatedPlaces.length === places.length) {
      setCompletedLocations(true);
    }

    return updatedPlaces;
  });
}

  } catch (error) {
    console.error(error);

    setVerifyResult({
      error: "Could not connect to the verification server."
    });

  } finally {
    setVerifying(false);
    if (verifyingPlaceRef.current === verificationPlaceId) {
    setVerifying(false);
  }
    // Allows selecting the same image again
    event.target.value = "";
  }
};
 const openPlace = (place) => {
  setSelected((cur) => {
    // Clicking the currently open location closes it
    if (cur?.id === place.id) {
      setVerifyResult(null);
      setVerifying(false);
      verifyingPlaceRef.current = null;
      return null;
    }

    // Opening a new location must clear the previous verification result
    setVerifyResult(null);
    setVerifying(false);
    verifyingPlaceRef.current = place.id;

    return place;
  });
};

  return (
    <div className="fort-app">
      <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  capture="environment"
  style={{ display: "none" }}
  onChange={handleImageUpload}
/>
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
            <span>⭐ {xp} XP</span>
            <span>🛡️ Level 4</span>
    
          </div>
        </header>

        {/* AI chatbot CTA — sits in the open sky area below the XP box */}
        <div className="chatbot-banner-wrap">
          <button
            className="chatbot-banner"
            onClick={() => setPage("quiz")}
             >
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
            <button
  className="nav-item"
  onClick={() => setPage("profile")}
>
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
                   } ${
                     verifiedPlaces.includes(place.id) ? "verified" : "unverified"
                    }`}
                  style={{ left: `${place.x}%`, top: `${place.y}%` }}
                  onClick={() => openPlace(place)}
                >
                  <span className="pin-drop" aria-hidden="true">

                        {verifiedPlaces.includes(place.id) ? (
                         <i className="pin-icon">{place.icon}</i>
                          ) : (
                         <i className="pin-icon">?</i>
                          )}
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
        width: '70px',
        height: '70px',
        objectFit: 'contain',
        mixBlendMode: 'multiply',
        transform: 'scale(1.8)',
        transformOrigin: 'center center',
        marginLeft: '10px',
        marginRight: '10px'
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

                  
                 <div className="photo-target">
  <span className="photo-target-icon">📸</span>

  <div>
    <strong>What should I photograph?</strong>
    <p>{selected.photoTarget}</p>
  </div>
</div>

<button
  className="card-action verify"
  onClick={handleVerify}
  disabled={verifying}
>
  <span>🔍</span>
  {verifying ? " Checking..." : " Verify"}
</button> 
               {verifyResult && !verifyResult.error && (
  <div
    className={`verification-result ${
      verifyResult.verified ? "success" : "failure"
    }`}
  >
    {verifyResult.verified ? (
      <>
        <h3>🎉 Location Verified!</h3>

        <p>
          You found <b>{selected.name}</b>!
        </p>

        <strong>⭐ +100 XP</strong>
      </>
    ) : (
      <>
        <h3>❌ Not Verified</h3>

        <p>
          Expected: <b>{selected.name}</b>
        </p>

        <p>
          Detected:{" "}
          <b>{verifyResult.predicted_location}</b>
        </p>

        <p>
          Confidence:{" "}
          <b>
            {Math.round(verifyResult.confidence * 100)}%
          </b>
        </p>

        <small>
          Try taking a clearer photo of the specific spot.
        </small>
      </>
    )}
  </div>
)}

{verifyResult?.error && (
  <div className="verification-result failure">
    <h3>⚠️ Verification Error</h3>
    <p>{verifyResult.error}</p>
  </div>
)}
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
          <button
           className="dholak"
           onClick={() => setPage("dholak")}
            >
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