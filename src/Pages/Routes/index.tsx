
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ element, ...rest }: any) => {
    const { isAuthenticated } = useAuth();
  
    return isAuthenticated ? (
      <Route {...rest} element={element} />
    ) : (
      <Navigate to="/login" replace />
    );
  };
  
  export default ProtectedRoute;
