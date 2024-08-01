"use client";
// /pages/settings.js
import { useState } from "react";

const Settings = () => {
  const [formState, setFormState] = useState({
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    sidebarColor: "#cccccc",
    logo: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan tema ke local storage atau kirim ke server
    console.log("Updated theme:", formState);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Primary Color:</label>
          <input
            type="color"
            name="primaryColor"
            value={formState.primaryColor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Secondary Color:</label>
          <input
            type="color"
            name="secondaryColor"
            value={formState.secondaryColor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Sidebar Color:</label>
          <input
            type="color"
            name="sidebarColor"
            value={formState.sidebarColor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Logo URL:</label>
          <input
            type="file"
            name="logo"
            value={formState.logo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formState.companyName}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-save">
          Save Changes
        </button>
      </form>
      <style jsx>{`
        .settings-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .settings-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group input[type="color"],
        .form-group input[type="file"],
        .form-group input[type="text"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn-save {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-save:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Settings;
