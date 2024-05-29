import fs from "fs";

// class Product {
//   constructor(title, description, code, price, status, stock, category, thumbnails) {
//     this.id = 0;
//     this.title = title;
//     this.description = description;
//     this.code = code;
//     this.price = price;
//     this.status = status;
//     this.stock = stock;
//     this.category = category;
//     this.thumbnails = thumbnails;
//   }
//}
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
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.status ||
      !product.stock ||
      !product.category ||
      !product.thumbnails
    ) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.log("El código ya existe");
      return;
    }

    if (this.products.length > 0) {
      const newId = this.products[this.products.length - 1].id + 1;
      product.id = newId;
    } else {
      product.id = 1;
    }

    this.products.push(product);

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );

      console.log("Se agregó el producto correctamente");
    } catch (error) {
      console.log(error);
    }
  }

  getProducts() {
    console.log(this.products)
    return this.products;
  }

  getProductById(idProduct) {
    if (isNaN(Number(idProduct))) {
      console.log("El id debe ser un número");
      return;
    }

    const product = this.products.find(
      (product) => product.id === Number(idProduct)
    );

    if (!product) {
      console.log("No se encontró el producto");
      return "No se encontró el producto";
    }
    console.log(product);
    return product;
  }

  async deleteProduct(idProduct) {
    const productIndex = this.products.findIndex(
      (product) => product.id == idProduct
    );

    if (productIndex === -1) {
      console.log("No se encontró el producto");
      return;
    }

    this.products.splice(productIndex, 1);

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );

      console.log("Se eliminó el producto correctamente");
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(idProduct, product) {
    const productIndex = this.products.findIndex(
      (product) => product.id == idProduct
    );

    const productOld = this.products[productIndex];

    if (productIndex === -1) {
      console.log("No se encontró el producto");
      return;
    }

    this.products[productIndex] = {
      ...productOld,
      ...product,
    };

    try {
        await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );

      console.log("Se actualizó el producto correctamente");
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ProductManager("./src/data/products.json");

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

