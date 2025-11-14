// import "./App.css";

import SpaceBackground from "./components/SpaceBackground";
// import Header from "./components/Headers";

import { Routes, Route } from "react-router-dom";
import AcceptRejectPage from "./AcceptRejectPage";
import GaurdPage from "./page/GuardPage";
import VisitorPage from "./page/VisitorPage";
import MainPage from "./MainPage";
function App() {
  return (
    <>
      {/* <Header /> */}
      <div>
        <SpaceBackground />
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/1" element={<GaurdPage />} />
          <Route path="/acceptreject/:token" element={<AcceptRejectPage />} />
          <Route path="/visitor/register" element={<VisitorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
