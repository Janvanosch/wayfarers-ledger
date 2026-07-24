import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import GearListPage from "../pages/Gear/GearListPage";
import GearDetailPage from "../pages/Gear/GearDetailPage";
import MakerListPage from "../pages/Makers/MakerListPage";
import MakerDetailPage from "../pages/Makers/MakerDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gear" element={<GearListPage />} />
      <Route path="/gear/:id" element={<GearDetailPage />} />
      <Route path="/makers" element={<MakerListPage />} />
      <Route path="/makers/:id" element={<MakerDetailPage />} />
    </Routes>
  );
}
