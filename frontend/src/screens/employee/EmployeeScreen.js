import React, { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import CustomButton from '../../components/CustomButton';
import CollapsibleTable from '../../components/CollapsibleTable.js';
import { EMPLOYEE_URL } from '../../API/calls';
import axios from 'axios';


const EmployeeScreen = () => {
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    axios.get(`${EMPLOYEE_URL}/get-employees`)
      .then((res) => {
        res.data.forEach((item) => {
          item['mongoId'] = item['_id'];
        })

        setFetchedData(res.data);
      })
  }, [])

  const OuterTable = {
    'Ref ID': ['mongoID', '5vw'],
    'Name': ['name', '20vw'],
    'Employee Type': ['empType', '15vw'],
    'Date of Joining': ['dateOfJoining', '15vw'],
    'Date of Leaving': ['dateOfLeaving', '15vw'],
    'Salary': ['salary', '15vw'],
  };

  const metadataFunction = (data) => {
    const netSalary = data.reduce((sum, row) => {
      const rowSalary = parseFloat(row.salary);
      return isNaN(rowSalary) ? sum : sum + rowSalary;
    }, 0);

    return `Rs. ${netSalary}`;
  }

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.code === "Enter") {
      navigate('/employees/add');
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
        <PageTitle title={'Employees'} className={'w-1/2 text-right'} />
        <CustomButton
          onClick={() => { navigate('/employees/add') }}
          icon={<IoMdAdd />}
          text={'Add New Employee'}
        />
      </div>

      <CollapsibleTable
        data={fetchedData}
        OuterTable={OuterTable}
        editUrl={'/employees/edit'}
        deleteUrl={`${EMPLOYEE_URL}/delete-employee`}
        metadataTitle='Total Salary'
        metadataFunction={metadataFunction}
      />
    </div>
  )
}

export default EmployeeScreen
