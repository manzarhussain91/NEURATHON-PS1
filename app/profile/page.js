"use client";
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Trophy, History, Calendar, TrendingUp } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const { coins, history, isDyslexic } = useUser();

  return (
    <div className={`min-h-screen bg-slate-50 p-6 ${isDyslexic ? 'font-dyslexic' : ''}`}>
      
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-8">
          <ArrowLeft size={20} /> Back to Home
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
           <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-2xl">M</div>
              <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-4 border-white">
                <Trophy className="w-6 h-6 text-yellow-900" />
              </div>
           </div>
           
           <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Manzar Hussain</h1>
              <p className="text-slate-500 text-lg">Nit Silchar • Electronics & Instrumentation</p>
              
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                 <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><Zap size={20} fill="currentColor" /></div>
                    <div>
                       <div className="text-xs text-slate-400 font-bold uppercase">Balance</div>
                       <div className="text-2xl font-bold text-slate-800">{coins}</div>
                    </div>
                 </div>
                 <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full text-green-600"><TrendingUp size={20} /></div>
                    <div>
                       <div className="text-xs text-slate-400 font-bold uppercase">Tasks Done</div>
                       <div className="text-2xl font-bold text-slate-800">{history.length}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Task History List */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><History size={24} /></div>
              <h2 className="text-2xl font-bold text-slate-800">Task History</h2>
           </div>

           {history.length === 0 ? (
             <div className="text-center py-10 text-slate-400">
                <p>No tasks completed yet. Go do something awesome!</p>
             </div>
           ) : (
             <div className="space-y-4">
                {history.map((record) => (
                   <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50/50 transition border border-transparent hover:border-indigo-100">
                      <div>
                         <h3 className="font-bold text-slate-800 text-lg">{record.title}</h3>
                         <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                               record.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                               record.difficulty === 'Medium' ? 'bg-orange-100 text-orange-600' :
                               'bg-green-100 text-green-600'
                            }`}>
                              {record.difficulty}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                               <Calendar size={12} /> {record.date}
                            </span>
                         </div>
                      </div>
                      <div className="font-mono font-bold text-emerald-600 text-lg">
                         +{record.points} pts
                      </div>
                   </div>
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}