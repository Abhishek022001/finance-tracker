"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Home() {
  const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [budgets, setBudgets] = useState({});
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  // Load saved data from localStorage
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (savedTransactions) setTransactions(savedTransactions);

    const savedBudgets = JSON.parse(localStorage.getItem("budgets"));
    if (savedBudgets) setBudgets(savedBudgets);

    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedDarkMode !== null) setDarkMode(savedDarkMode);
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Save budgets to localStorage
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTransaction = (type) => {
    if (!amount || !description || !date) return alert("Please enter all details!");

    const newTransaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      description,
      date,
      category,
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount("");
    setDescription("");
    setDate("");
  };

  const setBudget = (cat, value) => {
    setBudgets({ ...budgets, [cat]: parseFloat(value) || 0 });
  };

  const resetTracker = () => {
    if (confirm("Are you sure you want to reset everything?")) {
      setTransactions([]);
      setBudgets({});
      localStorage.removeItem("transactions");
      localStorage.removeItem("budgets");
    }
  };

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryExpenses = transactions.filter((t) => t.type === "expense").reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  
  const defaultPieData = [
    {name: "Food", value: 60},
    {name: "Travel", value: 20},
    {name: "Shopping", value: 40},
    {name: "Bills", value: 10},
    {name: "Other", value: 20}
  ]
  const pieData = Object.entries(categoryExpenses).length > 0 ? Object.entries(categoryExpenses).map(([key, value]) => ({
    name: key,
    value,
  }))
  : defaultPieData;

  const budgetComparisonData = categories.map((cat) => ({
    name: cat,
    actual: categoryExpenses[cat] || 0,
    budget: budgets[cat] || 0,
  }));

  return (
    <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col items-center p-8`}>
      {/* Dark Mode Toggle */}
      <button className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded dark:bg-gray-200 dark:text-black cursor-pointer"
        onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="text-3xl font-bold">Finance Tracker 📊</h1>

      {/* Dashboard Summary */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 text-center mt-6">
        <h2 className="text-xl font-semibold">Balance: ₹{balance}</h2>
        <p className="text-green-500">Income: ₹{totalIncome}</p>
        <p className="text-red-500">Expenses: ₹{totalExpense}</p>
      </div>

      {/* Transaction Input Form */}
      <div className="mt-6 flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">

        <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-60 bg-white text-black dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
        />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-60 bg-white text-black dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded w-60 bg-white text-black dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded w-60 bg-white text-black dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400">
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex gap-4">
          <button className="bg-green-500 text-white p-2 rounded cursor-pointer hover:scale-105 bg-gradient-to-r from-green-500 to-green-800 transition-transform " onClick={() => addTransaction("income")}>Add Income</button>
          <button className="bg-red-500 text-white p-2 rounded cursor-pointer hover:scale-105 bg-gradient-to-r from-red-500 to-red-800 transition-transform" onClick={() => addTransaction("expense")}>Add Expense</button>
        </div>
        {/* Reset tracker */}
        <button className="mt-2 bg-black text-white p-2 rounded cursor-pointer" onClick={resetTracker}>
          🔄 Reset Tracker
        </button>
      </div>

      {/* Budget Input Section */}
      <div className="mt-6 flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center">Set Monthly Budgets</h2>
        <div className="flex flex-col gap-3 mt-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-24">{cat}</span>
              <input type="number" value={budgets[cat] || ""} onChange={(e) => setBudget(cat, e.target.value)}
                className="p-2 border rounded w-32 bg-white text-black dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reset Tracker Button */}
      {/* <button className="mt-6 bg-gray-500 text-white p-2 rounded cursor-pointer" onClick={resetTracker}>
        🔄 Reset Tracker
      </button> */}

      {/* Charts */}

      {/* Montly Expenses Chart */}
      <div className="mt-6 flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold text-center">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pieData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category-wise Pie Chart */}
      <div className="mt-6 flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold text-center">Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData.length > 0 ? pieData : defaultPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {(pieData.length > 0 ? pieData : defaultPieData).map((_, index) => (
                <Cell key={`cell-${index}`} fill={["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Budget vs Actual Comparison Chart */}
      <div className="mt-6 flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold text-center">Budget vs Actual</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={budgetComparisonData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="actual" fill="#FF6384" />
            <Bar dataKey="budget" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
