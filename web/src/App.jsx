// Web routing shell — the browser equivalent of mobile's RootNavigator (D-013/D-015).
// Same auth gating and user flow, using react-router-dom instead of React Navigation:
//   not authenticated            -> Welcome / EmailEntry / OtpEntry
//   authenticated, no profile    -> ProfileSetup (only)
//   authenticated, full profile  -> BrowseRides / RideDetail / OfferRide / MyRides / Feed

import { Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./screens/auth/WelcomeScreen";
import EmailEntryScreen from "./screens/auth/EmailEntryScreen";
import OtpEntryScreen from "./screens/auth/OtpEntryScreen";
import ProfileSetupScreen from "./screens/profile/ProfileSetupScreen";
import BrowseRidesScreen from "./screens/carpool/BrowseRidesScreen";
import RideDetailScreen from "./screens/carpool/RideDetailScreen";
import OfferRideScreen from "./screens/carpool/OfferRideScreen";
import MyRidesScreen from "./screens/carpool/MyRidesScreen";
import FeedScreen from "./screens/feed/FeedScreen";
import Loader from "./components/common/Loader";
import { useAuth } from "./hooks/useAuth";
import { colors } from "./theme/tokens";

export default function App() {
  const { isLoading, isAuthenticated, isProfileComplete } = useAuth();

  return (
    <div style={shell}>
      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<EmailEntryScreen />} />
          <Route path="/verify" element={<OtpEntryScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : !isProfileComplete ? (
        <Routes>
          <Route path="*" element={<ProfileSetupScreen />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<BrowseRidesScreen />} />
          <Route path="/rides/:rideId" element={<RideDetailScreen />} />
          <Route path="/offer" element={<OfferRideScreen />} />
          <Route path="/my-rides" element={<MyRidesScreen />} />
          <Route path="/feed" element={<FeedScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

// Mobile-width column centered on the page so the ported layout keeps its
// proportions on desktop instead of stretching edge-to-edge.
const shell = {
  width: "100%",
  maxWidth: 480,
  margin: "0 auto",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: colors.background,
  boxShadow: "0 0 0 1px rgba(43, 36, 32, 0.04)",
};
