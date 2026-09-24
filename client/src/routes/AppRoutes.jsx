import { Routes, Route } from "react-router";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Cities from "../pages/cities/Cities";
import CityDetails from "../pages/cities/CityDetails"
import CreateItineraryPage from "../pages/itineraries/CreateItineraryPage";
import EditItineraryPage from "../pages/itineraries/EditItineraryPage";
import EditCityPage from "../pages/cities/EditCityPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ItineraryDetails from "../pages/itineraries/ItineraryDetails";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import UserProfile from "../pages/profile/UserProfile";

function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={ <Landing /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/register" element={ <Register /> } />
            <Route path="/cities" element={ <Cities /> } />
            <Route path="/itineraries/:cityId" element={ <CityDetails /> } />
            <Route path="/itineraries/details/:itineraryId" element={<ItineraryDetails />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={ <ProtectedRoute /> }>
                <Route path="/profile/me" element={<Profile />} />
                <Route path="/profile/create-itinerary" element={<CreateItineraryPage />} />
                <Route path="/itineraries/edit/:itineraryId" element={<EditItineraryPage />} /> 
            </Route>

            <Route element={ <ProtectedRoute requireAdmin={true} /> }>
                <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
                <Route path="/cities/edit/:cityId" element={ <EditCityPage /> } />
            </Route>
        </Routes>

    )
}

export default AppRoutes;