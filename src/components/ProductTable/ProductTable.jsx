import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import "./ProductTable.css";

const ProductTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await fetch("http://localhost:3000/bills?_expand=user", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setData(await result.json());
    }
    fetchData();
  }, [data]);

  const onAddHandler = () => {};

  return (
    <>
      <div className="container-fluid mt-5">
        <div className="container-fluid m-2 mb-4">
          <button className="btn btn-primary" onClick={openModal}>
            Add Product
          </button>
        </div>
        <Modal closeModal={closeModal} showModal={showModal} />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Product Purchased</th>
              <th scope="col">Price</th>
              <th scope="col">Payee</th>
            </tr>
          </thead>
          <tbody>
            {!data ? (
              <>No data found</>
            ) : (
              data.map((entry, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{entry.date}</td>
                    <td>{entry.description}</td>
                    <td>{entry.price}</td>
                    <td>{entry.user.name}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTable;
