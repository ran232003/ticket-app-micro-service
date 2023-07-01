import logo from "./logo.svg";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Auth from "./pages/auth/Auth";
import LandingPage from "./pages/landing/LandingPage";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "./store/authSlice";
import ProtectedRoutes from "./ProtectedRoutes";
import Loading from "./components/Loading";
import { loadingAction } from "./store/loadingSlice";
///
function App() {
  //const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => {
    return state.loading.loading;
  });
  const getUser = async () => {
    let data = await getCurrentUser();
    console.log(data);
    if (data.status !== "ok") {
      navigate(`/auth/login`);
      dispatch(loadingAction.setLoading(false));
    } else {
      dispatch(authAction.setUser(data.user));
      dispatch(authAction.setLogin());
      navigate(`/landing`);
      dispatch(loadingAction.setLoading(false));
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="App">
      <NavigationBar />
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/landing" element={<LandingPage />} />
          </Route>
          <Route path="/auth/:status" element={<Auth />} />

          <Route path="/" element={<Navigate to="/auth/signup" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
