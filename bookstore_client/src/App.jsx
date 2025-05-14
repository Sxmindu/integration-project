import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import PersistLogin from "./components/PersistLogin.jsx";

import Home from "./pages/common/Home";
import Login from "./pages/common/Login.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                {/*Public Routes*/}
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
            </Route>
        </Routes>
    );
}

export default App;
