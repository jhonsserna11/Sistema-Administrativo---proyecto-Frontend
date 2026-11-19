
/* =========================================
   DASHBOARD
========================================= */

import { productos, ventas, canales } from "../data.js";


/* =========================================
   FUNCIONES AUXILIARES
========================================= */

function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value);
}


/* =========================================
   RENDERIZAR DASHBOARD
========================================= */

export function renderDashboard(container) {

    // Calcular estadísticas

    const totalVentas = ventas.reduce(
        (total, venta) => total + venta.cantidad * venta.precioUnitario,
        0
    );

    const productosVendidos = ventas.reduce(
        (total, venta) => total + venta.cantidad,
        0
    );

    const totalStock = productos.reduce(
        (total, producto) => total + producto.stock,
        0
    );

    const valorInventario = productos.reduce(
        (total, producto) => total + producto.stock * producto.precio,
        0
    );


    // Obtener productos más vendidos

    const ventasPorProducto = productos.map(producto => {

        const cantidad = ventas
            .filter(venta => venta.productoId === producto.id)
            .reduce((total, venta) => total + venta.cantidad, 0);

        return {
            ...producto,
            cantidadVendida: cantidad
        };

    });

    const productosMasVendidos = [...ventasPorProducto]
        .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
        .slice(0, 5);


    // Obtener ventas recientes

    const ventasRecientes = [...ventas]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, 5);


    // Calcular canales

    const totalCanales = canales.reduce(
        (total, canal) => total + canal.ventas,
        0
    );


    /* =========================================
       CONSTRUIR HTML
    ========================================= */

    container.innerHTML = `

        <!-- ESTADÍSTICAS PRINCIPALES -->

        <div class="grid grid-4">

            <div class="card stat-card">
                <span class="stat-label">Ventas Totales</span>
                <h2>${formatCurrency(totalVentas)}</h2>
                <span class="stat-description">Ingresos registrados</span>
            </div>

            <div class="card stat-card">
                <span class="stat-label">Productos Vendidos</span>
                <h2>${productosVendidos}</h2>
                <span class="stat-description">Unidades comercializadas</span>
            </div>

            <div class="card stat-card">
                <span class="stat-label">Stock Disponible</span>
                <h2>${totalStock}</h2>
                <span class="stat-description">Unidades en inventario</span>
            </div>

            <div class="card stat-card">
                <span class="stat-label">Valor del Inventario</span>
                <h2>${formatCurrency(valorInventario)}</h2>
                <span class="stat-description">Valor según precios actuales</span>
            </div>

        </div>


        <!-- SECCIÓN CENTRAL -->

        <div class="grid grid-2 section-spacing">

            <!-- VENTAS RECIENTES -->

            <div class="card">

                <div class="flex-between">
                    <h3 class="card-title">Ventas Recientes</h3>
                    <span class="dashboard-caption">Últimas transacciones</span>
                </div>

                <div class="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Fecha</th>
                                <th>Canal</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${ventasRecientes.map(venta => {

                                const producto = productos.find(
                                    p => p.id === venta.productoId
                                );

                                const total = venta.cantidad * venta.precioUnitario;

                                return `
                                    <tr>
                                        <td>${producto.nombre}</td>
                                        <td>${venta.fecha}</td>
                                        <td>${venta.canal}</td>
                                        <td>${formatCurrency(total)}</td>
                                    </tr>
                                `;

                            }).join("")}

                        </tbody>

                    </table>

                </div>

            </div>


            <!-- PRODUCTOS MÁS VENDIDOS -->

            <div class="card">

                <h3 class="card-title">Productos Más Vendidos</h3>

                <div class="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Unidades</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${productosMasVendidos.map(producto => `

                                <tr>
                                    <td>${producto.nombre}</td>

                                    <td>
                                        <strong>${producto.cantidadVendida}</strong>
                                    </td>

                                    <td>
                                        <span class="badge badge-success">
                                            Disponible
                                        </span>
                                    </td>
                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>


        <!-- CANALES DE VENTA -->

        <div class="card section-spacing">

            <h3 class="card-title">Ventas por Canal</h3>

            <div class="channel-list">

                ${canales.map(canal => {

                    const porcentaje = totalCanales > 0
                        ? (canal.ventas / totalCanales) * 100
                        : 0;

                    return `

                        <div class="channel-item">

                            <div class="flex-between">
                                <span>${canal.nombre}</span>

                                <strong>
                                    ${formatCurrency(canal.ventas)}
                                </strong>
                            </div>

                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    style="width: ${porcentaje}%"
                                ></div>
                            </div>

                            <span class="dashboard-caption">
                                ${porcentaje.toFixed(1)}%
                            </span>

                        </div>

                    `;

                }).join("")}

            </div>

        </div>

    `;

}
