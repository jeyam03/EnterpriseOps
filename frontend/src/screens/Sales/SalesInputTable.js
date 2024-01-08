import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Paper,
  FormControl,
  Autocomplete
} from '@mui/material';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { PRODUCT_URL } from '../../API/calls';

const SalesInputTable = ({ tableState = ["", (e) => { }] }) => {
  const [tableData, setTableData] = tableState;
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [lastRowDeleted, setLastRowDeleted] = useState(false);

  const handleInputChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;

    if (field === 'productName') {
      const element = products.filter((item) => `${item.productName} ${item.category} ${item.quantity} ${item.unit}` === value)[0]
      console.log(element)
      newData[index].p_id = element?.p_id;
      newData[index].piecesPerCase = element?.piecesPerCase;
      newData[index].saleRate = element?.salesRate;
      newData[index].case = 1;
    }

    if (field === 'case' || field === 'piece' || field === 'saleRate') {
      newData[index].amount = calculateAmount(newData[index].case, newData[index].piece, newData[index].piecesPerCase, newData[index].saleRate);
    }

    setTableData(newData);
  };

  useEffect(() => {
    axios.get(`${PRODUCT_URL}/get-products`)
      .then((res) => {
        setProducts(res.data);
        setProductNames(res.data.map((item) => `${item.productName} ${item.category} ${item.quantity} ${item.unit}`))
      })
  }, [])

  useEffect(() => {
    const newData = [...tableData];

    newData.forEach((item) => {
      item.amount = calculateAmount(item.case, item.piece, item.piecesPerCase, item.saleRate);
    })
  }, [tableState])

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      { p_id: '', productName: '', case: '', piece: '', piecesPerCase: '', saleRate: '', amount: '' },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (index === tableData.length - 1) {
      setLastRowDeleted(true);
    } else {
      setLastRowDeleted(false);
    }

    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  const calculateAmount = (caseQuantity, piece, piecesPerCase, rate) => {
    const parsedCase = parseFloat(caseQuantity) || 0;
    const parsedPiece = parseFloat(piece) || 0;
    const parsedPiecesPerCase = parseFloat(piecesPerCase);
    const parsedRate = parseFloat(rate);

    if (!isNaN(parsedCase) && !isNaN(parsedPiece) && !isNaN(parsedPiecesPerCase) && !isNaN(parsedRate)) {
      return (((parsedPiece / parsedPiecesPerCase) + parsedCase) * parsedRate).toFixed(2);
    }
    return '';
  }

  useEffect(() => {
    const lastRow = tableData[tableData.length - 1];

    if (!lastRowDeleted) {
      if (lastRow && (lastRow.piece !== '' || lastRow.case !== '') && lastRow.productName !== '') {
        handleAddRow();
      }
    } else {
      setLastRowDeleted(false);
    }
  }, [tableData]);

  return (
    <TableContainer component={Paper}>
      <Table size="small" dense>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Product Name</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Product ID</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Case</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Piece</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Pieces Per Case</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Sale Rate</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <FormControl fullWidth>
                  <Autocomplete
                    value={row.productName}
                    filterOptions={(options, params) => {
                      const words = params.inputValue.split(' ');
                      const filtered = options.filter((option) => {
                        return words.every((word) => {
                          return option.toLowerCase().indexOf(word.toLowerCase()) !== -1;
                        })
                      })
                      return filtered;
                    }}
                    onChange={(event, newValue) => {
                      handleInputChange(index, 'productName', newValue);
                    }}
                    options={productNames}
                    sx={{ width: 350 }}
                    renderInput={(params) => <TextField
                      {...params}
                      variant="standard"
                      size="small"
                    />}
                  />
                </FormControl>
              </TableCell>
              <TableCell>
                <p>{row.p_id}</p>
              </TableCell>
              <TableCell>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  type="number"
                  value={row.case}
                  onChange={(e) => handleInputChange(index, 'case', e.target.value)}
                  variant="standard"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  type="number"
                  value={row.piece}
                  onChange={(e) => handleInputChange(index, 'piece', e.target.value)}
                  variant="standard"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <p>{row.piecesPerCase}</p>
              </TableCell>
              <TableCell>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  type="number"
                  value={row.saleRate}
                  onChange={(e) => handleInputChange(index, 'saleRate', e.target.value)}
                  variant="standard"
                  size="small"
                />
              </TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleRemoveRow(index)}
                  className='text-xl hover:text-red-500'>
                  <IoMdClose />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomButton
        className={'!text-sm m-4'}
        onClick={handleAddRow}
        icon={<IoMdAdd />}
        text={'Add Row'}
      />
    </TableContainer>
  );
};

export default SalesInputTable;