import React, { useState, useEffect } from "react";
import axios from "axios"
import './App.css';

function App() {
  const [customers, setCustomers] = useState([])
  const [name, setName] = useState("")
  const [month, setMonth] = useState("")
  const [monthlyPoint, setMonthlyPoints] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    function getCustomers() {
      axios("api/customers.json").then(res => {
        if(res.data && res.data.customers) setCustomers(res.data.customers);
      }).catch(err => {
        console.log("checking err: ", err);
      });
    }
    getCustomers();
  }, [])

  const calculatePoints = (pur) => {
    let point1 = pur - 50 >= 0 
    let point2 = pur - 101 >= 0
    let points = 0
    if(point1){
      points = 50
    }
    if(point2){
      points += (2 * (pur-100))
    }
    console.log(pur, points)
    return points
  }

  const calculateResults = (obj) => {
    setName(obj.name);
    setMonth(obj.month);
    let dataForTotal = customers.filter( o => o.name === obj.name);
    let dataForMonth= customers.filter( o => o.name === obj.name && o.month === obj.month);
    let totalPoints = 0
    let monthlyPoints = 0
    dataForTotal.map(o => {
      let points = calculatePoints(o.purchase);
      totalPoints += points
      return o
    })
    dataForMonth.map(o => {
      let points = calculatePoints(o.purchase);
      monthlyPoints += points
      return o
    })
  
    setTotalPoints(totalPoints)
    setMonthlyPoints(monthlyPoints)
  }

  return (
    <div className="App">
      <table>
        <tr>
          <th>
            id
          </th>
          <th>
            Name
          </th>
          <th>
            Purchase
          </th>
          <th>
            Month
          </th>
        </tr>
        {customers.map((obj, i )=> (
        <tr key={i}>
          <td>
            {obj.id}
          </td>
          <td onClick={() => calculateResults(obj)}>
          {obj.name}
          </td>
          <td>
          {obj.purchase}
          </td>
          <td>
          {obj.month}
          </td>
        </tr>
        ))}
      </table>
      <div>
        <table>
          <tr>
            <th>
              Name
            </th>
            <th>
              Monthly Points
            </th>
            <th>
              total Points
            </th>
          </tr>
          {name && (
          <tr>
            <td>
              {name}
            </td>
            <td>
              {`${monthlyPoint} (${month})`}
            </td>
            <td>
              {totalPoints}
            </td>
          </tr>
          )}
        </table>
      </div>
    </div>
  );
}

export default App;
