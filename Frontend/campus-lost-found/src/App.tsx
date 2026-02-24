import { BrowserRouter  , Route} from "react-router-dom";
import Login from "./pages/Login";

import { Routes } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element ={<Login />} />
            
            </Routes>
        </BrowserRouter>
    )
}
export default App