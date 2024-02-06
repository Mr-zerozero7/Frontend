import './index.css'
import { useState, useEffect } from 'react'
//  import recharts third-party packages
import {BarChart,Bar,XAxis, YAxis, Tooltip,Legend} from 'recharts'


//  function component

const TransactionDashboard =() => {
  const [month, setMonth] = useState('03');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [barChartData, setBarChartData] = useState([])
  const [statistics, setStatistics] = useState({})
  const [loading, setLoading] = useState(false);

  //  Fetch transactions data from the "ecomdata.db" using an API url
  const loadTransactions= async() =>{
    setLoading(true);
    const url = `http://localhost:3000/api/products/?month=${month}&search=${search}&page=${currentPage}`
    
    const options = {
      method: 'GET',
    }
    let response= await fetch(url,options)
    let data = await response.json()
    if(response.ok){
      setTransactions(data)
      console.log(data)
      setLoading(false);
    }else{
      console.log('fetching error')
      setLoading(false);
    }
    
  }

  //  Fetch Statistics data from the "ecomdata.db" using an API url.
  const loadStatistics= async () =>{
    const url = `http://localhost:3000/api/statistics/?month=${month}`
    const response = await fetch(url)
    const data = await response.json()
    if(response.ok){
      setStatistics(data)
      console.log(data)
    }else{
      console.log('Stats fetching error')
    }
  }

  //  Fetch BarChartData data from the "ecomdata.db" using an API url.
  const loadBarChartData= async () => {
    const url = `http://localhost:3000/api/bar-chart/?month=${month}`
    const response = await fetch(url)
    const data = await response.json()
    if(response.ok){
      setBarChartData(data.resultBarChartData)
      console.log(data.resultBarChartData)
    }else{
      console.log('bar chart fetching error')
    }
  }

  // Render
  useEffect(() => {
    loadTransactions()
    loadStatistics()
    loadBarChartData()
    // eslint-disable-next-line
  },[month,search,currentPage])
  
  //  Creating Table
  const displayTransactions=()=>{
    return transactions.map(transaction => (
      <tr key={transaction.id}>
        <td>{transaction.id}</td>
        <td>{transaction.title}</td>
        <td>{transaction.price}</td>
        <td>{transaction.description}</td>
        <td>{transaction.category}</td>
        <td>
          <img src={transaction.image} alt={transaction.title} style={{width:'50px', height: '50px'}} />
        </td>
        <td>{transaction.sold}</td>
        <td>{transaction.dateOfSale}</td>
      </tr>
    ))
  }

  //  display month (SELECT OPTION)
  const displayMonthOptions =() => {
    const months = [
      {value: '01', label: 'Junuary'},
      {value: '02', label: 'February'},
      {value: '03', label: 'March'},
      {value: '04', label: 'April'},
      {value: '05', label: 'May'},
      {value: '06', label: 'June'},
      {value: '07', label: 'July'},
      {value: '08', label: 'August'},
      {value: '09', label: 'September'},
      {value: '10', label: 'October'},
      {value: '11', label: 'November'},
      {value: '12', label: 'December'},
    ];
    return months.map(month => (
      <option key={month.value} value={month.value}>
        {month.label}
      </option>
    ))
  }

  // const handleSearch=()=>{
  //   setCurrentPage(1)
  //   loadTransactions()
  // }

  //  Display Month Name at statistics card & Bar Chart
  const displayMonthName = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const selectedMonth = months[parseInt(month, 10) - 1]
    return selectedMonth;
  }

  //  Page Change Prev-Next  
  const handlePageChange=(direction) =>{
    if(direction === 'prev' && currentPage > 1){
      setCurrentPage(currentPage - 1);
    }else{
      setCurrentPage(currentPage + 1);
    }

    loadTransactions()
  }

  
  //  Sales Bar Chart
  const displaySaleBarChart= () =>{
      return (
        <div className='statistics-chart-container'>
            <h1 className='bar-chart-heading'>Transaction Bar Chart for {displayMonthName()}</h1>
            <BarChart width={600} height={300} margin-top={{top:5}} data={barChartData}>
              <XAxis dataKey="priceRange"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey='itemCount' fill="rgba(211, 154, 10, 0.856)" radius={[10, 10, 0, 0]}/>
            </BarChart>
        </div>
      )
  }

    //  Return JSX
    return(
      <div className='main-container'>
        <h1 className='heading'>Transaction Dashboard</h1>
        <div className='inputs-container'>
          <input className='search-input' type='text' placeholder='Search transaction' value={search} onChange={(event) => setSearch(event.target.value)}/>
          {/* <button className='search-btn' type='button' onClick={handleSearch()}>Search</button> */}
          <select className='select-month' value={month} onChange={(event) => setMonth(event.target.value)}>
            {displayMonthOptions()}
          </select>
        </div>
        {loading ? (<p>Loading...</p>) :
        (<div className='table-container'>
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Sold</th>
                  <th>DateOfSold</th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions()}
              </tbody>
            </table>
        </div>)}
        <div className='buttons-container'>
          <p className='page-tag'>Page No: 1</p>
          <div className='page-buttons'>
            <button className='page-btn' type='button' onClick={() => handlePageChange('prev')} >Next</button>
            <span> - </span>
            <button className='page-btn' type='button' onClick={() => handlePageChange('next')} >Previous</button>
          </div>
          <p className='page-tag'>Per Page: 10</p>
        </div>
        <br/>
        <div className='statistics-card-container'>
            <h1 className='stats-heading'>Statistics for {displayMonthName()}</h1>
            <p className='stats-tag'>Total Sale Amount: <span className='sale-span'>{statistics.totalSaleAmount}</span></p>
            <p className='stats-tag'>Total Sold Items: <span className='sold-span'>{statistics.totalSoldItems}</span></p>
            <p className='stats-tag'>Total Not Sold Items: <span>{statistics.totalNotSoldItems}</span></p>
        </div>
        <br/>
        <div className='bar-chart-container'>
            {displaySaleBarChart()}
        </div>
      </div>
    )
  
}

export default TransactionDashboard
