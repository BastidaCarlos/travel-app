import { Routes, Route } from "react-router";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Cities from "../pages/Cities";
import Itineraries from "../pages/Itineraries"

function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/itineraries/:cityId" element={<Itineraries />} />
        </Routes>
    )
}

export default AppRoutes;