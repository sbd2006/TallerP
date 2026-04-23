const STORAGE_KEY = "contact-list-v1";

const form = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const loadingOverlay = document.getElementById("loadingOverlay");
const message = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const inputs = {
  name: document.getElementById("name"),
  lastname: document.getElementById("lastname"),
  phone: document.getElementById("phone"),
  city: document.getElementById("city"),
  address: document.getElementById("address"),
};

let contacts = [];
let editingId = null;


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showLoading(text = "Cargando...") {
  loadingOverlay.querySelector("p").textContent = text;
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function clearMessage() {
  message.textContent = "";
  message.className = "message";
}

function getGender() {
  return document.querySelector('input[name="gender"]:checked')?.value || "male";
}

function getFormData() {
  return {
    name: inputs.name.value.trim(),
    lastname: inputs.lastname.value.trim(),
    phone: inputs.phone.value.trim(),
    city: inputs.city.value.trim(),
    address: inputs.address.value.trim(),
    gender: getGender(),
  };
}

function isValidContact(contact) {
  return Object.values(contact).every((value) => String(value).trim() !== "");
}

function saveContacts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function loadContacts() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    contacts = seedContacts;
    saveContacts();
    return;
  }

  try {
    contacts = JSON.parse(stored) || [];
  } catch (error) {
    contacts = seedContacts;
    saveContacts();
  }
}

function renderContacts() {
  contactList.innerHTML = "";

  if (contacts.length === 0) {
    contactList.innerHTML = `
      <li class="contact-item">
        <div class="contact-item__left">
          <div class="contact-item__text">
            <p class="contact-item__name">No Saved Contacts</p>
            <p class="contact-item__city">Add a contact</p>
          </div>
        </div>
      </li>
    `;
    return;
  }

  contacts.forEach((contact) => {
    const item = document.createElement("li");
    item.className = "contact-item";

    const avatarIcon = contact.gender === "female" ? "👩" : "👨";
    const fullName = `${contact.name} ${contact.lastname}`;

    item.innerHTML = `
      <div class="contact-item__left">
        <div class="avatar ${contact.gender === "female" ? "avatar--female" : "avatar--male"}" aria-hidden="true">
          ${avatarIcon}
        </div>

        <div class="contact-item__text">
          <p class="contact-item__name">${fullName} – ${contact.city}</p>
          <p class="contact-item__city">${contact.phone} • ${contact.address}</p>
        </div>
      </div>

      <div class="contact-item__actions">
        <button class="icon-btn icon-btn--edit" data-action="edit" data-id="${contact.id}" aria-label="Editar contacto">
          ✏
        </button>
        <button class="icon-btn icon-btn--delete" data-action="delete" data-id="${contact.id}" aria-label="Eliminar contacto">
          🗑
        </button>
      </div>
    `;

    contactList.appendChild(item);
  });
}

function resetForm() {
  form.reset();
  document.querySelector('input[name="gender"][value="female"]').checked = true;
  editingId = null;
  saveBtn.textContent = "ADD";
  cancelBtn.hidden = true;
  clearMessage();
}

function fillForm(contact) {
  inputs.name.value = contact.name;
  inputs.lastname.value = contact.lastname;
  inputs.phone.value = contact.phone;
  inputs.city.value = contact.city;
  inputs.address.value = contact.address;
  document.querySelector(`input[name="gender"][value="${contact.gender}"]`).checked = true;

  editingId = contact.id;
  saveBtn.textContent = "UPDATE";
  cancelBtn.hidden = false;
  showMessage("Editing contact...", "success");
}

function handleDelete(id) {
  contacts = contacts.filter((contact) => contact.id !== id);
  saveContacts();
  renderContacts();
  showMessage("Contact deleted successfully.", "success");
}

async function init() {
  showLoading("Loading contacts...");
  await sleep(600);
  loadContacts();
  renderContacts();
  hideLoading();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const contact = getFormData();

  if (!isValidContact(contact)) {
    showMessage("Please fill in all fields before saving.", "error");
    return;
  }

  showLoading(editingId ? "Updating contact..." : "Saving contact...");
  await sleep(700);

  if (editingId) {
    contacts = contacts.map((item) =>
      item.id === editingId ? { ...item, ...contact } : item
    );
    showMessage("Contact updated successfully.", "success");
  } else {
    contacts.unshift({
      id: crypto.randomUUID(),
      ...contact,
    });
    showMessage("Contact added successfully.", "success");
  }

  saveContacts();
  renderContacts();
  resetForm();
  hideLoading();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  showMessage("Edition cancelled.", "success");
});

contactList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const contact = contacts.find((item) => item.id === id);
  if (!contact) return;

  if (action === "edit") {
    fillForm(contact);
  }

  if (action === "delete") {
    const confirmDelete = confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;

    showLoading("Deleting contact...");
    await sleep(500);
    handleDelete(id);
    hideLoading();
  }
});

init();