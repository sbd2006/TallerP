const API_URL = 'http://localhost:3000/contactos';

// 1. Mostrar Contactos (Leer desde MySQL)
async function mostrarC() {
    try {
        const respuesta = await fetch(API_URL);
        const contactos = await respuesta.json();
        
        let lista = document.getElementById("lista-contactos");
        lista.innerHTML = "";
        
        contactos.forEach(c => {
            // Creamos el HTML para cada contacto
            lista.innerHTML += `
                <div class="contacto-item" style="border-bottom: 1px solid #ccc; padding: 10px 0;">
                    <p><strong>${c.nombre} ${c.apellido}</strong> - Tel: ${c.telefono}</p>
                    <button onclick="eliminarContacto(${c.id})" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Eliminar</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al cargar los contactos:", error);
    }
}

// 2. Crear Contacto (Guardar en MySQL)
async function crearC() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;

    // Validación básica para que no envíe campos vacíos
    if (!nombre || !apellido || !telefono) {
        alert("Por favor llena todos los campos");
        return;
    }

    const nuevoContacto = { nombre, apellido, telefono };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoContacto)
        });

        // Limpiar los campos del formulario
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("telefono").value = "";

        // Recargar la lista para ver el nuevo contacto
        mostrarC(); 
    } catch (error) {
        console.error("Error al guardar el contacto:", error);
    }
}

// 3. Eliminar Contacto (Borrar de MySQL)
async function eliminarContacto(id) {
    if (confirm("¿Estás seguro de eliminar este contacto?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            // Recargar la lista después de eliminar
            mostrarC();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

// Cargar los contactos automáticamente cuando se abre la página
document.addEventListener("DOMContentLoaded", mostrarC);