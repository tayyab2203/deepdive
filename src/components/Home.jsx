import React from 'react'
import Sidebar from './Sidebar.jsx';
import Prompt from './Prompt.jsx';

function Home() {
  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <div className='w-64 bg-[#232127]'>
        <Sidebar />
      </div>

      {/* Prompt */}
      <div className='w-full flex-1 flex'>
        <div className='flex-1 flex items-center justify-center px-6'>
          <Prompt />
        </div>
      </div>
    </div>
  );
}

export default Home;
