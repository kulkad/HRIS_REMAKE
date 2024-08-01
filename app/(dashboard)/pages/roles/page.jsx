"use client";

import { useState } from "react";

const styles = {
  container: {
    padding: "2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "left",
    border: "1px solid #ddd",
    padding: "8px",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  trEven: {
    backgroundColor: "#f2f2f2",
  },
  trHover: {
    ":hover": {
      backgroundColor: "#ddd",
    },
  },
};

const Roles = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: "Manager", exitTime: "17:00", fine: "Rp 50,000" },
    { id: 2, name: "Staff", exitTime: "18:00", fine: "Rp 30,000" },
    { id: 3, name: "Intern", exitTime: "17:30", fine: "Rp 10,000" },
  ]);

  return (
    <div style={styles.container}>
      <h2>Roles</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nama Role</th>
            <th style={styles.th}>Jam Pulang</th>
            <th style={styles.th}>Denda</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id} style={index % 2 === 0 ? styles.trEven : null}>
              <td style={styles.td}>{role.name}</td>
              <td style={styles.td}>{role.exitTime}</td>
              <td style={styles.td}>{role.fine}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
