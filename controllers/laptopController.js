import csv from "csv-parser";
import fs from "fs";
import Laptop from "../models/Laptop.js";
import History from "../models/History.js";
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
            dateAdded: results[i].dateAdded,
            assignedUser: results[i].assignedUser,
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
    const { computerName, make, model, assignedUser, history, comments } =
      req.body;
    if (!computerName || !make || !model) {
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
      assignedUser,
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

    const { computerName, make, model, assignedUser, history, comments } =
      req.body;

    const laptop = await Laptop.findByIdAndUpdate(
      { _id: laptopID },
      { computerName, make, model, assignedUser, history, comments },
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
    const laptops = await Laptop.find();
    if (laptops.length > 0) {
      res.status(StatusCodes.OK).json({ laptops });
    } else if (laptops < 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "no laptops found" });
    }
  } catch (error) {
    res.send(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const addHistory = async (req, res) => {
  const { computerName, user, author } = req.body;

  const getComputer = await Laptop.findOne({ computerName });
  if (!getComputer) {
    res.status(StatusCodes.BAD_GATEWAY).json({ error: "something is wrong" });
  }

  try {
    const history = await History.create({
      laptop: getComputer._id,
      user,
      author,
    });

    const addHistoryIdToLaptop = await Laptop.findByIdAndUpdate(
      { _id: getComputer.id },
      { $push: { history: history._id } },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json({
      history,
      addHistoryIdToLaptop: {
        history: addHistoryIdToLaptop.history,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteHistory = async (req, res) => {
  try {
    const historyId = req.params.id;

    const laptopHistory = await Laptop.updateMany(
      {},
      {
        $pull: { history: { $in: [historyId] } },
      }
    );
    const getHistory = await History.findOneAndDelete({ historyId });
    if (!getHistory) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "no history found" });
      return;
    } else {
      res.status(StatusCodes.OK).json({
        message: "history deleted",
        laptopHistory,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export {
  uploadLaptops,
  addLaptop,
  updateLaptop,
  getAllLaptops,
  addHistory,
  deleteHistory,
};
