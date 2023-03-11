import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ProductTable from "./components/ProductTable/ProductTable";

const App = () => {
  return (
    <div>
      <Navbar />
      <ProductTable />
      <Footer />
    </div>
  );
};

export default App;
