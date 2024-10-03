import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Customers from './pages/Customers';
import Films from './pages/Films';

export const RoutesManager = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Customers />} />
                <Route path="/films" element={<Films />} />
            </Routes>
        </Router >
    )
}