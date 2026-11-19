
/* =========================================
   MÓDULO DE INVENTARIO
========================================= */

import { productos } from "../data.js";


/* =========================================
   FUNCIONES AUXILIARES
========================================= */

// Formatear precios en pesos colombianos

function formatCurrency(value) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value);

}


// Evitar interpretar datos como HTML

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

}


// Determinar estado del inventario

function getStockStatus(producto) {

    if (producto.stock === 0) {
        return {
            text: "Sin Stock",
            class: "badge-danger"
        };
    }

    if (producto.stock <= producto.minimo) {
        return {
            text: "Stock Bajo",
            class: "badge-warning"
        };
    }

    return {
        text: "En Stock",
        class: "badge-success"
    };

}


/* =========================================
   RENDERIZAR PRODUCTOS
========================================= */

function renderProducts(tableBody, search = "") {

    const filteredProducts = productos.filter(producto => {

        const searchText = search.toLowerCase();

        return (
            producto.nombre.toLowerCase().includes(searchText) ||
            producto.categoria.toLowerCase().includes(searchText) ||
            String(producto.id).includes(searchText)
        );

    });


    // Mostrar mensaje si no existen resultados

    if (filteredProducts.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No se encontraron productos.
                </td>
            </tr>
        `;

        return;

    }


    // Construir filas de la tabla

    tableBody.innerHTML = filteredProducts.map(producto => {

        const status = getStockStatus(producto);

        return `
            <tr>

                <td>
                    <strong>${escapeHTML(producto.nombre)}</strong>
                </td>

                <td>
                    ${escapeHTML(producto.categoria)}
                </td>

                <td>
                    ${producto.stock} uds
                </td>

                <td>
                    ${formatCurrency(producto.precio)}
                </td>

                <td>
                    <span class="badge ${status.class}">
                        ${status.text}
                    </span>
                </td>

            </tr>
        `;

    }).join("");

}


/* =========================================
   AGREGAR PRODUCTO
========================================= */

function addProduct(tableBody, searchInput) {

    const nombre = prompt("Nombre del producto:");

    if (!nombre || !nombre.trim()) {
        return;
    }


    const categoria = prompt("Categoría del producto:");

    if (!categoria || !categoria.trim()) {
        return;
    }


    const precio = Number(prompt("Precio del producto:"));

    if (!Number.isFinite(precio) || precio <= 0) {
        alert("El precio debe ser un número mayor que cero.");
        return;
    }


    const stock = Number(prompt("Cantidad disponible:"));

    if (!Number.isInteger(stock) || stock < 0) {
        alert("El stock debe ser un número entero igual o mayor que cero.");
        return;
    }


    const minimo = Number(prompt("Stock mínimo requerido:"));

    if (!Number.isInteger(minimo) || minimo < 0) {
        alert("El stock mínimo debe ser un número entero igual o mayor que cero.");
        return;
    }


    // Crear nuevo producto

    const newProduct = {

        id: Math.max(0, ...productos.map(p => p.id)) + 1,

        nombre: nombre.trim(),

        categoria: categoria.trim(),

        precio,

        stock,

        minimo

    };


    productos.push(newProduct);


    // Actualizar tabla

    searchInput.value = "";

    renderProducts(tableBody);

}


/* =========================================
   RENDERIZAR INVENTARIO
========================================= */

export function renderInventario(container) {

    container.innerHTML = `

        <!-- CATÁLOGO DE PRODUCTOS -->

        <div class="card inventory-card">

            <!-- ENCABEZADO -->

            <div class="inventory-toolbar">

                <div>
                    <h3 class="card-title">
                        Catálogo de Productos Disponibles
                    </h3>
                </div>

                <button
                    class="btn btn-primary"
                    id="add-product-btn"
                >
                    + Agregar Producto
                </button>

            </div>


            <!-- BUSCADOR -->

            <div class="inventory-search">

                <input
                    type="text"
                    class="input"
                    id="product-search"
                    placeholder="⌕  Buscar producto, código..."
                >

            </div>


            <!-- INFORMACIÓN DEL CATÁLOGO -->

            <div class="flex-between inventory-caption">

                <span>Productos registrados</span>

                <span id="product-count"></span>

            </div>


            <!-- TABLA -->

            <div class="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Disponibilidad</th>
                        </tr>

                    </thead>

                    <tbody id="inventory-table-body">
                    </tbody>

                </table>

            </div>

        </div>

    `;


    /* =========================================
       REFERENCIAS DEL DOM
    ========================================= */

    const tableBody = container.querySelector(
        "#inventory-table-body"
    );

    const searchInput = container.querySelector(
        "#product-search"
    );

    const addButton = container.querySelector(
        "#add-product-btn"
    );

    const productCount = container.querySelector(
        "#product-count"
    );


    /* =========================================
       EVENTOS
    ========================================= */

    // Buscar productos

    searchInput.addEventListener("input", () => {

        renderProducts(
            tableBody,
            searchInput.value.trim()
        );

    });


    // Agregar productos

    addButton.addEventListener("click", () => {

        addProduct(tableBody, searchInput);

    });


    /* =========================================
       INICIALIZACIÓN
    ========================================= */

    productCount.textContent = `${productos.length} productos`;

    renderProducts(tableBody);

}
