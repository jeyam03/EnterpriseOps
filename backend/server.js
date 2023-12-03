import express from "express";
import cors from "cors";
import { connect } from './mongo/conn.js';
// import bodyParser from "body-parser";

import sales from "./routes/salesEntry.js"; 

const app = express();
const PORT = process.env.PORT||3001;

app.use(cors());
app.use(express.json());


app.listen(PORT,()=>{
  console.log("Server Listening to PORT - ",PORT);
})

app.use("/sales",sales);

connect(function (err) {
  if (err) {
    console.log('Unable to connect to Mongo.',err);
    process.exit(1);
  } 
  else {
    console.log('Connected to Mongo');
  }
});