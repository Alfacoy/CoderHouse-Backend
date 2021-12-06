# Control de versiones

**0.1.0**
* Se habilita una clase **Contenedor** encargada del manejador básico de archivos, con los metodos Save(), getById(), update(), getAll(), deleteById() y deleteAll().

**0.2.0**
* Se habilita una clase **Server** la cual se encarga de controlar las rutas de la API. 

**0.3.0**
* Se agrega una pequeña interface a la clase **Server** con la cual se hace más fácil hacer pruebas y visualizar el contenido.

**0.3.1** 
* Se agrega el script de start para que Heroku pueda levantar la aplicación en el servidor.

**0.4.0**
* Se agregan la ruta **"/api/productos"** encargada de gestionar todas las peticiones sobre productos.
* Se agrega el método PUT para modificar productos existentes.

**0.5.0** 
* Se agrega al servidor la posibilidad de trabajar con plantillas. (Solamente con Handlebars)

**0.5.1**
* Se hacen modificaciones en la documentación del proyeto.

**0.6.0** [05/12/2021]
* Se realiza una mejora en la clase **Contenedor** haciendo que esta sea más genérica. De tal forma, ya no solo 
puede guardar productos, sino que también mensajes de chat, logs de servidor, etc.
* Se agrega una clase **Socket** al proyecto para actualizar listas de productos y la manipulación de un chat.
* Se comienza a notificar fechas en el **control de versiones**.
* Se agrega a la **documentación de consignas** la clase 12 y 14.
* Se agrega un manejador para las llamadas a la API con ruta inexistente.
* Se agrega una nueva ruta **"/api/carrito"** capaz de gestionar un carro de compras. 

**0.6.1** [05/12/2021]
* Se elimina código fuera de uso en la clase **Socket**.
* Se mueve todo el proyecto a una carpeta SRC. 
* Se arreglan rutas en **Contenedor** y **Server** debido a la migración que se hace a la carpeta SRC. (Hay un error conocido acá)

**0.6.2** [05/12/2021]
* Se modifica el README.