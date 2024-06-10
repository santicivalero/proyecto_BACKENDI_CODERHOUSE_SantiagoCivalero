import fs from "fs";
import __dirname from "../dirname.js";
import path from "path";
import CustomError from "../classes/CustomError.js";
import Product from "../classes/Product.js";


class ProductManager {
  constructor(path) {
    this.path = path;

    if (fs.existsSync(this.path)) {
      try {
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      } catch (error) {
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }

  async addProduct(product) {
    const { title, description, code, price, stock, category, thumbnails } = product;

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
      console.log("Todos los campos son obligatorios");
      throw new CustomError("Todos los campos son obligatorios", 400);
    }

    if (this.products.some((p) => p.code === code)) {
      console.log("El código ya existe");
      throw new CustomError("El código ya existe", 400);
    }

    const newProduct = new Product(title, description, code, price, stock, category, thumbnails);

    if (this.products.length > 0) {
      const newId = this.products[this.products.length - 1].id + 1;
      newProduct.id = newId;
    } else {
      newProduct.id = 1;
    }

    this.products.push(newProduct);

    try {
      this.writeToFile();
      console.log("Se agregó el producto correctamente");
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  getProducts() {
    console.log(this.products)
    return this.products;
  }

  getProductById(idProduct) {
    if (isNaN(Number(idProduct))) {
      console.log("El id debe ser un número");
      throw new CustomError("El id debe ser un número", 400);
    }

    const product = this.products.find(
      (product) => product.id === Number(idProduct)
    );
  
    if (!product) {
      console.log("No se encontró el producto");
      throw new CustomError("No se encontró el producto", 404);
    }
    console.log(product);
    return product;
  }

  async deleteProduct(idProduct) {
    if (isNaN(Number(idProduct))) {
      console.log("El id debe ser un número");
      throw new CustomError("El id debe ser un número", 400);
    }

    const productIndex = this.products.findIndex(
      (product) => product.id === Number(idProduct)
    );

    if (productIndex === -1) {
      throw new CustomError("No se encontró el producto", 404);
    }

    this.products.splice(productIndex, 1);

    try {
      this.writeToFile();

      console.log("Se eliminó el producto correctamente");
      return idProduct;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateProduct(idProduct, product) {
    if (isNaN(Number(idProduct))) {
      console.log("El id debe ser un número");
      throw new CustomError("El id debe ser un número", 400);
    }

    const { code } = product;
    if (code) {
      if (this.products.some((p) => p.code === code)) {
        console.log("El código ya existe");
        throw new CustomError("El código ya existe", 400);
      }
    }

    const productIndex = this.products.findIndex(
      (product) => product.id === Number(idProduct)
    );

    if (productIndex === -1) {
      console.log("No se encontró el producto");
      throw new CustomError("No se encontró el producto", 404);
      }
      
    const productOld = this.products[productIndex];

    const updatedProduct = this.products[productIndex] = {
      ...productOld,
      ...product,
    };

    try {
      this.writeToFile();

      console.log("Se actualizó el producto correctamente");
      return updatedProduct;
    } catch (error) {
      throw new Error(error);
    }
  }

  async writeToFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );
      console.log("Los productos se han escrito en el archivo correctamente.");
    } catch (error) {
      console.log("Error al escribir en el archivo:", error);
    }
  }

}



//export default new ProductManager("./src/data/products.json");
export const productManager = new ProductManager(path.resolve(__dirname, "./data/products.json"));

//test

// const productManager = new ProductManager("./src/data/products.json");

// productManager.addProduct({
//   title: "Product 1",
//   description: "Description 1",
//   code: "0001A",
//   price: 100,
//   status: true,
//   stock: 10,
//   category: "Category 1",
//   thumbnails: ["image 1"],
// });

// productManager.addProduct({
//   title: "Product 2",
//   description: "Description 2",
//   code: "0002B",
//   price: 200,
//   status: true,
//   stock: 20,
//   category: "Category 2",
//   thumbnails: ["image 2"],
// }); 

// productManager.addProduct({
//   title: "Product 3",
//   description: "Description 3",
//   code: "0003C",
//   price: 300,
//   status: true,
//   stock: 30,
//   category: "Category 3",
//   thumbnails: ["image 3"],
// });

// productManager.addProduct({
//   title: "Product 70",
//   description: "Description 70",
//   code: "0070D",
//   price: 700,
//   status: true,
//   stock: 70,
//   category: "Category 70",
//   thumbnails: ["image 70"],
// })

// productManager.getProducts();

// productManager.getProductById(1);
// productManager.getProductById("ttt");
// productManager.getProductById(350);

// productManager.updateProduct(1, {
//   title: "Product 1 Updated",
// });

// productManager.updateProduct(2, {
//   description: "Description 2 Updated",
// })

// productManager.updateProduct(50, {
//   title: "Product 50 Updated",
// })



// productManager.deleteProduct(4);

