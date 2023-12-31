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

import RealTimeInputTable from '../../components/RealTimeInputTable';
import CustomButton from '../../components/CustomButton';
import HighlightedNumber from '../../components/HighlightedNumber';
import PageTitle from '../../components/PageTitle';
import CustomTextField from '../../components/CustomTextField';
import NumbersIcon from '@mui/icons-material/Numbers';

import axios from 'axios';
import { PURCHASE_URL } from '../../API/calls';

dayjs.extend(customParseFormat);

const AddEditPurchaseScreen = () => {
  const navigate = useNavigate();
  const [billno, setBillno] = useState("");
  const [date, setDate] = useState(dayjs());
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [tableData, setTableData] = useState([
    { p_id: '', productName: '', quantity: '', rateOfProduct: '', amount: '' },
  ]);
  const [edit, setEdit] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setEdit(true);

      axios.get(`${PURCHASE_URL}/get-bill-entry/${id} `)
        .then((res) => {
          console.log(res);
          setBillno(res.data.billno);
          setDate(dayjs(res.data.date));
          setTotalAmount(res.data.totalAmount);
          setTableData(res.data.details);
        })
    }
  }, [id]);

  useEffect(() => {
    if (tableData) {
      const tot = tableData.reduce((sum, row) => {
        const rowAmount = parseFloat(row.amount);
        return isNaN(rowAmount) ? sum : sum + rowAmount;
      }, 0);

      setTotalAmount(tot.toFixed(2));

      const quant = tableData.reduce((sum, row) => {
        const rowQuantity = parseInt(row.quantity);
        return isNaN(rowQuantity) ? sum : sum + rowQuantity;
      }, 0);

      setTotalQuantity(quant);
    }
  }, [tableData])

  return (
    <div className='px-8 flex flex-col gap-4 w-full'>
      <div className='flex gap-4 items-center'>
        <CustomButton
          className={'!p-2'}
          onClick={() => {
            navigate('/purchases/')
          }}
          icon={<IoChevronBack />}
        />
        <PageTitle className={'!text-2xl'} title={`${edit ? 'Edit' : 'Add New'} Purchase`} />
      </div>

      <div className='flex flex-row items-center gap-8 w-full'>
        <CustomTextField
          label='Bill Number'
          className='w-1/4'
          valueState={[billno, setBillno]}
          icon={<NumbersIcon />}
          autoFocus
        />

        <div className='w-1/4'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, }, }}
                label='Date'
                format="DD-MMM-YYYY"
                className='w-full'
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <HighlightedNumber
          title={'Total Quantity'}
          value={totalQuantity}
        />

        <HighlightedNumber
          title={'Total Amount'}
          value={`Rs. ${totalAmount} `}
        />

      </div>

      <RealTimeInputTable tableState={[tableData, setTableData]} />

      <div className='flex justify-end mt-4'>
        <CustomButton
          onClick={() => {
            let valid = true;

            if (billno === null || billno === undefined || billno === '') {
              valid = false;
              return window.alert('Enter bill number');
            }

            tableData.forEach((item) => {
              if (Object.values(item).every((value) => value === '')) {
                return;
              }
              Object.values(item).forEach((value) => {
                if (value === null || value === undefined || value === '') {
                  valid = false;
                }
              });
            });

            const filteredTableData = tableData.filter((item) => {
              return !Object.values(item).every((value) => value === '');
            });

            if (valid) {
              console.log(billno);
              console.log(tableData);
              console.log(date.format('DD-MMM-YYYY'));

              if (edit) {
                axios.put(`${PURCHASE_URL}/update-entry/${id}`, {
                  billno: billno,
                  totalAmount: totalAmount,
                  date: date.format('DD-MMM-YYYY'),
                  details: filteredTableData.map((item) => {
                    return {
                      p_id: item.p_id,
                      rateOfProduct: item.rateOfProduct,
                      quantity: item.quantity
                    }
                  })
                })
                  .then((res) => {
                    console.log(res)
                    navigate('/purchases/');
                  })
                  .catch((err) => {
                    console.log(err);
                  })
              } else {
                axios.post(`${PURCHASE_URL}/add-entry`, {
                  billno: billno,
                  totalAmount: totalAmount,
                  date: date.format('DD-MMM-YYYY'),
                  details: filteredTableData.map((item) => {
                    return {
                      p_id: item.p_id,
                      rateOfProduct: item.rateOfProduct,
                      quantity: item.quantity
                    }
                  })
                })
                  .then((res) => {
                    console.log(res)
                    navigate('/purchases/');
                  })
                  .catch((err) => {
                    console.log(err);
                  })
              }
            } else {
              window.alert('Enter all fields in the table');
            }
          }}
          icon={<IoMdCheckmarkCircleOutline />}
          text={`Confirm & ${edit ? 'Edit' : 'Add'} Purchase`}
        />
      </div>
    </div>
  )
}

export default AddEditPurchaseScreen