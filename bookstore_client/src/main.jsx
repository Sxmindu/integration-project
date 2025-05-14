import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import {DataProvider} from "./context/DataProvider.jsx";
import {AuthProvider} from "./context/AuthProvider.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Routes>
                        <Route path="/*" element={<App/>}/>
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)

