# Proyecto Backend I - Coderhouse
- Servidor de Backend simulado para un ecommerce, desarrollado como parte del curso de Backend I en Coderhouse. 
- Permite gestionar productos y carritos de compra utilizando una arquitectura modular (organizado en múltiples archivos y carpetas según funcionalidad) y conectándose a una base de datos MongoDB.

## Tecnologías Utilizadas
- **Express**: Framework para construir aplicaciones web y APIs en Node.js.

- **Websockets**: Permite la comunicación en tiempo real entre cliente y servidor.

- **Mongoose**: ODM (Object Data Modeling) para MongoDB y Node.js, facilita las operaciones con la base de datos.

- **MongoDB**: Base de datos NoSQL orientada a documentos.

- **Router**: Módulo de Express para gestionar rutas de forma modular.

- **Handlebars**: Motor de plantillas que permite crear vistas dinámicas.


## Instalación
- Clona este repositorio:
`git clone https://github.com/santicivalero/proyecto_BACKENDI_CODERHOUSE_SantiagoCivalero`

- Navega al directorio donde clonaste el repositorio: 
`cd nombre-del-directorio`

- Instala las dependencias:
`npm install`

- Inicia el servidor:
`npm run dev`

- Configuración de MongoDB

 - Descarga e instala [MongoDB Compass](https://www.mongodb.com/products/tools/compass)

 - Crear una nueva conexión en esta dirección: _mongodb://localhost:27017/proyecto_backend_I_

 - Importa los archivos JSON ubicados en _src/data/_ :
   _proyecto_backend_I.carts.json_
   _proyecto_backend_I.products.json_

## Uso
Accede a las rutas para gestionar productos y carritos desde el origen **localhost:8080**, añadiendo los siguientes endpoints
(Se puede utilizar [Postman](https://www.postman.com/)):

## Endpoints de Carritos (/api/carts)
- **POST /api/carts** → Crea un nuevo carrito.

- **GET /api/carts/:cid** → Obtiene todos los productos de un carrito específico.

- **POST /api/carts/:cid/product/:pid** → Agrega un producto al carrito.

- **DELETE /api/carts/:cid/products/:pid** → Elimina un producto específico del carrito.

- **PUT /api/carts/:cid** → Actualiza todos los productos de un carrito con una nueva lista.

- **PUT /api/carts/:cid/products/:pid** → Modifica la cantidad de un producto dentro del carrito.

- **DELETE /api/carts/:cid** → Vacía un carrito eliminando todos sus productos.

## Endpoints de Productos (/api/products)
- **GET /api/products** → Obtiene todos los productos con opciones de paginación y filtrado.

- **GET /api/products/:pid** → Obtiene un producto específico por su ID.

- **POST /api/products** → Crea un nuevo producto.

- **PUT /api/products/:pid** → Actualiza un producto existente.

- **DELETE /api/products/:pid** → Elimina un producto por su ID.

## Endpoints de Vistas (/)
- **GET /products** → Renderiza la vista principal con la lista de productos.

- **GET /products/:pid** → Renderiza la vista de detalles de un producto específico.

- **GET /carts/:cid** → Renderiza la vista de un carrito con sus productos.

- **GET /realtimeproducts** → Renderiza la vista de productos en tiempo real utilizando WebSockets.

## Autor
- Santiago Civalero (santiagocivalero@hotmail.com)





