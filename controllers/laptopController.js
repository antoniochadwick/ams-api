import csv from "csv-parser";
import fs from "fs";
import Laptop from "../models/Laptop.js";
import StatusCodes from "http-status-codes";

const uploadLaptops = async (req, res) => {
  const results = [];
  if (req.file.mimetype !== "text/csv") {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      error: "Invalid file type. Only csv allowed",
    });
  }
  if (req.file.size > 1000000) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      error: "file size too large. Max 1MB allowed",
    });
  }
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        for (let i = 0; i < results.length; i++) {
          const laptop = await Laptop.create({
            computerName: results[i].computerName,
            make: results[i].make,
            model: results[i].model,
            department: results[i].department,
            serial_number: results[i].serial_number,
            date_added: results[i].date_added,
            assign_date: results[i].assign_date,
            current_user: results[i].current_user,
            history: results[i].history,
            comments: results[i].comments,
          });
          res.status(StatusCodes.CREATED).json({
            laptop,
          });
        }
      } catch (error) {}
    });
};

const addLaptop = async (req, res) => {
  try {
    const {
      computerName,
      make,
      model,
      serial_number,
      department,
      current_user,
      history,
      comments,
    } = req.body;
    if (!computerName || !make || !model || !serial_number) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "please provide Computer name, make and model",
      });
      return;
    }
    const checkIfLaptopExist = await Laptop.findOne({ computerName });
    if (checkIfLaptopExist) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Laptop already exist" });
      return;
    }
    const laptop = await Laptop.create({
      computerName,
      make,
      model,
      serial_number,
      department,
      current_user,
      history,
      comments,
    });
    res.status(StatusCodes.CREATED).json({
      laptop,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateLaptop = async (req, res) => {
  try {
    const laptopID = req.params.id;

    const {
      computerName,
      make,
      model,
      department,
      assign_date,
      serial_number,
      current_user,
      history,
      comments,
    } = req.body;

    const laptop = await Laptop.findByIdAndUpdate(
      { _id: laptopID },
      {
        computerName,
        make,
        model,
        department,
        assign_date,
        serial_number,
        current_user,
        history,
        comments,
      },
      { new: true }
    );
    if (!laptop) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Laptop not found" });
    } else {
      res.status(StatusCodes.OK).json({ laptop });
    }
  } catch (error) {
    res.send(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.find().populate({
      path: "history",
      populate: { path: "laptop", select: "serial_number" },
    });
    if (laptops.length > 0) {
      res.status(StatusCodes.OK).json({ laptops });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "no laptops found" });
    }
  } catch (error) {
    res.send(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export { uploadLaptops, addLaptop, updateLaptop, getAllLaptops };
