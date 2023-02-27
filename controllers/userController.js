import User from "../models/User.js";
import Laptop from "../models/Laptop.js";
import csv from "csv-parser";
import fs from "fs";
import { StatusCodes } from "http-status-codes";

const uploadUsers = async (req, res) => {
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
          const laptop = await User.create({
            name: results[i].name,
            email: results[i].email,
          });
          res.status(StatusCodes.CREATED).json({
            laptop,
          });
        }
      } catch (error) {}
    });
};

const addUser = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    const userAlreadyExist = await User.findOne({ name });
    if (userAlreadyExist) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "user already exist",
      });
      return;
    }
    const user = await User.create({
      name,
      email,
      department,
      added_date: Date.now(),
    });

    res.status(StatusCodes.CREATED).json({
      user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;

  const { name, email, department } = req.body;

  const userExist = await User.findOne({ name });

  if (userExist && userExist._id !== userId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "name already exist, please check name and try again",
    });
    return;
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      name,
      email,
      department,
    },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    user,
  });
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (getAllUser < 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "no users found",
      });
      return;
    } else {
      res.status(StatusCodes.OK).json({
        users,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  res.send("user deleted");
};

const assignUser = async (req, res) => {
  try {
    const { userName, computerName } = req.body;
    const user = await User.findOne({ userName });
    const laptop = await Laptop.findOne({ computerName });

    if (!user || !laptop) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "no user/laptop found",
      });
    }
    const computer = await Laptop.findOneAndUpdate(
      { _id: laptop._id },
      { current_user: user._id },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      computer,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

export { uploadUsers, updateUser, addUser, getAllUser, deleteUser, assignUser };
