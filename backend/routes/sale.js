import express from "express";
import Sale from "../models/Sale.js";
import Party from "../models/Party.js";
import Product from "../models/Product.js";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

const router = express.Router();

router.get("/get-sales", async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $lookup: {
          from: "parties",
          localField: "party_id",
          foreignField: "party_id",
          as: "partyData",
        },
      },
      {
        $unwind: "$partyData",
      },
      {
        $unwind: "$details",
      },
      {
        $lookup: {
          from: "products",
          localField: "details.p_id",
          foreignField: "p_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $group: {
          _id: "$sbillno",
          party_id: { $first: "$party_id" },
          party_name: { $first: "$partyData.partyName" },
          date: { $first: "$date" },
          route: { $first: "$partyData.route" },
          totalAmount: { $first: "$totalAmount" },
          credit: { $first: "$credit" },
          details: {
            $push: {
              p_id: "$details.p_id",
              productName: {
                $concat: [
                  "$productData.productName",
                  " ",
                  "$productData.category",
                  " ",
                  { $toString: "$productData.quantity" },
                  " ",
                  "$productData.unit",
                ],
              },
              piecesPerCase: "$productData.piecesPerCase",
              case: "$details.case",
              piece: "$details.piece",
              saleRate: "$details.saleRate",
            },
          },
        },
      },
    ]);

    res.json(sales);
  } catch (error) {
    console.error("Error getting sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-sale/:sbillno", async (req, res) => {
  try {
    const sbillnoParam = req.params.sbillno;

    const sale = await Sale.aggregate([
      {
        $match: {
          sbillno: sbillnoParam,
        },
      },
      {
        $lookup: {
          from: "parties",
          localField: "party_id",
          foreignField: "party_id",
          as: "partyData",
        },
      },
      {
        $unwind: "$partyData",
      },
      {
        $unwind: "$details",
      },
      {
        $lookup: {
          from: "products",
          localField: "details.p_id",
          foreignField: "p_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $group: {
          _id: "$sbillno",
          party_id: { $first: "$party_id" },
          party_name: { $first: "$partyData.partyName" },
          date: { $first: "$date" },
          route: { $first: "$partyData.route" },
          totalAmount: { $first: "$totalAmount" },
          credit: { $first: "$credit" },
          details: {
            $push: {
              p_id: "$details.p_id",
              productName: {
                $concat: [
                  "$productData.productName",
                  " ",
                  "$productData.category",
                  " ",
                  { $toString: "$productData.quantity" },
                  " ",
                  "$productData.unit",
                ],
              },
              piecesPerCase: "$productData.piecesPerCase",
              case: "$details.case",
              piece: "$details.piece",
              saleRate: "$details.saleRate",
            },
          },
        },
      },
    ]);

    if (sale.length === 0) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.json(sale[0]);
  } catch (error) {
    console.error("Error getting sale:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/add-sale", async (req, res) => {
  try {
    const { sbillno, party_id, date, totalAmount, credit, details } = req.body;


    if (!sbillno || !party_id || !date || !totalAmount || !details) {
      return res.status(400).json({ error: "Missing required fields" });
    }


    const partyfind = await Party.findOne({ party_id: party_id });

    if (!partyfind) {

      return res.status(400).send("Party Not Found");
    }


    const newSale = new Sale({
      sbillno,
      party_id,
      date,
      totalAmount,
      credit,
      details,
    });


    const savedSale = await newSale.save();


    res.status(201).json(savedSale);
  } catch (error) {
    console.error("Error adding sale:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/update-sale/:id", async (req, res) => {
  try {
    const updatedData = req.body;
    if (updatedData.length == 0) {
      return res.status(401).send("No inputs given")
    }
    const updateResult = await Sale.findOneAndUpdate({ sbillno: req.params.id }, updatedData, { new: true })
    if (!updateResult) {
      return res.status(400).send("Item not found")
    }
    res.json({ data: `Bill number ${req.params.id} updated successfully`, output: req.body })
  }
  catch (err) {
    res.status(500).send(`Error : ${err}`);
  }

})

router.delete("/delete-sale/:id", async (req, res) => {
  try {
    const saleId = req.params.id;


    if (!saleId) {
      return res.status(400).send("Invalid sale ID");
    }


    const deleteResult = await Sale.findOneAndDelete({ sbillno: saleId });


    if (!deleteResult) {
      return res.status(404).send("Sale entry not found");
    }

    res.send(`Sale entry with ID ${saleId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting sale entry: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
});

//

router.get("/latest-billno", async (req, res) => {
  try {
    const latestBill = await Sale.findOne().sort({ _id: -1 }).limit(1);

    if (!latestBill) {
      return res.status(404).json({ error: "No bill found" });
    }

    res.json(latestBill.sbillno);
  } catch (error) {
    console.error("Error getting latest bill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
);

export default router;
