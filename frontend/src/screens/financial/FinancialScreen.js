import React, { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import CustomButton from '../../components/CustomButton';
import CollapsibleTable from '../../components/CollapsibleTable.js';
import { FINANCIALS_URL } from '../../API/calls';
import axios from 'axios';

const FinancialScreen = () => {
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    axios.get(`${FINANCIALS_URL}/get-financial`)
      .then((res) => {
        res.data.forEach((item) => {
          item['mongoId'] = item['_id'];
        })

        setFetchedData(res.data);
      })
  }, [])

  const OuterTable = {
    'Ref ID': ['mongoID', '5vw'],
    'Date': ['date', '15vw'],
    'Description': ['description', '20vw'],
    'Amount': ['amount', '10vw'],
    'Category': ['category', '10vw'],
    'Txn Type': ['txn_type', '10vw'],
  }

  const metadataFunction = (data) => {
    const netAmount = data.reduce((sum, row) => {
      const rowAmount = parseFloat(row.amount);
      if (row.txn_type === 'Debit') {
        return isNaN(rowAmount) ? sum : sum - rowAmount;
      }
      return isNaN(rowAmount) ? sum : sum + rowAmount;
    }, 0);

    return `Rs. ${netAmount}`;
  }

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.code === "Enter") {
      navigate('/financials/add');
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className='pl-4 pr-12 flex flex-col gap-4 w-full -mt-16'>
      <div className='flex justify-between'>
        <PageTitle title={'Records'} className={'w-1/2 text-right'} />
        <CustomButton
          onClick={() => { navigate('/financials/add') }}
          icon={<IoMdAdd />}
          text={'Add New Data'}
        />
      </div>

      <CollapsibleTable
        data={fetchedData}
        OuterTable={OuterTable}
        editUrl={'/financials/edit'}
        deleteUrl={`${FINANCIALS_URL}/delete-financial`}
        metadataTitle='Net Amount'
        metadataFunction={metadataFunction}
        dateQuery
      />
    </div>
  )
}

export default FinancialScreen
