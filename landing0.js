// LANDING 0€ — contador de plazas + envío del formulario.

// Actualiza este número cada vez que un negocio da su tarjeta en Stripe.
const PLAZAS_LIBRES = 5;

// Pega aquí la URL /exec de la aplicación web de Google Apps Script (ver GOOGLE-SHEETS.md).
// Si está vacía, el formulario solo muestra el mensaje de confirmación y registra los datos en la consola.
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbxtxfQmkszOVfZ8bN22i3CisYsdQZBjsY6lo3YMhWa8foCaUeKjGDEOxN64nsCoGd1k/exec";

document.querySelectorAll("[data-seats-left]").forEach((el) => (el.textContent = PLAZAS_LIBRES));

const form = document.getElementById("form");
const error = document.querySelector("[data-error]");
const done = document.querySelector("[data-done]");
const noteNo = document.querySelector("[data-note-no]");

const FIELD = ".field.two > div, .field, .consent";

form.addEventListener("input", (e) => {
  if (e.target.name === "encaje_precio") noteNo.hidden = e.target.value !== "no";
  const field = e.target.closest(FIELD);
  if (field) field.classList.remove("invalid");
});

function validate() {
  let ok = true;
  const groups = new Set();
  form.querySelectorAll("[required]").forEach((input) => {
    const field = input.closest(FIELD);
    if (input.type === "radio") {
      if (groups.has(input.name)) return;
      groups.add(input.name);
      const checked = form.querySelector(`input[name="${input.name}"]:checked`);
      field.classList.toggle("invalid", !checked);
      if (!checked) ok = false;
      return;
    }
    const empty = input.type === "checkbox" ? !input.checked : !input.value.trim();
    field.classList.toggle("invalid", empty);
    if (empty) ok = false;
  });
  return ok;
}

// Puntuación interna de encaje (sobre 10), la misma que se usa para seleccionar.
function score(data) {
  let s = 0;
  if (data.web_actual === "no" || data.web_actual === "linktree") s += 3;
  if (data.encaje_precio === "si") s += 3;
  else if (data.encaje_precio === "dudas") s += 1;
  return s; // +2 Instagram activo y +2 sector nuevo se valoran a mano
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) {
    error.hidden = false;
    form.querySelector(".invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  error.hidden = true;

  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  data.objetivo = fd.getAll("objetivo").join(", ");
  data.instagram = data.instagram.replace(/^@/, "");
  data.puntuacion_auto = score(data);
  data.enviado = new Date().toISOString();

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Enviando…";

  try {
    if (FORM_ENDPOINT) {
      // Apps Script no admite CORS: se envía como texto plano y sin leer la respuesta.
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
    } else {
      console.info("Solicitud LANDING 0€ (sin FORM_ENDPOINT configurado):", data);
    }
    form.hidden = true;
    done.hidden = false;
    done.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    button.disabled = false;
    button.textContent = "Enviar solicitud";
    error.textContent = "No se ha podido enviar. Prueba otra vez o escríbenos WEB por DM.";
    error.hidden = false;
  }
});
