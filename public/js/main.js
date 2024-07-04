const socket = io();

// Actualizar la lista de productos
function updateProductList(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    console.log(products);
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <h3>${product.title}</h3>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Code:</strong> ${product.code}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
        productList.appendChild(card);
    });
}

// Recibir actualización de productos
socket.on('updateProducts', (products) => {
    updateProductList(products);
});

// Mostrar mensajes de error
socket.on('productError', (message) => {
    alert(`Error: ${message}`);
});

// Crear un nuevo producto
function createProduct() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnails = [];

    const product = { title, description, code, price, stock, category, thumbnails };
    socket.emit('createProduct', product);
}

// Eliminar un producto
function deleteProduct(productId) {
    console.log(productId);
    socket.emit('deleteProduct', productId);
}