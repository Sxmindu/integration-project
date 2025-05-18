import Layout from "./components/Layout";

import {Routes, Route} from "react-router-dom";


import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";

// Import Pages Here
// Common Pages
import Login from "./pages/common/Login";
import Home from "./pages/common/Home";
import Books from "./pages/staff/books";
import Orders from "./pages/staff/orders";
import Purchases from "./pages/customer/purchase";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                {/*Public Routes*/}
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>

                {/*Protected Routes*/}
                <Route element={<PersistLogin/>}>
                    <Route element={<RequireAuth allowedRoles={["system_primary_staff"]}/>} path="/staff">
                        {/* Routes Authorized to Staff Users */}
                        <Route path="books" element={<Books />}/>
                        <Route path="orders" element={<Orders />}/>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={["system_primary_customer"]}/>} path="/customer">
                        {/* Routes Authorized to Customer Users */}
                        <Route path="purchase" element={<Purchases />}/>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
