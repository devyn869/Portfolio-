document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initContactFormValidation();
  initGitHubProfileCard();
});

/**
 * 1. DOM Interaction: Mobile Hamburger Navigation Toggle
 */
function initMobileNav() {
  const menuButton = document.querySelector(".menu-toggle, [data-menu-toggle], button[aria-expanded]");
  const navMenu = document.querySelector(".nav-links, .nav-menu, nav ul");

  if (!menuButton || !navMenu) return;

  // Ensure initial ARIA state is set
  if (!menuButton.hasAttribute("aria-expanded")) {
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;

    menuButton.setAttribute("aria-expanded", String(nextState));
    navMenu.classList.toggle("is-open", nextState);
    menuButton.classList.toggle("is-active", nextState);
  });
}

/**
 * 2. Form Validation: Accessible Contact Form Validation
 */
function initContactFormValidation() {
  const form = document.querySelector("#contact-form, form");
  if (!form) return;

  // Disable native browser popups so custom accessible DOM errors take over
  form.setAttribute("novalidate", "");

  const fields = Array.from(form.querySelectorAll("input[required], textarea[required], select[required]"));

  function getErrorElement(field) {
    let errorEl = document.querySelector(`#${field.id}-error`);
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.id = `${field.id || field.name}-error`;
      errorEl.className = "error-message";
      errorEl.setAttribute("role", "alert");
      errorEl.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", errorEl);
    }
    return errorEl;
  }

  function setFieldError(field, message) {
    const errorEl = getErrorElement(field);
    field.setAttribute("aria-invalid", "true");
    field.classList.add("input-error");
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    const errorEl = getErrorElement(field);
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("input-error");
    errorEl.textContent = "";
  }

 function validateField(field) {
  const value = field.value.trim();

  if (field.type === "checkbox" || field.type === "radio") {
    const group = form.querySelectorAll(`[name="${field.name}"]`);
    const isChecked = Array.from(group).some((input) => input.checked);
    if (!isChecked) {
      setFieldError(field, "Please select an option.");
      return false;
    }
    clearFieldError(field);
    return true;
  }

  const label = field.id ? form.querySelector(`label[for="${field.id}"]`) : null;
  const fieldName = label ? label.textContent.replace("*", "").trim() : "This field";

  if (!value) {
    setFieldError(field, `${fieldName} is required.`);
    return false;
  }

  if (field.type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(value)) {
      setFieldError(field, "Please enter a valid email address.");
      return false;
    }
  }

  if (field.type === "tel") {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setFieldError(field, "Please enter a valid phone number.");
      return false;
    }
  }

  clearFieldError(field);
  return true;
}

    if (!value) {
      const label = form.querySelector(`label[for="${field.id}"]`);
      const fieldName = label ? label.textContent.replace("*", "").trim() : "This field";
      setFieldError(field, `${fieldName} is required.`);
      return false;
    }

    if (field.type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setFieldError(field, "Please enter a valid email address.");
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }

  // Clear or update errors as the user types or changes fields
  fields.forEach((field) => {
    const eventName = field.type === "checkbox" || field.type === "radio" || field.tagName === "SELECT"
      ? "change"
      : "input";

    field.addEventListener(eventName, () => {
      validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    let firstInvalidField = null;
    let isFormValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!isFormValid) {
      event.preventDefault();
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
    }
  });
}

/**
 * 3. API Fetch (Bonus): GitHub Profile Card with Error Handling
 */
async function initGitHubProfileCard() {
  const container = document.querySelector("#github-profile-card");
  if (!container) return;

  const username = container.dataset.username || "devyn869";
  container.setAttribute("aria-live", "polite");
  container.innerHTML = `<p class="status-message">Loading GitHub profile for @${username}...</p>`;

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    const safeName = escapeHTML(data.name || data.login);
    const safeBio = escapeHTML(data.bio || "Front-end developer building accessible web experiences.");
    const safeLocation = data.location ? `<p class="github-location">${escapeHTML(data.location)}</p>` : "";

    container.innerHTML = `
      <article class="github-card">
        <img
          src="${escapeHTML(data.avatar_url)}"
          alt="Avatar for ${safeName}"
          class="github-avatar"
          width="72"
          height="72"
        />
        <div class="github-details">
          <h3><a href="${escapeHTML(data.html_url)}" target="_blank" rel="noopener noreferrer">${safeName}</a></h3>
          <p class="github-handle">@${escapeHTML(data.login)}</p>
          <p class="github-bio">${safeBio}</p>
          ${safeLocation}
          <p class="github-stats">
            <strong>${data.public_repos}</strong> Public Repos &middot;
            <strong>${data.followers}</strong> Followers
          </p>
        </div>
      </article>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="github-error" role="alert">
        <p>Unable to load GitHub profile right now.</p>
        <p class="error-detail">${escapeHTML(error.message)}</p>
      </div>
    `;
  }
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
