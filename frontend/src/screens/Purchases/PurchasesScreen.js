import React, { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import CollapsibleTable from '../../components/CollapsibleTable';
import PageTitle from '../../components/PageTitle';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { PURCHASE_URL } from '../../API/calls';

const PurchasesScreen = () => {
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    axios.get(`${PURCHASE_URL}/get-all-entry`)
      .then((res) => {
        res.data.forEach(element => {
          element?.details?.forEach(item => {
            item['amount'] = item?.rateOfProduct * item?.quantity;
          })
        })

        res.data.sort((a, b) => {
          return parseInt(b.billno.slice(1)) - parseInt(a.billno.slice(1));
        })

        setFetchedData(res.data);
      })
  }, [])

  console.log(fetchedData);

  const OuterTable = {
    'Bill Number': ['billno', '15vw'],
    'Date': ['date', '15vw'],
    'Total Amount': ['totalAmount', '15vw']
  }

  const InnerTable = {
    'Product ID': ['p_id', '15vw'],
    'Product Name': ['productName', '30vw'],
    'Quantity': ['quantity', '10vw'],
    'Rate': ['rateOfProduct', '10vw'],
    'Amount': ['amount', '10vw']
  }

  const metadataFunction = (data) => {
    const totalPurchaseAmount = data.reduce((sum, row) => {
      const rowAmount = parseFloat(row.totalAmount);
      return isNaN(rowAmount) ? sum : sum + rowAmount;
    }, 0);

    return `Rs. ${totalPurchaseAmount}`;
  }

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.code === "Enter") {
      navigate('/purchases/add');
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
        <PageTitle title={'Purchases'} className={'w-1/2 text-right'} />
        <CustomButton
          onClick={() => { navigate('/purchases/add') }}
          icon={<IoMdAdd />}
          text={'Add New Purchase'}
        />
      </div>

      <CollapsibleTable
        data={fetchedData}
        OuterTable={OuterTable}
        InnerTable={InnerTable}
        editUrl={'/purchases/edit'}
        deleteUrl={`${PURCHASE_URL}/delete-entry`}
        innerTableTitle={'Purchase Details'}
        metadataTitle={'Total Purchase Amount'}
        metadataFunction={metadataFunction}
        dateQuery
      />

    </div>
  )
}

export default PurchasesScreen