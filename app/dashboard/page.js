"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import DopamineMenu from '@/components/DopamineMenu';
import { 
  ArrowLeft, Clock, MoreHorizontal, Zap, 
  CheckCircle2, Circle, Trophy, Flame
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  // Get functions from our FIXED UserContext
  const { isDyslexic, completeTask, dailyTasks, toggleDailyTask, coins } = useUser();
  
  const [task, setTask] = useState("Loading task...");
  const [subtasks, setSubtasks] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium"); // Default difficulty
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  useEffect(() => {
    // Load the task you typed on the home page
    const storedTask = localStorage.getItem("userTask");
    if (storedTask) {
      setTask(storedTask);
      setSubtasks([
        { id: 1, title: "Research phase", time: "10m", completed: false },
        { id: 2, title: "Outline main points", time: "15m", completed: false },
        { id: 3, title: "Draft first section", time: "20m", completed: false },
      ]);
    } else {
      setTask("Start a new project");
    }
  }, []);

  const handleCompleteMainTask = () => {
    // 1. Call the context function to update points & history
    const points = completeTask(task, difficulty);
    
    // 2. Show success state
    setIsTaskCompleted(true);
    
    // 3. Optional: Play a sound or showing an alert
    // alert(`Awesome! You earned ${points} Neuro-Coins!`);
  };

  return (
    <div className={`min-h-screen bg-slate-50 p-6 ${isDyslexic ? 'font-dyslexic' : ''}`}>
      
      {/* Navbar with Coin Counter */}
      <header className="flex justify-between items-center mb-8">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={20} /> <span className="font-bold">Back</span>
        </button>
        <div className="flex items-center gap-4">
           {/* Live Coin Balance */}
           <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
              <Zap className="w-4 h-4 text-yellow-600 fill-yellow-600" />
              <span className="font-bold text-yellow-800">{coins}</span>
           </div>
           <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg hover:scale-105 transition">M</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* LEFT: MAIN TASK AREA */}
        <div className="lg:col-span-2 space-y-6">
           <AnimatePresence mode="wait">
             {!isTaskCompleted ? (
               <motion.div 
                 key="task-card"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
               >
                  
                  {/* Difficulty Selector */}
                  <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    {['Easy', 'Medium', 'Hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          difficulty === level 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-start justify-between mb-6">
                    <div>
                       <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Current Focus</span>
                       <h1 className="text-3xl font-extrabold text-slate-800 mt-2 leading-tight">{task}</h1>
                    </div>
                  </div>
                  
                  {/* Subtasks List */}
                  <div className="space-y-3 mb-8">
                     {subtasks.map(t => (
                       <div key={t.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 mr-4"></div>
                          <div className="flex-1">
                             <h3 className="font-bold text-slate-700">{t.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                             <Clock size={14} /> {t.time}
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* COMPLETE BUTTON */}
                  <button 
                    onClick={handleCompleteMainTask}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 /> Mark as Complete (+{difficulty === 'Easy' ? 50 : difficulty === 'Medium' ? 100 : 300} pts)
                  </button>

               </motion.div>
             ) : (
               /* SUCCESS STATE */
               <motion.div 
                 key="success-card"
                 initial={{ scale: 0.9, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 text-center py-20"
               >
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                  >
                    <Trophy size={48} />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-emerald-800 mb-2">Excellent Work!</h2>
                  <p className="text-emerald-600 mb-8 text-lg">
                    You completed a <span className="font-bold">{difficulty}</span> task and earned points.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => router.push('/profile')} className="px-6 py-3 bg-white text-emerald-700 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-50 transition">
                      View Profile
                    </button>
                    <button onClick={() => { setIsTaskCompleted(false); router.push('/'); }} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                      Start New Task
                    </button>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* RIGHT: WIDGETS */}
        <div className="space-y-6">
           
           {/* 1. DAILY TASKS WIDGET */}
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                 <div className="p-2 bg-orange-100 rounded-xl text-orange-600"><Flame size={20} /></div>
                 <div>
                    <h3 className="font-bold text-slate-700">Daily Streaks</h3>
                    <p className="text-xs text-slate-400">Consistency is key</p>
                 </div>
              </div>
              <div className="space-y-3">
                 {dailyTasks && dailyTasks.map(dt => (
                   <button 
                     key={dt.id} 
                     onClick={() => toggleDailyTask(dt.id)}
                     className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${dt.completed ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                   >
                      <div className="flex items-center gap-3">
                         {dt.completed ? <CheckCircle2 className="text-green-500 w-5 h-5" /> : <Circle className="text-slate-300 w-5 h-5" />}
                         <span className={`text-sm font-bold ${dt.completed ? 'text-green-700 line-through' : 'text-slate-600'}`}>{dt.title}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-orange-400">+{dt.reward}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* 2. DOPAMINE MENU WIDGET */}
           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-1 shadow-xl">
              <div className="bg-slate-900/50 p-4 rounded-t-[1.8rem] flex items-center gap-2">
                 <Zap className="text-yellow-400 w-5 h-5" />
                 <h2 className="text-white font-bold">Reward Station</h2>
              </div>
              <div className="p-2">
                 <DopamineMenu />
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}