
/* =========================================
   COMPONENTE: SIDEBAR
========================================= */

export function renderSidebar(container, activePage, onNavigate) {

    const menuItems = [
        {
            id: "dashboard",
            name: "Inicio",
            icon: "⌂"
        },
        {
            id: "ventas",
            name: "Ventas",
            icon: "$"
        },
        {
            id: "inventario",
            name: "Inventario",
            icon: "▤"
        },
        {
            id: "reportes",
            name: "Reportes",
            icon: "▥"
        }
    ];

    // Construir estructura del sidebar
    container.innerHTML = `
        <div class="sidebar">

            <div class="sidebar-logo">
                <span class="logo-icon">GP</span>
                GestiónPro
            </div>

            <nav class="sidebar-menu">

                ${menuItems.map(item => `
                    <a
                        href="#"
                        class="sidebar-link ${activePage === item.id ? "active" : ""}"
                        data-page="${item.id}"
                    >
                        <span class="sidebar-icon">${item.icon}</span>
                        <span>${item.name}</span>
                    </a>
                `).join("")}

            </nav>

        </div>
    `;

    // Registrar eventos de navegación
    const links = container.querySelectorAll(".sidebar-link");

    links.forEach(link => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            const page = link.dataset.page;

            onNavigate(page);

        });

    });

}
