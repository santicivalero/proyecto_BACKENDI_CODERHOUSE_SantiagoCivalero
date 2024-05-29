import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;

    if (fs.existsSync(this.path)) {
      try {
        this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      } catch (error) {
        this.carts = [];
      }
    } else {
      this.carts = [];
    }
  }

  async addCart() {
    const newCart = {
      id: this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: [],
    };

    this.carts.push(newCart);

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t")
      );

      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cid, pid, quantity) {
    const cartIndex = this.carts.findIndex((cart) => cart.id == cid);

    if (cartIndex === -1) {
      console.log("No se encontró el carrito");
      return;
    }

    const productIndex = this.carts[cartIndex].products.findIndex(
      (product) => product.id === pid
    );
    
    quantity = Number(quantity);
    if (productIndex === -1) {
      this.carts[cartIndex].products.push({
        id: pid,
        quantity,
      });
    } else {
      this.carts[cartIndex].products[productIndex].quantity += quantity;
    }

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t")
      );

      console.log("Se agregó el producto al carrito correctamente");
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsFromCart(cid) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === Number(cid));

    if (cartIndex === -1) {
      console.log("No se encontró el carrito");
      return;
    }

    return this.carts[cartIndex].products;
  }
}

export default new CartManager("./src/data/carts.json");