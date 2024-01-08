import React, { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle.js';
import CustomButton from '../../components/CustomButton.js';
import CollapsibleTable from '../../components/CollapsibleTable.js';
import { PARTY_URL } from '../../API/calls.js';
import axios from 'axios';

const PartiesScreen = () => {
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    axios.get(`${PARTY_URL}/get-parties`)
      .then((res) => {
        setFetchedData(res.data);
      })
  }, [])

  const OuterTable = {
    'Party ID': ['party_id', '12vw'],
    'Party Name': ['partyName', '15vw'],
    'Route': ['route', '5vw'],
    'Avl': ['available', '2vw'],
    'Phone': ['phoneNumber', '10vw'],
    'Address': ['address', '15vw'],
    'Maps': ['coordinate', '2vw'],
  }

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.code === "Enter") {
      navigate('/parties/add');
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
        <PageTitle title={'Parties'} className={'w-1/2 text-right'} />
        <CustomButton
          onClick={() => { navigate('/parties/add') }}
          icon={<IoMdAdd />}
          text={'Add New Party'}
        />
      </div>

      <CollapsibleTable
        data={fetchedData}
        OuterTable={OuterTable}
        editUrl={'/parties/edit'}
        deleteUrl={`${PARTY_URL}/delete-party`}
      />

    </div>
  )
}

export default PartiesScreen