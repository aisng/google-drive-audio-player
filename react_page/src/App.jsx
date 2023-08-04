// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
import Listen from "./pages/Listen";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="container">
        {/* <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/listen" element={<Listen />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
        </Routes> */}
        <Listen />
      </div>
    </>
  );
}

export default App;
