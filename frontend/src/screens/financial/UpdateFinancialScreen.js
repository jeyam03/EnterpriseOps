import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoChevronBack } from "react-icons/io5";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from 'dayjs';

import CustomButton from '../../components/CustomButton';
import PageTitle from '../../components/PageTitle';
import CustomTextField from '../../components/CustomTextField';
import CustomAutoComplete from '../../components/CustomAutoComplete';

import axios from 'axios';
import { FINANCIALS_URL } from '../../API/calls';

dayjs.extend(customParseFormat);

const UpdateFinancialScreen = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(dayjs());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Debit');
  const [description, setDescription] = useState('');
  const [edit, setEdit] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setEdit(true);

      axios.get(`${FINANCIALS_URL}/get-financial-entry/${id} `)
        .then((res) => {
          setDate(dayjs(res.data.date));
          setAmount(res.data.amount);
          setCategory(res.data.category);
          setType(res.data.txn_type);
          setDescription(res.data.description);
        })
    }
  }, [id]);

  return (
    <div className='px-8 flex flex-col gap-4 w-full'>
      <div className='flex gap-4 items-center'>
        <CustomButton
          className={'!p-2'}
          onClick={() => {
            navigate('/financials/')
          }}
          icon={<IoChevronBack />}
        />
        <PageTitle className={'!text-2xl'} title={`${edit ? 'Edit' : 'Add New'} Transaction`} />
      </div>

      <div className='flex flex-row gap-8'>
        <div className='w-1/4 mt-2'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, }, }}
                label='Date'
                format="DD-MMM-YYYY"
                className='w-full'
                autoFocus
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <CustomAutoComplete
          label='Type'
          width={'25%'}
          valueState={[type, setType]}
          options={['Credit', 'Debit']}
        />

        <CustomAutoComplete
          label='Category'
          width={'25%'}
          valueState={[category, setCategory]}
          options={['Salary', 'Advance', 'Fuel','Repair','Office Supplies', 'Rent', 'Tax', 'Insurance', 'Loan Received', 'Loan Repayment', 'Miscellaneous']}
        />

        <CustomTextField
          label='Amount'
          className={`w-1/4 rounded-xl ${type === 'Credit' ? 'bg-green-100' : type === 'Debit' && 'bg-red-100'}`}
          valueState={[amount, setAmount]}
          type='number'
        />
      </div>

      <div className='flex flex-row gap-8'>
        <CustomTextField
          label='Description'
          className='w-1/2'
          valueState={[description, setDescription]}
          textarea
        />
      </div>

      <div className='flex justify-end mt-4'>
        <CustomButton
          onClick={() => {
            if (date === '' || amount === '' || amount === 0 || category === '' || type === '' || description === '') {
              return window.alert('Enter all fields');
            }

            if (edit) {
              axios.put(`${FINANCIALS_URL}/update-financial/${id}`, {
                date: date,
                amount: amount,
                category: category,
                txn_type: type,
                description: description,
              })
                .then((res) => {
                  window.alert('Transaction Updated Successfully');
                  navigate('/financials/');
                })
                .catch((err) => {
                  console.log(err);
                  window.alert('Error Updating Product');
                })
            } else {
              axios.post(`${FINANCIALS_URL}/add-financial`, [{
                date: date,
                amount: amount,
                category: category,
                txn_type: type,
                description: description,
              }])
                .then((res) => {
                  window.alert('Transaction Added Successfully');
                  navigate('/financials/');
                })
                .catch((err) => {
                  console.log(err);
                  window.alert('Error Adding Transaction');
                })
            }
          }}
          icon={<IoMdCheckmarkCircleOutline />}
          text={`Confirm & ${edit ? 'Edit' : 'Add'} Transaction`}
        />
      </div>
    </div>
  )
}

export default UpdateFinancialScreen
