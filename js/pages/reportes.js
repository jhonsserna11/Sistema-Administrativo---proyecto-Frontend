
/* =========================================
   MÓDULO DE REPORTES
========================================= */

import { productos, ventas, canales } from "../data.js";


/* =========================================
   FUNCIONES AUXILIARES
========================================= */

// Formatear precios

function formatCurrency(value) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value);

}


// Escapar caracteres HTML

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

}


/* =========================================
   CALCULAR INGRESOS POR PRODUCTO
========================================= */

function calculateProductRevenue() {

    const revenueByProduct = productos.map(producto => {

        // Buscar ventas correspondientes al producto

        const productSales = ventas.filter(
            venta => venta.productoId === producto.id
        );


        // Calcular unidades e ingresos

        const units = productSales.reduce(
            (total, venta) => total + venta.cantidad,
            0
        );

        const revenue = productSales.reduce(
            (total, venta) =>
                total + venta.cantidad * venta.precioUnitario,
            0
        );


        return {
            ...producto,
            unitsSold: units,
            revenue
        };

    });


    // Ordenar por ingresos y seleccionar los cinco primeros

    return revenueByProduct
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

}


/* =========================================
   CALCULAR VENTAS POR CANAL
========================================= */

function calculateChannelSales() {

    const totalSales = canales.reduce(
        (total, canal) => total + canal.ventas,
        0
    );


    return canales.map(canal => {

        const percentage = totalSales > 0
            ? (canal.ventas / totalSales) * 100
            : 0;

        return {
            ...canal,
            percentage
        };

    });

}


/* =========================================
   OBTENER ALERTAS DE INVENTARIO
========================================= */

function getInventoryAlerts() {

    return productos
        .filter(producto => producto.stock <= producto.minimo)
        .sort((a, b) => a.stock - b.stock);

}


/* =========================================
   RENDERIZAR TOP 5 PRODUCTOS
========================================= */

function renderTopProducts(products) {

    const maxRevenue = Math.max(
        1,
        ...products.map(producto => producto.revenue)
    );


    return products.map((producto, index) => {

        const percentage = (producto.revenue / maxRevenue) * 100;

        return `

            <div class="report-product-item">

                <div class="report-product-info">

                    <span class="report-product-name">
                        ${escapeHTML(producto.nombre)}
                    </span>

                    <strong>
                        ${formatCurrency(producto.revenue)}
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>


                <span class="report-product-units">
                    ${producto.unitsSold} unidades vendidas
                </span>

            </div>

        `;

    }).join("");

}


/* =========================================
   RENDERIZAR GRÁFICO DE CANALES
========================================= */

function renderChannelChart(channelSales) {

    const maxSales = Math.max(
        1,
        ...channelSales.map(canal => canal.ventas)
    );


    return channelSales.map(canal => {

        const height = (canal.ventas / maxSales) * 100;

        return `

            <div class="report-chart-column">

                <div class="report-chart-value">
                    ${canal.percentage.toFixed(1)}%
                </div>

                <div class="report-chart-bars">

                    <div
                        class="report-chart-bar"
                        style="height: ${height}%"
                    ></div>

                </div>

                <span class="report-chart-label">
                    ${escapeHTML(canal.nombre)}
                </span>

            </div>

        `;

    }).join("");

}


/* =========================================
   RENDERIZAR ALERTAS
========================================= */

function renderAlerts(alerts) {

    if (alerts.length === 0) {

        return `
            <div class="report-no-alerts">
                <span class="badge badge-success">
                    Inventario saludable
                </span>

                <p>No hay productos con stock crítico.</p>
            </div>
        `;

    }


    return alerts.map(producto => {

        const exhausted = producto.stock === 0;

        return `

            <div class="report-alert-item">

                <div class="report-alert-info">

                    <strong>
                        ${escapeHTML(producto.nombre)}
                    </strong>

                    <span>
                        Mínimo requerido: ${producto.minimo} uds
                    </span>

                </div>


                <span class="report-alert-status">
                    ${exhausted
                        ? "Agotado"
                        : `Quedan ${producto.stock} uds`
                    }
                </span>

            </div>

        `;

    }).join("");

}


/* =========================================
   RENDERIZAR REPORTES
========================================= */

export function renderReportes(container) {

    // Obtener información

    const topProducts = calculateProductRevenue();

    const channelSales = calculateChannelSales();

    const alerts = getInventoryAlerts();


    /* =========================================
       CONSTRUIR HTML
    ========================================= */

    container.innerHTML = `

        <div class="reports-layout">

            <!-- TOP 5 PRODUCTOS -->

            <div class="card reports-products">

                <h3 class="card-title">
                    Top 5 Productos por Ingresos
                </h3>

                <div class="report-products-list">

                    ${renderTopProducts(topProducts)}

                </div>

            </div>


            <!-- VENTAS POR CANAL -->

            <div class="card reports-chart">

                <h3 class="card-title">
                    Distribución de Ventas por Canal
                </h3>

                <div class="report-chart-container">

                    ${renderChannelChart(channelSales)}

                </div>


                <div class="report-chart-legend">

                    <span class="report-legend-item">
                        <span class="report-legend-color"></span>
                        Ingresos registrados
                    </span>

                </div>

            </div>


            <!-- ALERTAS DE INVENTARIO -->

            <div class="card reports-alerts">

                <div class="flex-between">

                    <h3 class="card-title">
                        Alertas Críticas: Stock Bajo Requerido
                    </h3>

                    <span class="badge ${
                        alerts.length > 0
                            ? "badge-danger"
                            : "badge-success"
                    }">
                        ${alerts.length} alertas
                    </span>

                </div>


                <div class="report-alerts-list">

                    ${renderAlerts(alerts)}

                </div>

            </div>

        </div>

    `;

}
