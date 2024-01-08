import React, { useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import PageTitle from '../components/PageTitle';
import dayjs from 'dayjs';
import { PieChart } from '@mui/x-charts/PieChart';

const DashboardScreen = () => {
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(dayjs());
  const [shortcut, setShortcut] = useState('Last 30 Days')
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className='px-8 flex flex-col gap-4 w-full -mt-16'>
      <PageTitle title='Dashboard' className={'w-1/2 text-right'} />
      <div className='flex flex-row gap-4 justify-between mt-2'>

        <div className='bg-orange-50 w-full h-72 rounded-3xl p-8 flex flex-wrap justify-center gap-8 overflow-auto drop-shadow-md'>
          <BigCard title='Total Sales' value='₹ 23856' />
          <BigCard title='Total Collection' value='₹ 30946' />
          <BigCard title='Total Expenses' value='₹ 45986' />
          <BigCard title='Total Purchase' value='₹ 73456' />
          <BigCard title='Inventory Stock' value='568' />
        </div>

        <div className='flex flex-col gap-8 w-1/2'>
          <div className='flex flex-row gap-4'>
            <div className='relative'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, }, }}
                    label='Start Date'
                    format="DD-MMM-YYYY"
                    className='w-1/2'
                  />
                </DemoContainer>
              </LocalizationProvider>
              <p className='text-xs text-gray-600 absolute -bottom-1 right-4 bg-white px-1'>{days[dayjs(startDate).day()]}</p>
            </div>

            <div className='relative'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    disabled={!startDate}
                    minDate={startDate}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, }, }}
                    label='End Date'
                    format="DD-MMM-YYYY"
                    className='w-1/2'
                  />
                </DemoContainer>
              </LocalizationProvider>
              <p className='text-xs text-gray-600 absolute -bottom-1 right-4 bg-white px-1'>{days[dayjs(endDate).day()]}</p>
            </div>

          </div>

          <div className='flex flex-wrap justify-center gap-4'>
            <CustomDateShortcut title='Today' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs());
              setEndDate(dayjs());
            }} />
            <CustomDateShortcut title='Yesterday' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().subtract(1, 'day'));
              setEndDate(dayjs().subtract(1, 'day'));
            }} />
            <CustomDateShortcut title='Last 7 Days' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().subtract(7, 'day'));
              setEndDate(dayjs());
            }} />
            <CustomDateShortcut title='This Week' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().startOf('week'));
              setEndDate(dayjs().endOf('week'));
            }} />
            <CustomDateShortcut title='Last 30 Days' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().subtract(30, 'day'));
              setEndDate(dayjs());
            }} />
            <CustomDateShortcut title='This Month' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().startOf('month'));
              setEndDate(dayjs().endOf('month'));
            }} />
            <CustomDateShortcut title='Last Month' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().subtract(1, 'month').startOf('month'));
              setEndDate(dayjs().subtract(1, 'month').endOf('month'));
            }} />
            <CustomDateShortcut title='This Year' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().startOf('year'));
              setEndDate(dayjs().endOf('year'));
            }} />
            <CustomDateShortcut title='Last Year' valueState={[shortcut, setShortcut]} onClick={() => {
              setStartDate(dayjs().subtract(1, 'year').startOf('year'));
              setEndDate(dayjs().subtract(1, 'year').endOf('year'));
            }} />
          </div>

          {/* <div className='h-full bg-green-100 rounded-xl'></div> */}
        </div>
      </div>

      <div className='flex flex-row gap-4'>
        <div className='w-1/3 h-96 bg-[#FFF9F6] rounded-3xl drop-shadow-md p-8'>
          <p className='text-xl font-semibold text-orange-700'>Route wise Collection</p>

          <div className='flex flex-wrap gap-12 mt-4'>
            {[...Array(6)].map((_, i) => (
              <div className='flex flex-row gap-2'>
                <p className='text-5xl font-semibold text-gray-600 font-jetbrains'>{i + 1}</p>
                <div className='flex flex-col'>
                  <p className='text-sm font-medium text-gray-600'>PSR 2</p>
                  <p className='text-xl font-semibold text-orange-700'>23856</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='w-2/3 h-96 bg-[#F3ECE9] rounded-3xl drop-shadow-md p-8'>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                innerRadius: 40,
              },
            ]}
            width={400}
            height={200}
          />
        </div>
        {/* <div className='w-1/3 h-96 bg-[#F4D5CA] rounded-xl'></div> */}
      </div>

      <p className='text-xl font-semibold text-orange-700'>Recent Transanctions</p>

    </div>
  )
}

const CustomDateShortcut = ({ title, valueState, onClick }) => {
  const [value, setValue] = valueState;

  return (
    <button
      className={`${value === title ? "bg-[#2A76D2] text-white" : "text-[#2A76D2] bg-blue-50"} font-medium text-sm rounded-full px-4 py-2`}
      onClick={() => {
        setValue(title);
        onClick();
      }}
    >
      {title}
    </button>
  )
}

const BigCard = ({ title, value }) => {
  return (
    <div className=' px-4 py-2 rounded-xl w-fit h-fit'>
      <p className="text-4xl font-semibold text-orange-800 font-ibm">{value}</p>
      <p className='font-medium text-gray-600 font-ibm'>{title}</p>
    </div>
  )
}

export default DashboardScreen