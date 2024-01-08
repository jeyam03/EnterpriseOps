import React, { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import CollapsibleTable from '../../components/CollapsibleTable';
import PageTitle from '../../components/PageTitle';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { SALE_URL } from '../../API/calls';

const SalesScreen = () => {
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    axios.get(`${SALE_URL}/get-sales`)
      .then((res) => {
        res.data.forEach(element => {
          element?.details?.forEach(item => {
            item['amount'] = (
              (item?.saleRate * (item?.piece / item?.piecesPerCase)) +
              (item?.saleRate * item?.case)
            ).toFixed(2);
          })
        })

        res.data.sort((a, b) => {
          return parseInt(b._id.slice(1)) - parseInt(a._id.slice(1));
        })

        setFetchedData(res.data);
      })
  }, [])

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.code === "Enter") {
      navigate('/sales/add');
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  console.log(fetchedData);

  const OuterTable = {
    'Bill Number': ['_id', '15vw'],
    'Party ID': ['party_id', '15vw'],
    'Party Name': ['party_name', '30vw'],
    'Route': ['route', '15vw'],
    'Date': ['date', '15vw'],
    'Total Amount': ['totalAmount', '15vw'],
    'Credit': ['credit', '15vw'],
  }

  const InnerTable = {
    'Product ID': ['p_id', '15vw'],
    'Product Name': ['productName', '30vw'],
    'Case': ['case', '10vw'],
    'Piece': ['piece', '10vw'],
    'Pieces/Case': ['piecesPerCase', '10vw'],
    'Sale Rate (Per Case)': ['saleRate', '10vw'],
    'Amount': ['amount', '10vw']
  }

  const metadataFunction = (data) => {
    const totalSalesAmount = data.reduce((sum, row) => {
      const rowAmount = parseFloat(row.totalAmount);
      return isNaN(rowAmount) ? sum : sum + rowAmount;
    }, 0);

    return `Rs. ${totalSalesAmount}`;
  }

  const metadataFunction2 = (data) => {
    const totalCredit = data.reduce((sum, row) => {
      const rowAmount = parseFloat(row.credit);
      return isNaN(rowAmount) ? sum : sum + rowAmount;
    }, 0);

    return `Rs. ${totalCredit}`;
  }

  return (
    <div className='pl-4 pr-12 flex flex-col gap-4 w-full -mt-16'>
      <div className='flex justify-between'>
        <PageTitle title={'Sales'} className={'w-1/2 text-right'} />
        <CustomButton
          onClick={() => { navigate('/sales/add') }}
          icon={<IoMdAdd />}
          text={'Add New Sale'}
        />
      </div>

      <CollapsibleTable
        data={fetchedData}
        OuterTable={OuterTable}
        InnerTable={InnerTable}
        editUrl={'/sales/edit'}
        deleteUrl={`${SALE_URL}/delete-sale`}
        innerTableTitle={'Sales Details'}
        metadataTitle={'Total Sales Amount'}
        metadataFunction={metadataFunction}
        metadataTitle2={'Total Credit'}
        metadataFunction2={metadataFunction2}
        dateQuery
      />

    </div>
  )
}

export default SalesScreen