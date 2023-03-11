import React, { useEffect, useState } from "react";
import "./CalculationTable.css";

const CalculationTable = () => {
  const [billsData, setBillsData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  let ownerShipTable = [];

  const fetchData = async () => {
    const result = await fetch("http://localhost:3000/bills?_expand=user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    setBillsData(data);

    const users = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const usersJson = await users.json();
    setUsersData(usersJson);
  };

  useEffect(() => {
    fetchData();
  }, [billsData, usersData]);

  let userPriceData = [];
  let totalAmount = 0;

  const calculateUserPriceData = () => {
    for (const user of usersData) {
      let sum = 0;
      for (const bill of billsData) {
        if (bill.userId == user.id) {
          sum += parseInt(bill.price);
        }
      }
      userPriceData.push({ user, totalPaid: sum });
    }
  };

  const calculateTotalAmount = () => {
    totalAmount = 0;
    for (const bill of billsData) {
      totalAmount += parseInt(bill.price);
    }
  };

  calculateTotalAmount();
  calculateUserPriceData();

  const calculateOwnership = () => {
    for (const user of usersData) {
      let ownership = [];
      for (const user2 of usersData) {
        if (user.id != user2.id) {
          ownership.push({ id: user2.id, name: user2.name, owes: 0 });
        }
      }
      ownerShipTable.push({ id: user.id, name: user.name, ownership });
    }

    for (const bill of billsData) {
      let individualAmount = parseInt(bill.price / usersData.length);
      for (let owner of ownerShipTable) {
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

    console.log(ownerShipTable);
  };

  calculateOwnership();

  return (
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
                      owned.owes > 0 ? "get from " : "pay to"
                    } ${owned.name} : ${Math.abs(owned.owes)}`}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CalculationTable;
