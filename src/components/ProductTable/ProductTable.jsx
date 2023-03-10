import React, { useEffect, useRef, useState } from "react";
import "./ProductTable.css";

const ProductTable = () => {
  const [data, setData] = useState([]);
  const refOpen = useRef(null);
  const refClose = useRef(null);

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

  const onAddHandler = () => {
    refOpen.current.click();
  };

  return (
    <>
      <button
        ref={refOpen}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        Launch Demo Modal
      </button>
      <div className="modal" tabIndex="-1" id="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add a product</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row g-3 needs-validation" novalidate>
                <div className="col-12">
                  <label htmlFor="user" className="form-label">
                    Name
                  </label>
                  <select
                    name="user"
                    id="user"
                    className="form-select"
                    required
                  >
                    <option value="anuj">Anuj</option>
                    <option value="rohit">Rohit</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-12">
                  <label htmlFor="product" className="form-label">
                    Product
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product"
                    placeholder="Enter the product name"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please choose a product name.
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      className="form-control"
                      id="pricevalidationCustomUsername"
                      required
                    />
                    <div className="valid-feedback">Looks good!</div>
                    <div className="invalid-feedback">
                      Please enter a price.
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    required
                  />
                  <div className="invalid-feedback">Please provide a date.</div>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <div className="container-fluid m-2 mb-4">
          <button className="btn btn-primary" onClick={onAddHandler}>
            Add Product
          </button>
        </div>
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
