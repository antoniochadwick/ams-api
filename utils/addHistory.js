import History from "../models/History";

const addHistory = async (laptopId, property, newValue) => {
  try {
    const history = await History.create({
      laptop: laptopId,
      property,
      oldValue,
      newValue,
    });
    return history;
  } catch (error) {
    console.log(error.message);
  }
};

export default addHistory;
