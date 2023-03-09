import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ProductTable from "./components/ProductTable/ProductTable";

const App = () => {
  // data = fetchData();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await fetch("http://localhost:3000/bills?_expand=user", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     setData(await result.json());
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      <Navbar />
      <ProductTable />
      <Footer />
    </div>
  );
};

export default App;
