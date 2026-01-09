// import "./App.css";

import SpaceBackground from "./components/SpaceBackground";
// import Header from "./components/Headers";

import { Routes, Route } from "react-router-dom";
import AcceptRejectPage from "./AcceptRejectPage";
// import GaurdPage from "./page/GuardPage";
import VisitorPage from "./page/VisitorPage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
// import MainPage from "./MainPage";
import ProtectedRoute from "./router/ProtectedRoute"; // 🔥 추가
import AdminPage from "./page/AdminPage";
import AdminVisitorListPage from "./page/AdminVisitorListPage";
import { LocationImgListPage } from "./page/LocationImgListPage";
import TestVisitListView from "./testreactquery/TestVisitListView";
import TestAcceptRejectPage from "./testreactquery/socket+tanstack/TestAcceptRejectPage";
function App() {
  return (
    <>
      {/* <Header /> */}
      <div>
        <SpaceBackground />
        <Routes>
          {/* <Route path="/" element={<MainPage />} /> */}

          {/* <Route path="/:userId" element={<GaurdPage />} /> */}
          {/* <Route
            path="/:userId"
            element={
              <ProtectedRoute>
                <GaurdPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/admin/professors/list"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin/visitors/list"
            element={
              <ProtectedRoute>
                <AdminVisitorListPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminVisitorListPage />
              </ProtectedRoute>
            }
          />
          <Route path="/a/:token" element={<AcceptRejectPage />} />
          {/* <Route path="/visitor/register" element={<VisitorPage />} /> */}
          <Route path="/" element={<VisitorPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/register" element={<RegisterPage />} />
          <Route path="/test/visitlistview" element={<TestVisitListView />} />
          <Route
            path="/admin/location/list"
            element={<LocationImgListPage />}
          />
          <Route
            path="/test/acceptreject/:token"
            element={<TestAcceptRejectPage />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
