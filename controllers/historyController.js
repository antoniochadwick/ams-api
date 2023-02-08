import StatusCodes from "http-status-codes";
import Laptop from "../models/Laptop.js";
import History from "../models/History.js";

// const addHistory = async (req, res) => {
//   const { computerName, user, author } = req.body;

//   const getComputer = await Laptop.findOne({ computerName });
//   if (!getComputer) {
//     res.status(StatusCodes.BAD_GATEWAY).json({ error: "something is wrong" });
//   }

//   try {
//     const history = await History.create({
//       laptop: getComputer._id,
//       user,
//       author,
//     });
//     res.status(StatusCodes.CREATED).json({
//       history,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const deleteHistory = async (req, res) => {
  res.send("delete History");
};

export { deleteHistory };
