const { default: mongoose } = require("mongoose");
const dbConnection = () => {
  mongoose
    .connect(
      `mongodb+srv://mahmod:mahmod123@cluster0.bwsgneg.mongodb.net/ecommerce`
    )
    .then((conn) =>
      console.log(`data connected on ${process.env.DB_CONNECTION}`)
    )
    .catch((err) => console.log(`data error ${err}`));
};

module.exports = dbConnection;
