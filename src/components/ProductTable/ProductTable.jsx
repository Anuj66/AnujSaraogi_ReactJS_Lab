import React, { useEffect, useRef, useState } from "react";
import "./ProductTable.css";

const ProductTable = () => {
  const [data, setData] = useState([]);
  const refOpen = useRef(null);
  const refClose = useRef(null);
  const [users, setUsers] = useState([]);

  const [ownerShipTable, setOwnerShipTable] = useState([]);
  const [userPriceData, setUserPriceData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateUserPriceData = (usersData, billsData) => {
    let tempUserPriceData = [];
    for (const user of usersData) {
      let sum = 0;
      for (const bill of billsData) {
        if (bill.userId == user.id) {
          sum += parseInt(bill.price);
        }
      }
      tempUserPriceData.push({ user, totalPaid: sum });
    }

    setUserPriceData(tempUserPriceData);
  };

  const calculateTotalAmount = (billsData) => {
    let tempTotalAmount = 0;
    for (const bill of billsData) {
      tempTotalAmount += parseInt(bill.price);
    }
    setTotalAmount(tempTotalAmount);
  };

  const calculateOwnership = (usersData, billsData) => {
    let tempOwnerShipTable = [];
    for (const user of usersData) {
      let ownership = [];
      for (const user2 of usersData) {
        if (user.id != user2.id) {
          ownership.push({ id: user2.id, name: user2.name, owes: 0 });
        }
      }
      tempOwnerShipTable.push({ id: user.id, name: user.name, ownership });
    }

    for (const bill of billsData) {
      let individualAmount = parseInt(bill.price / usersData.length);
      for (let owner of tempOwnerShipTable) {
        if (owner.id == bill.userId) {
          for (let owned of owner.ownership) {
            owned.owes += individualAmount;
          }
        } else {
          for (let owned of owner.ownership) {
            owned.owes -= individualAmount;
          }
        }
      }
    }

    setOwnerShipTable(tempOwnerShipTable);
  };

  async function fetchData() {
    const bills = await fetch("http://localhost:3000/bills?_expand=user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const billsJson = await bills.json();
    setData(billsJson);

    const usersData = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const usersDataJson = await usersData.json();
    setUsers(usersDataJson);

    calculateTotalAmount(billsJson);
    calculateUserPriceData(usersDataJson, billsJson);
    calculateOwnership(usersDataJson, billsJson);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onAddHandler = () => {
    refOpen.current.click();
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const userId = e.target.user.value;
    const product = e.target.product.value;
    const price = e.target.price.value;
    const date = e.target.date.value;
    await fetch("http://localhost:3000/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, description: product, price, date }),
    });
    fetchData();

    refClose.current.click();
  };

  const onDelete = async (billId) => {
    await fetch("http://localhost:3000/bills/" + billId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchData();
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
              <form
                className="row g-3 needs-validation"
                onSubmit={(e) => onFormSubmit(e)}
              >
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
                    {users.map((user, index) => {
                      return (
                        <option value={user.id} key={index}>
                          {user.name}
                        </option>
                      );
                    })}
                  </select>
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
                </div>
                <div className="col-12">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      required
                    />
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
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Submit
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
              <th scope="col">Delete</th>
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
                    <td>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => onDelete(entry.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <hr className="mt-5 mb-5" />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total</td>
              <td>{totalAmount}</td>
            </tr>
            {userPriceData.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{user.user.name} paid</td>
                  <td>{user.totalPaid}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr />
        <table className="table">
          <tbody>
            {ownerShipTable.map((owner, index) => {
              return (
                <tr key={index}>
                  {owner.ownership.map((owned, index) => {
                    return (
                      <td key={index}>{`${owner.name} will ${
                        owned.owes >= 0 ? "get from " : "pay to"
                      } ${owned.name} : ${Math.abs(owned.owes)}`}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTable;
