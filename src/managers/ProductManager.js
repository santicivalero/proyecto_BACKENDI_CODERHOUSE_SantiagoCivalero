import { productModel as Product } from '../models/product.model.js';
import CustomError from "../classes/CustomError.js";

class ProductManager {
  constructor() {}

  // Crear producto
  async addProduct(product) {
    const { title, description, code, price, stock, category, thumbnails } = product;

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
      console.log("Todos los campos son obligatorios");
      throw new CustomError("Todos los campos son obligatorios", 400);
    }

    try {
      const newProduct = new Product({ title, description, code, price, stock, category, thumbnails });
      await newProduct.save();
      console.log("Se agregó el producto correctamente");
      return newProduct;
    } catch (error) {
      if (error.code === 11000) { // Error de clave duplicada
        console.log("El código ya existe");
        throw new CustomError("El código ya existe", 400);
      }
      console.log("Error al agregar el producto", error);
      throw new CustomError("Error al agregar el producto", 500);
    }
  }

  // Obtener todos los productos
  async getProducts(limit = 10, page = 1, sort, query) {
    try {
      const filter = query ? { $or: [{ category: query }, { availability: query }] } : {};
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
      };
      const products = await Product.paginate(filter, options);
      return {
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
      };
    } catch (error) {
      console.log("Error al obtener los productos", error);
      throw new CustomError("Error al obtener los productos", 500);
    }
  }

  // Obtener un producto
  async getProductById(idProduct) {
    try {
      const product = await Product.findById(idProduct);
      if (!product) {
        console.log("No se encontró el producto");
        throw new CustomError("No se encontró el producto", 404);
      }
      return product;
    } catch (error) {
      console.log("Error al obtener el producto", error);
      throw new CustomError("Error al obtener el producto", 500);
    }
  }

  // Eliminar un producto
  async deleteProduct(idProduct) {
    console.log(idProduct);
    try {
      const product = await Product.findByIdAndDelete(idProduct);
      if (!product) {
        console.log("No se encontró el producto");
        throw new CustomError("No se encontró el producto", 404);
      }
      console.log("Se eliminó el producto correctamente");
      return idProduct;
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw new CustomError("Error al eliminar el producto", 500);
    }
  }

  // Actualizar un producto
  async updateProduct(idProduct, product) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(idProduct, product, { new: true });
      if (!updatedProduct) {
        console.log("No se encontró el producto");
        throw new CustomError("No se encontró el producto", 404);
      }
      console.log("Se actualizó el producto correctamente");
      return updatedProduct;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw new CustomError("Error al actualizar el producto", 500);
    }
  }
}

export const productManager = new ProductManager();






// import fs from "fs";
// import __dirname from "../dirname.js";
// import path from "path";
// import CustomError from "../classes/CustomError.js";
// import Product from "../classes/Product.js";


// class ProductManager {
//   constructor(path) {
//     this.path = path;

//     if (fs.existsSync(this.path)) {
//       try {
//         this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
//       } catch (error) {
//         this.products = [];
//       }
//     } else {
//       this.products = [];
//     }
//   }

//   // Crear producto
//   async addProduct(product) {
//     const { title, description, code, price, stock, category, thumbnails } = product;

//     if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
//       console.log("Todos los campos son obligatorios");
//       throw new CustomError("Todos los campos son obligatorios", 400);
//     }

//     if (this.products.some((p) => p.code === code)) {
//       console.log("El código ya existe");
//       throw new CustomError("El código ya existe", 400);
//     }

//     const newProduct = new Product(title, description, code, price, stock, category, thumbnails);

//     if (this.products.length > 0) {
//       const newId = this.products[this.products.length - 1].id + 1;
//       newProduct.id = newId;
//     } else {
//       newProduct.id = 1;
//     }

//     this.products.push(newProduct);

//     try {
//       this.writeToFile();
//       console.log("Se agregó el producto correctamente");
//       return product;
//     } catch (error) {
//       throw new Error(error);
//     }
//   }

//   // Obtener todos los productos
//   getProducts() {
//     console.log(this.products)
//     return this.products;
//   }

//   // Obtener un producto
//   getProductById(idProduct) {
//     if (isNaN(Number(idProduct))) {
//       console.log("El id debe ser un número");
//       throw new CustomError("El id debe ser un número", 400);
//     }

//     const product = this.products.find(
//       (product) => product.id === Number(idProduct)
//     );
  
//     if (!product) {
//       console.log("No se encontró el producto");
//       throw new CustomError("No se encontró el producto", 404);
//     }
//     console.log(product);
//     return product;
//   }

//   // Eliminar un producto
//   async deleteProduct(idProduct) {
//     if (isNaN(Number(idProduct))) {
//       console.log("El id debe ser un número");
//       throw new CustomError("El id debe ser un número", 400);
//     }

//     const productIndex = this.products.findIndex(
//       (product) => product.id === Number(idProduct)
//     );

//     if (productIndex === -1) {
//       throw new CustomError("No se encontró el producto", 404);
//     }

//     this.products.splice(productIndex, 1);

//     try {
//       let eliminar = true
//       this.writeToFile(eliminar);

//       console.log("Se eliminó el producto correctamente");
//       return idProduct;
//     } catch (error) {
//       console.log(error);
//       throw new Error(error);
//     }
//   }

//   // Actualizar un producto
//   async updateProduct(idProduct, product) {
//     if (isNaN(Number(idProduct))) {
//       console.log("El id debe ser un número");
//       throw new CustomError("El id debe ser un número", 400);
//     }

//     const { code } = product;
//     if (code) {
//       if (this.products.some((p) => p.code === code)) {
//         console.log("El código ya existe");
//         throw new CustomError("El código ya existe", 400);
//       }
//     }

//     const productIndex = this.products.findIndex(
//       (product) => product.id === Number(idProduct)
//     );

//     if (productIndex === -1) {
//       console.log("No se encontró el producto");
//       throw new CustomError("No se encontró el producto", 404);
//       }
      
//     const productOld = this.products[productIndex];

//     const updatedProduct = this.products[productIndex] = {
//       ...productOld,
//       ...product,
//     };

//     try {
//       this.writeToFile();

//       console.log("Se actualizó el producto correctamente");
//       return updatedProduct;
//     } catch (error) {
//       throw new Error(error);
//     }
//   }

//   // Escribir en el archivo
//   async writeToFile(eliminar) {
//     try {
//       await fs.promises.writeFile(
//         this.path,
//         JSON.stringify(this.products, null, "\t")
//       );
//       if (eliminar) {
//         console.log("Los productos se han eliminado del archivo correctamente.");
//       } else {
//         console.log("Los productos se han escrito en el archivo correctamente.");
//       }
//     } catch (error) {
//       console.log("Error al escribir en el archivo:", error);
//     }
//   }

// }

// export const productManager = new ProductManager(path.resolve(__dirname, "./data/products.json"));

