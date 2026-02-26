import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import Dash from "./pages/Dash";
import ItemDetail from "./pages/ItemDetail";
import PostItem from "./pages/PostItem";
import ItemClaim from "./pages/ItemClaim";
import MyPost from "./pages/MyPost";
import Nav from "./components/Nav";

function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/complete-profile' element={<CompleteProfile />} />
                <Route path='/dashboard' element={<Dash />} />
                <Route path='/item/:id' element={<ItemDetail />} />
                <Route path='/claim-item/:id' element={<ItemClaim />} />
                <Route path='/post-item' element={<PostItem />} />
                <Route path='/my-posts' element={<MyPost />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App