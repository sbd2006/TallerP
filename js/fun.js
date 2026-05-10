// URL oficial según la guía de tu profesor
const API_URL = 'http://localhost:3000/api/contacts';

async function mostrarContatos() {
    try {
        const respuesta = await fetch(API_URL);
        const contatos = await respuesta.json();
        
        const lista = document.getElementById("contactList");
        lista.innerHTML = "";
        
        contatos.forEach(c => {
            lista.innerHTML += `
                <li class="contacto-item" style="border-bottom: 1px solid #ccc; padding: 15px 0; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0;">${c.name} ${c.lastname} <span style="font-size: 12px; font-weight: normal;">(${c.sex})</span></h3>
                        <p style="margin: 5px 0 0 0; color: #555;">
                            📞 ${c.phone} | 🏙️ ${c.city} | 📍 ${c.address}
                        </p>
                    </div>
                    <button onclick="deletarContato(${c.id})" class="btn" style="background-color: #dc3545; padding: 8px 15px; width: auto; height: auto;">Eliminar</button>
                </li>
            `;
        });
    } catch (error) {
        console.error("Error al cargar la lista de contactos:", error);
    }
}

// Capturar el envío del formulario
document.getElementById("contactForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Recolectar todos los datos del formulario
    const name = document.getElementById("name").value;
    const lastname = document.getElementById("lastname").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value;
    
    // Capturar el valor del radio button de género
    const sexInput = document.querySelector('input[name="gender"]:checked');
    const sex = sexInput ? sexInput.value : '';

    if (!name || !lastname || !phone) {
        alert("¡Los campos de nombre, apellido y teléfono son obligatorios!");
        return;
    }

    const nuevoContacto = { name, lastname, sex, phone, city, address };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoContacto)
        });

        this.reset(); // Limpia el formulario después de enviar
        mostrarContatos(); // Actualiza la vista en la pantalla
    } catch (error) {
        console.error("Error al crear el contacto:", error);
    }
});

async function deletarContato(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            mostrarContatos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

// Iniciar la carga de contactos apenas se abre la página
document.addEventListener("DOMContentLoaded", mostrarContatos);