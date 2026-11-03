import { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './BloodStock.css';

const colorMap = {
  'A+': '#FF5252',
  'A-': '#FF8A80',
  'B+': '#3F51B5',
  'B-': '#7986CB',
  'AB+': '#9C27B0',
  'AB-': '#CE93D8',
  'O+': '#4CAF50',
  'O-': '#81C784'
};

const DEFAULT_DATA = [
  { bloodType: 'A+', quantity: 45 },
  { bloodType: 'A-', quantity: 15 },
  { bloodType: 'B+', quantity: 38 },
  { bloodType: 'B-', quantity: 12 },
  { bloodType: 'AB+', quantity: 20 },
  { bloodType: 'AB-', quantity: 8 },
  { bloodType: 'O+', quantity: 55 },
  { bloodType: 'O-', quantity: 18 }
];

const keyToBloodType = {
  A_pos: 'A+',
  A_neg: 'A-',
  B_pos: 'B+',
  B_neg: 'B-',
  AB_pos: 'AB+',
  AB_neg: 'AB-',
  O_pos: 'O+',
  O_neg: 'O-'
};

function processData(dataArray, setBloodInventory, setTotalDonors) {
  const formattedData = dataArray.map(item => ({
    name: item.bloodType,
    donors: item.quantity,
    color: colorMap[item.bloodType] || '#999999'
  }));
  const total = formattedData.reduce((sum, item) => sum + item.donors, 0);
  setBloodInventory(formattedData);
  setTotalDonors(total);
}

export default function BloodAvailabilityDashboard() {
  const [bloodInventory, setBloodInventory] = useState([]);
  const [totalDonors, setTotalDonors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('default');
  const navigate = useNavigate();

  useEffect(() => {
    // Use default placeholder first
    const defaultFormatted = DEFAULT_DATA.map(d => ({
      bloodType: d.bloodType,
      quantity: d.quantity
    }));
    processData(defaultFormatted, setBloodInventory, setTotalDonors);
    setDataSource('default');
    setLoading(false);

    const fetchBloodInventory = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/reciptent/BloodStock');
        if (response.status === 200 && response.data?.data) {
          const apiData = response.data.data;

          // Convert API format to desired structure
          const formatted = Object.keys(apiData).map(key => ({
            bloodType: keyToBloodType[key] || key,
            quantity: apiData[key]
          }));

          processData(formatted, setBloodInventory, setTotalDonors);
          setDataSource('database');
        }
      } catch (error) {
        console.error('Failed to fetch blood inventory from backend:', error.message);
      }
    };

    const timeout = setTimeout(fetchBloodInventory, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip">
          <p className="tooltip-title">{`${payload[0].name}: ${payload[0].value} donors`}</p>
          <p className="tooltip-subtitle">{`${((payload[0].value / (totalDonors || 1)) * 100).toFixed(1)}% of total donors`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="loading">Loading donor data...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="main-title">Blood Donor Inventory</h1>

      {dataSource === 'default' && (
        <div className="data-source-notice">
          <p>Connecting to database... Currently showing placeholder data.</p>
        </div>
      )}

      {dataSource === 'database' && (
        <div className="data-source-notice success">
          <p>Connected to database. Showing real-time donor data.</p>
        </div>
      )}

      <div className="summary-container">
        <h2 className="summary-title">Current Donor Availability</h2>
        <div className="total-units">
          <span className="total-count">{totalDonors}</span>
          <span className="total-label">Total Donors Available</span>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="chart-container">
        <h2 className="section-title">Donor Group Distribution</h2>
        <div className="chart-area">
          <ResponsiveContainer width="110%" height="110%">
            <PieChart>
              <Pie
                data={bloodInventory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="donors"
                nameKey="name"
                label={({ name, percent }) => `${name} : ${(percent * 100).toFixed(0)}%`}
              >
                {bloodInventory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Summary */}
      <div className="status-container">
        <h2 className="status-title">Donor Status</h2>
        <p className="status-message">
          {bloodInventory.filter(b => b.donors < 10).length > 0 ? (
            <span className="critical-message">
              {bloodInventory.filter(b => b.donors < 10).length} blood groups are at critical levels.
              Please coordinate donation drives for {bloodInventory.filter(b => b.donors < 10).map(b => b.name).join(', ')}.
            </span>
          ) : (
            <span className="sufficient-message">All blood groups are at sufficient levels.</span>
          )}
        </p>
      </div>

      <div className="last-updated">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>

      <button className="back" onClick={() => navigate(-1)} style={{ width: "8%" }}>
        <IoMdArrowRoundBack /> Back
      </button>
    </div>
  );
}
