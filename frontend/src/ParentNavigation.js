import React, { useCallback, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { MdDashboard, MdOutlineSell, MdInventory } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaMoneyCheck, FaUsers, FaMoneyCheckAlt } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { IoMdPeople } from "react-icons/io";

const Navigation = () => {
  const navigate = useNavigate();

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'F2') {
      navigate('/collection');
    } else if (event.key === 'F4') {
      navigate('/sales');
    } else if (event.key === 'F5') {
      navigate('/purchases');
    } else if (event.key === 'F8') {
      navigate('/inventory');
    } else if (event.key === 'F9') {
      navigate('/financials');
    } 
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className='flex flex-col gap-4 py-4 w-screen'>
      <button className='flex flex-row gap-2 items-center pl-2 pr-12 w-fit' onClick={() => { navigate('/') }}>
        <img src="https://static.vecteezy.com/system/resources/thumbnails/004/334/170/small/hand-drawn-smoothie-cocktail-element-vector.jpg" alt="Juice" className='w-16' />
        <p className="text-4xl font-semibold text-orange-800 font-poppins whitespace-nowrap tracking-tight">Essha Traders</p>
      </button>
      <div className='flex flex-row gap-6 w-full'>
        <div className='flex flex-col pl-4 w-1/5'>
          <NavButton title='Dashboard' link='/' icon={<MdDashboard />}  />
          <NavButton title='Sales Collection' link='/collection' icon={<FaMoneyCheckAlt />} shortcut={'F2'} />
          <NavButton title='Sales' link='/sales' icon={<MdOutlineSell />} shortcut={'F4'} />
          <NavButton title='Purchases' link='/purchases' icon={<BiSolidPurchaseTag />} shortcut={'F5'} />
          <NavButton title='Inventory' link='/inventory' icon={<MdInventory />} shortcut={'F8'} />
          <NavButton title='Financials' link='/financials' icon={<FaMoneyCheck />} shortcut={'F9'} />
          <NavButton title='Employees' link='/employees' icon={<IoMdPeople />}  />
          <NavButton title='Parties' link='/parties' icon={<FaUsers />}  />
          <NavButton title='Yearly Summary' link='/yearly-summary' icon={<IoCalendarOutline />} />
        </div>

        <div className='w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ title, link, icon, shortcut }) => {
  const navigate = useNavigate();
  const loc = window.location.pathname;

  return (
    <button
      className={`p-2 rounded-xl text-left text-lg flex flex-row items-center gap-3 ${((loc === link) || (link !== '/' && loc.startsWith(link))) ? 'text-orange-700 font-semibold bg-orange-100' : 'text-gray-700 font-medium'}`}
      onClick={() => navigate(link)}
    >
      {icon && React.cloneElement(icon)} {title}
      {<span className='ml-auto text-xs font-light text-gray-500'>{shortcut}</span>}
    </button>
  )
}

export default Navigation;