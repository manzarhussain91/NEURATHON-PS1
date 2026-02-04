"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // --- 1. SETTINGS ---
  const [isDyslexic, setIsDyslexic] = useState(false);
  
  // --- 2. GAMIFICATION STATE ---
  const [coins, setCoins] = useState(1500); 
  const [charges, setCharges] = useState(2);
  const [history, setHistory] = useState([]); 

  // --- 3. DAILY TASKS ---
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "Drink 2L Water", completed: false, reward: 50 },
    { id: 2, title: "Read for 15 mins", completed: false, reward: 100 },
    { id: 3, title: "No Social Media (1hr)", completed: false, reward: 150 },
  ]);

  // --- ACTIONS ---
  const toggleFont = () => setIsDyslexic((prev) => !prev);

  // Difficulty Multipliers
  const REWARDS = { Easy: 50, Medium: 100, Hard: 300 };

  const completeTask = (taskTitle, difficulty) => {
    const pointsEarned = REWARDS[difficulty] || 50;
    setCoins((prev) => prev + pointsEarned);
    
    const newRecord = {
      id: Date.now(),
      title: taskTitle,
      difficulty: difficulty,
      points: pointsEarned,
      date: new Date().toLocaleDateString()
    };
    setHistory((prev) => [newRecord, ...prev]);
    return pointsEarned; 
  };

  const toggleDailyTask = (id) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!task.completed) setCoins(c => c + task.reward);
        else setCoins(c => c - task.reward);
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const buyItem = (cost) => {
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      return true;
    }
    return false;
  };

  const useCharge = () => {
    if (charges > 0) {
      setCharges((prev) => prev - 1);
      return true;
    }
    return false;
  };

  const rechargeMenu = (amount) => setCharges((prev) => prev + amount);

  return (
    <UserContext.Provider value={{ 
        isDyslexic, toggleFont, coins, charges, history, dailyTasks,
        buyItem, useCharge, rechargeMenu, completeTask, toggleDailyTask
    }}>
      <div className={isDyslexic ? "font-dyslexic" : ""}>{children}</div>
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);