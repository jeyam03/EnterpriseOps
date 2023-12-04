import React, { useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { FaArrowUpShortWide, FaArrowDownWideShort } from "react-icons/fa6";
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import HighlightedNumber from './HighlightedNumber';

const CollapsibleTable = ({ data }) => {
  const [openRows, setOpenRows] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [innerSortBy, setInnerSortBy] = useState('');
  const [innerSortOrder, setInnerSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const navigate = useNavigate();

  const handleToggleCollapse = (index) => {
    const isOpen = openRows.includes(index);
    const newOpenRows = isOpen
      ? openRows.filter((rowIndex) => rowIndex !== index)
      : [...openRows, index];
    setOpenRows(newOpenRows);
  };

  const handleSort = (column, isInnerTable = false) => {
    const currentSortBy = isInnerTable ? innerSortBy : sortBy;
    const currentSortOrder = isInnerTable ? innerSortOrder : sortOrder;

    if (currentSortBy === column) {
      isInnerTable
        ? setInnerSortOrder(currentSortOrder === 'asc' ? 'desc' : 'asc')
        : setSortOrder(currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      isInnerTable ? setInnerSortBy(column) : setSortBy(column);
      isInnerTable ? setInnerSortOrder('asc') : setSortOrder('asc');
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data
    .filter((row) => {
      if (!searchQuery) {
        const isInRange = (!startDate || !endDate || (
          (dayjs(row.date).isSame(startDate) || dayjs(row.date).isAfter(startDate)) &&
          (dayjs(row.date).isSame(endDate) || dayjs(row.date).isBefore(endDate))
        ));
        return isInRange;
      }

      const searchString = searchQuery.toLowerCase();
      const isInRange = (!startDate || !endDate || (
        (dayjs(row.date).isSame(startDate) || dayjs(row.date).isAfter(startDate)) &&
        (dayjs(row.date).isSame(endDate) || dayjs(row.date).isBefore(endDate))
      ));

      return (
        (isInRange &&
          (row.billNumber.toLowerCase().includes(searchString) ||
            row.date.toLowerCase().includes(searchString) ||
            String(row.totalAmount).includes(searchString) ||
            row.details.some((detail) =>
              Object.values(detail).some((value) =>
                String(value).toLowerCase().includes(searchString)
              )
            )))
      );
    })
    .sort((a, b) => {
      if (!sortBy) return 0;

      const compareValueA =
        sortBy === 'date' ? dayjs(a[sortBy]) : a[sortBy];
      const compareValueB =
        sortBy === 'date' ? dayjs(b[sortBy]) : b[sortBy];

      if (compareValueA < compareValueB) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (compareValueA > compareValueB) {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

  const totalPurchaseAmount = filteredData.reduce((sum, row) => {
    const rowAmount = parseFloat(row.totalAmount);
    return isNaN(rowAmount) ? sum : sum + rowAmount;
  }, 0);

  const OuterTableHeaders = {
    'Bill Number': 'billNumber',
    'Date': 'date',
    'Total Amount': 'totalAmount'
  }

  const InnerTableHeaders = {
    'Product ID': 'productId',
    'Product Name': 'productName',
    'Quantity': 'quantity',
    'Rate': 'rate',
    'Amount': 'amount'
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-row gap-6 justify-between items-center'>
        <TextField
          label="Search"
          variant="outlined"
          margin="normal"
          className='w-1/3'
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 }
          }}
        />

        <div className='w-1/2 flex flex-row gap-2 items-center'>
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

          <div className='w-10'>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                className='text-xl hover:text-red-500 mt-2'>
                <IoMdClose />
              </button>
            )}
          </div>
        </div>

        <HighlightedNumber
          className={'text-right w-1/6'}
          title={'Total Purchase Amount'}
          value={`Rs. ${totalPurchaseAmount}`}
        />

        <HighlightedNumber
          className={'text-right w-1/6'}
          title={'Total Entries'}
          value={Object.keys(filteredData).length}
        />

      </div>
      <TableContainer component={Paper}>
        <Table size="small" dense>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", width: 200 }}>S.No.</TableCell>
              {
                Object.keys(OuterTableHeaders).map((item) => (
                  <TableCell style={{ fontWeight: "bold", width: 300 }}
                    onClick={() => handleSort(OuterTableHeaders[item])}
                    className='group'
                  >
                    {item}
                    {sortBy === OuterTableHeaders[item] ? (
                      sortOrder === 'asc' ? <FaArrowUpShortWide className='inline-block ml-2' /> : <FaArrowDownWideShort className='inline-block ml-2' />
                    ) : (
                      <FaArrowUpShortWide className='hidden group-hover:inline-block ml-2 text-gray-500' />
                    )}
                  </TableCell>
                ))
              }
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => {
              const filteredRow = row.details
                .sort((a, b) => {
                  if (!innerSortBy) return 0;

                  const compareValueA = a[innerSortBy];
                  const compareValueB = b[innerSortBy];

                  if (compareValueA < compareValueB) {
                    return innerSortOrder === 'asc' ? -1 : 1;
                  } else if (compareValueA > compareValueB) {
                    return innerSortOrder === 'asc' ? 1 : -1;
                  } else {
                    return 0;
                  }
                });

              return (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.billNumber}</TableCell>
                    <TableCell>{dayjs(row.date).format('DD-MMM-YYYY')}</TableCell>
                    <TableCell>{row.totalAmount}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleCollapse(index)}
                        >
                          {openRows.includes(index) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                        <button className='text-lg text-gray-600 hover:bg-gray-100 rounded-full p-2'
                          onClick={() => {
                            navigate('/purchases/edit/' + row.billNumber)
                          }}
                        >
                          <MdOutlineEdit />
                        </button>
                        <button className='text-lg text-gray-600 hover:bg-red-100 rounded-full p-2'
                          onClick={() => {
                            if (window.confirm("Confirm Delete ?")) {
                              data.splice(index, 1);
                              window.location.reload();
                            }
                            // ADD THIS PART AFTER FINISHING BACKEND
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} className='bg-gray-50'>
                      <Collapse
                        in={openRows.includes(index)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            component="div"
                            fontWeight="600"
                          >
                            Purchase Details
                          </Typography>
                          {/* <p className='text-xl font-semibold'>Purchase Details</p> */}
                          <Table
                            size="small"
                            aria-label="purchase-details"
                            dense
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ fontWeight: "bold", width: 100 }}>S.No.</TableCell>
                                {
                                  Object.keys(InnerTableHeaders).map((item) => (
                                    <TableCell style={{ fontWeight: "bold", width: 200 }}
                                      onClick={() => handleSort(InnerTableHeaders[item], true)}
                                      className='group'
                                    >
                                      {item}
                                      {innerSortBy === InnerTableHeaders[item] ? (
                                        innerSortOrder === 'asc' ? <FaArrowUpShortWide className='inline-block ml-2' /> : <FaArrowDownWideShort className='inline-block ml-2' />
                                      ) : (
                                        <FaArrowUpShortWide className='hidden group-hover:inline-block ml-2 text-gray-500' />
                                      )}
                                    </TableCell>
                                  ))
                                }
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredRow.map((detail, detailIndex) => (
                                <TableRow key={detailIndex}>
                                  <TableCell>{detailIndex + 1}</TableCell>
                                  <TableCell>{detail.productId}</TableCell>
                                  <TableCell>{detail.productName}</TableCell>
                                  <TableCell>{detail.quantity}</TableCell>
                                  <TableCell>{detail.rate}</TableCell>
                                  <TableCell>{detail.amount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CollapsibleTable;