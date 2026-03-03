import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { getToken } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  return loggedIn ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
