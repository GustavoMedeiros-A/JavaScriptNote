let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// mongoose.set("strictQuery", true)

mongoose.connect("mongodb://127.0.0.1/javascriptNote", {
    useNewUrlParser: true, // Novas ferramentas mongoose
    useUnifiedTopology: true, // Indexação dos conteúdos
}).then(() => console.log("Connection successful"))
  .catch((err) => console.log(err))