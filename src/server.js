require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/solicitudes', solicitudesRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});