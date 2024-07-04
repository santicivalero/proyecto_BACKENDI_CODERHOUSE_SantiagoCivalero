import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/proyecto_backend_I')
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Detiene la aplicación si no puede conectarse a la base de datos
  }
};

export default connectDB;
