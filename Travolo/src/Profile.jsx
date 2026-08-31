import { useState } from "react";
import "./Profile.css";

export default function Profile({ onBack, totalXP }) {
  const [profile, setProfile] = useState({
    username: "",
    gender: "",
    age: "",
    hobby: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    alert(
      `Profile saved! Welcome ${profile.username || "Explorer"} 🏰`
    );
  };

  return (
    <div className="profile-page">

      {/* HEADER */}
      <header className="profile-header">

        <button className="profile-back" onClick={onBack}>
          ← Back to Fort
        </button>

        <div className="profile-title">
          <span>🧑</span>
          <div>
            <small>TRAVOLO • EXPLORER PROFILE</small>
            <h1>My Explorer Profile</h1>
          </div>
        </div>

        <div className="profile-level">
          🛡️ <b>Level 4</b>
        </div>

      </header>


      {/* MAIN CONTENT */}
      <main className="profile-content">

        {/* PROFILE CARD */}
        <section className="profile-card">

          <div className="profile-avatar">
            😎
          </div>

          <h2>Create Your Explorer Profile</h2>

          <p className="profile-subtitle">
            Tell us a little about yourself before your next
            adventure around Amer Fort! 🏰
          </p>

          <form onSubmit={handleSave}>

            <label>
              Explorer Name
              <input
                type="text"
                name="username"
                placeholder="Enter your name"
                value={profile.username}
                onChange={handleChange}
              />
            </label>


            <label>
              Gender
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="">Choose one</option>
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="other">Other</option>
              </select>
            </label>


            <label>
              Age
              <input
                type="number"
                name="age"
                min="5"
                max="100"
                placeholder="Enter your age"
                value={profile.age}
                onChange={handleChange}
              />
            </label>


            <label>
              Favourite Hobby
              <input
                type="text"
                name="hobby"
                placeholder="Drawing, music, cricket..."
                value={profile.hobby}
                onChange={handleChange}
              />
            </label>


            <button className="save-profile" type="submit">
              ✨ Save My Profile
            </button>

          </form>

        </section>


        {/* RIGHT SIDE */}
        <section className="profile-side">

          {/* XP CARD */}
          <div className="xp-card">

            <div className="xp-card-icon">
              ⭐
            </div>

            <div>
              <small>TOTAL XP</small>
              <strong>{totalXP}</strong>
            </div>

            <div className="xp-level">
              🛡️ Level 4
            </div>

          </div>


          {/* AVATAR LOCK */}
          <div className="avatar-lock-card">

            <div className="big-lock">
              🔒
            </div>

            <div className="lock-stars">
              ✦ ✧ ✦
            </div>

            <h2>Avatar Building Kit</h2>

            <p>
              Your magical avatar workshop is still locked!
            </p>

            <div className="unlock-box">
              🛡️
              <span>
                Unlocks at
                <b> Level 6</b>
              </span>
            </div>

            <div className="lock-decoration">
              🏰 &nbsp; 🪄 &nbsp; 🎨
            </div>

          </div>


          {/* CURRENT LEVEL */}
          <div className="level-card">

            <span className="level-badge">
              4
            </span>

            <div>
              <small>CURRENT LEVEL</small>
              <h3>Fort Explorer</h3>
              <p>
                Keep exploring, learning and playing!
              </p>
            </div>

          </div>

        </section>

      </main>


      <footer className="profile-footer">
        🏰 <b>TRAVOLO</b> • Keep exploring Amer Fort!
      </footer>

    </div>
  );
}