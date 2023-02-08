import Laptop from "../models/Laptop.js";
import History from "../models/History.js";
import StatusCodes from "http-status-codes";

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

export { deleteHistory, addHistory };
