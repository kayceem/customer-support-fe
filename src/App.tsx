// App.tsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home, Login, NotFound } from "./Pages";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
