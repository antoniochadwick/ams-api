import Laptop from "../models/Laptop";
import History from "../models/History";
import StatusCodes from "http-status-codes";
import User from "../models/User";

const addHistory = async (computerName, user, author) => {
  const getComputer = await Laptop.findOne({ computerName });
  const getUser = await User.findOne({ user });
  if (!getComputer || !getUser) {
    res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ error: "can't find laptop or user" });
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

export default addHistory;
