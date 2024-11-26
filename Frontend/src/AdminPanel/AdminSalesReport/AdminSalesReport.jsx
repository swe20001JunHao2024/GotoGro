import React, { useState } from 'react';
import './AdminSalesReport.css';
import AdminNavbar from '../AdminNav.jsx';
import axios from 'axios';

const AdminSalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that both start and end dates are selected
    if (!startDate || !endDate) {
      setError('Please select both start and end date.');
      return;
    }

    // Construct the query parameters
    const queryParams = `?filter=range&startDate=${startDate}&endDate=${endDate}`;

    try {
      // Make the request to the backend to fetch the filtered sales data
      const response = await axios.get(`/admindash/sales-report${queryParams}`);
      setSalesData(response.data); // Set the fetched data into state
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to fetch sales data. Please try again later.');
    }
  };

  // Function to export sales data to CSV
  const exportToCSV = () => {
    const headers = ['Period', 'Revenue', 'Tax', 'Subtotal'];
    const rows = salesData.map(sale => [
      sale.period,
      sale.revenue,
      sale.tax,
      sale.subtotal,
    ]);

    // Create a CSV string
    const csvContent = [
      headers.join(','), // Join the headers with commas
      ...rows.map(row => row.join(',')), // Join each row with commas
    ].join('\n'); // Join the whole CSV content with newlines

    // Create a blob with the CSV content and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sales_report.csv'; // File name for the downloaded CSV
    link.click();
  };

  return (
    <div>
      <AdminNavbar />

      <div className="admin-sales-report">
        <div className="filter-section">
          <h5>Sales Report</h5>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="startDate">Start Date: </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                required
              />
            </div>

            <div>
              <label htmlFor="endDate">End Date: </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                required
              />
            </div>

            <button type="submit">Filter</button>
          </form>

          {error && <div className="error-message">{error}</div>}
        </div>

        {salesData.length > 0 && (
          <div className='export-section'>
            <button type="submit" onClick={exportToCSV}>Export CSV</button>
          </div>
        )}

        <div className="sales-report-table">
          <table className="sales-report-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Revenue</th>
                <th>Tax</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? (
                salesData.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.period}</td>
                    <td>{sale.revenue}</td>
                    <td>{sale.tax}</td>
                    <td>{sale.subtotal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data-message">
                    No sales data available for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesReport;
