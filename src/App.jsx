import { Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./component/Layout";
import Home from "./component/Home";
import { ItemDetail } from "./component/ItemDetail";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="lost" element={<Home />} />
            <Route path="found" element={<Home />} />
            <Route path="my-reports" element={<Home />} />
            <Route path="history" element={<Home />} />
            <Route path="item/:id" element={<ItemDetail />} />
          </Route>
        </Routes>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
