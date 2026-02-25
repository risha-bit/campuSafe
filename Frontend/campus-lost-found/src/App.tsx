import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/complete-profile' element={<CompleteProfile />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App