
/* =========================================
   MÓDULO: VENTAS
========================================= */

import { productos, ventas } from "../data.js";


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
   RENDERIZAR PANTALLA
========================================= */

export function renderVentas(container) {

    // Obtener rango de fechas disponible

    const fechas = ventas.map(venta => venta.fecha).sort();

    const fechaInicial = fechas[0];
    const fechaFinal = fechas[fechas.length - 1];


    // Construir estructura HTML

    container.innerHTML = `

        <!-- FILTRO DE FECHAS -->

        <div class="card sales-date-filter">

            <div class="date-field">
                <label for="date-from">Desde:</label>

                <input
                    type="date"
                    id="date-from"
                    class="input"
                    value="${fechaInicial}"
                >
            </div>

            <div class="date-field">
                <label for="date-to">Hasta:</label>

                <input
                    type="date"
                    id="date-to"
                    class="input"
                    value="${fechaFinal}"
                >
            </div>

            <button class="btn btn-primary" id="btn-consult">
                Consultar
            </button>

        </div>


        <!-- CONTENIDO PRINCIPAL -->

        <div class="sales-layout section-spacing">


            <!-- TABLA DE TRANSACCIONES -->

            <div class="card">

                <div class="flex-between sales-header">

                    <h3 class="card-title">
                        Registro de Transacciones Recientes
                    </h3>

                    <span class="dashboard-caption" id="sales-count">
                        0 registros
                    </span>

                </div>


                <!-- BÚSQUEDA Y CANAL -->

                <div class="sales-filters">

                    <input
                        type="text"
                        id="search-sale"
                        class="input"
                        placeholder="Buscar producto..."
                    >

                    <select id="filter-channel" class="input">

                        <option value="">Todos los canales</option>
                        <option value="Mostrador">Mostrador</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Web">Web</option>

                    </select>

                </div>


                <!-- TABLA -->

                <div class="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody id="sales-table-body"></tbody>

                    </table>

                </div>

                <div id="sales-empty" class="empty-message" hidden>
                    No se encontraron ventas para esta consulta.
                </div>

            </div>


            <!-- PANEL LATERAL -->

            <div class="sales-sidebar">


                <!-- TOTAL DE VENTAS -->

                <div class="sales-total-card">

                    <span class="sales-total-label">
                        Total de Ventas de la Consulta
                    </span>

                    <h2 id="sales-total-value">
                        $0
                    </h2>

                    <span id="sales-total-description">
                        0 transacciones registradas
                    </span>

                </div>


                <!-- VENTAS POR CANAL -->

                <div class="card">

                    <h3 class="card-title">
                        Ventas por Canales
                    </h3>

                    <div id="sales-channels"></div>

                </div>

            </div>

        </div>

    `;


    /* =========================================
       ELEMENTOS DEL DOM
    ========================================= */

    const dateFrom = container.querySelector("#date-from");
    const dateTo = container.querySelector("#date-to");

    const searchInput = container.querySelector("#search-sale");
    const channelFilter = container.querySelector("#filter-channel");

    const consultButton = container.querySelector("#btn-consult");

    const tableBody = container.querySelector("#sales-table-body");
    const salesCount = container.querySelector("#sales-count");

    const emptyMessage = container.querySelector("#sales-empty");

    const totalValue = container.querySelector("#sales-total-value");
    const totalDescription = container.querySelector("#sales-total-description");

    const channelsContainer = container.querySelector("#sales-channels");


    /* =========================================
       ESTADO DE LA CONSULTA
    ========================================= */

    let appliedDateFrom = fechaInicial;
    let appliedDateTo = fechaFinal;


    /* =========================================
       RENDERIZAR RESULTADOS
    ========================================= */

    function renderResults() {

        // Validar rango de fechas

        if (
            !appliedDateFrom ||
            !appliedDateTo ||
            appliedDateFrom > appliedDateTo
        ) {
            tableBody.innerHTML = "";

            salesCount.textContent = "0 registros";

            emptyMessage.hidden = false;

            totalValue.textContent = formatCurrency(0);

            totalDescription.textContent = "Rango de fechas inválido";

            channelsContainer.innerHTML = `
                <p class="dashboard-caption">
                    No hay datos para mostrar.
                </p>
            `;

            return;
        }


        // Aplicar filtros

        const search = searchInput.value.toLowerCase();

        const channel = channelFilter.value;


        const filteredSales = ventas.filter(venta => {

            const producto = productos.find(
                p => p.id === venta.productoId
            );

            const matchesDate =
                venta.fecha >= appliedDateFrom &&
                venta.fecha <= appliedDateTo;

            const matchesProduct = producto.nombre
                .toLowerCase()
                .includes(search);

            const matchesChannel =
                channel === "" || venta.canal === channel;

            return matchesDate && matchesProduct && matchesChannel;

        });


        /* =====================================
           CALCULAR TOTALES
        ===================================== */

        const totalIngresos = filteredSales.reduce(
            (total, venta) =>
                total + venta.cantidad * venta.precioUnitario,
            0
        );

        const totalUnidades = filteredSales.reduce(
            (total, venta) => total + venta.cantidad,
            0
        );

        const totalTransacciones = filteredSales.length;


        /* =====================================
           ACTUALIZAR TARJETA AZUL
        ===================================== */

        totalValue.textContent = formatCurrency(totalIngresos);

        totalDescription.textContent =
            `${totalTransacciones} transacciones · ${totalUnidades} unidades`;


        /* =====================================
           ACTUALIZAR CONTADOR
        ===================================== */

        salesCount.textContent =
            `${totalTransacciones} registros`;


        /* =====================================
           ACTUALIZAR TABLA
        ===================================== */

        tableBody.innerHTML = filteredSales.map(venta => {

            const producto = productos.find(
                p => p.id === venta.productoId
            );

            const total = venta.cantidad * venta.precioUnitario;

            return `

                <tr>

                    <td>${producto.nombre}</td>

                    <td>${producto.categoria}</td>

                    <td>${venta.cantidad}</td>

                    <td>${formatCurrency(venta.precioUnitario)}</td>

                    <td class="td_blue">
                        <strong>${formatCurrency(total)}</strong>
                    </td>

                </tr>

            `;

        }).join("");


        emptyMessage.hidden = totalTransacciones !== 0;


        /* =====================================
           CALCULAR VENTAS POR CANAL
        ===================================== */

        const ventasPorCanal = filteredSales.reduce(
            (resultado, venta) => {

                resultado[venta.canal] =
                    (resultado[venta.canal] || 0) +
                    venta.cantidad * venta.precioUnitario;

                return resultado;

            },
            {}
        );


        /* =====================================
           RENDERIZAR CANALES
        ===================================== */

        const canales = Object.entries(ventasPorCanal);

        channelsContainer.innerHTML = canales.length
            ? canales.map(([nombre, valor]) => {

                const porcentaje = totalIngresos > 0
                    ? (valor / totalIngresos) * 100
                    : 0;

                return `

                    <div class="channel-item">

                        <div class="flex-between">

                            <span>${nombre}</span>

                            <strong>${formatCurrency(valor)}</strong>

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

            }).join("")
            : `
                <p class="dashboard-caption">
                    No hay ventas por canal.
                </p>
            `;

    }


    /* =========================================
       EVENTOS
    ========================================= */

    // Consultar rango de fechas

    consultButton.addEventListener("click", () => {

        appliedDateFrom = dateFrom.value;
        appliedDateTo = dateTo.value;

        renderResults();

    });


    // Búsqueda por producto

    searchInput.addEventListener("input", renderResults);


    // Filtro por canal

    channelFilter.addEventListener("change", renderResults);


    // Primera consulta

    renderResults();

}
