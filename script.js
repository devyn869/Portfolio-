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

  form.setAttribute("novalidate", "");

  const fields = Array.from(
    form.querySelectorAll("input[required], textarea[required], select[required]")
  );

  function getErrorElement(field) {
    const errorId = `${field.id || field.name}-error`;
    let errorEl = document.querySelector(`#${errorId}`);

    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.id = errorId;
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

  fields.forEach((field) => {
    const eventName =
      field.type === "checkbox" || field.type === "radio" || field.tagName === "SELECT"
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
  container.innerHTML = `<p class="status-message">Loading GitHub profile for @${escapeHTML(username)}...</p>`;

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    const safeName = escapeHTML(data.name || data.login);
    const safeBio = escapeHTML(data.bio || "Front-end developer building accessible web experiences.");
    const safeLocation = data.location
      ? `<p class="github-location">${escapeHTML(data.location)}</p>`
      : "";

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
            <strong>${escapeHTML(data.public_repos)}</strong> Public Repos &middot;
            <strong>${escapeHTML(data.followers)}</strong> Followers
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
document.addEventListener("DOMContentLoaded", () => {
  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  const highlightBtn = document.querySelector("#highlight-status-btn");
  const statusText = document.querySelector("#highlight-status-text");

  if (highlightBtn && statusText) {
    highlightBtn.addEventListener("click", () => {
      const isFeatured = statusText.dataset.featured === "true";
      statusText.dataset.featured = String(!isFeatured);
      statusText.textContent = !isFeatured
        ? "Currently highlighting: Interactive DOM & Accessibility projects"
        : "Showing all portfolio highlights";
    });
  }

  const liveStyleInput = document.querySelector("#live-preview-input");
  const liveStylePreview = document.querySelector("#live-preview-badge");

  if (liveStyleInput && liveStylePreview) {
    liveStyleInput.addEventListener("input", () => {
      const length = liveStyleInput.value.trim().length;
      liveStylePreview.classList.toggle("is-active-typing", length > 0);
      liveStylePreview.classList.toggle("is-ready", length >= 5);
      liveStylePreview.textContent =
        length === 0
          ? "Waiting for input..."
          : `${length} character${length === 1 ? "" : "s"} typed`;
    });
  }

  const highlightButton = document.querySelector("#highlight-btn");
  const highlightOutput = document.querySelector("#highlight-output");

  if (highlightButton && highlightOutput) {
    highlightButton.addEventListener("click", () => {
      const isExpanded = highlightButton.getAttribute("aria-expanded") === "true";
      highlightButton.setAttribute("aria-expanded", String(!isExpanded));
      highlightOutput.textContent = isExpanded
        ? "Click the button to highlight featured work."
        : "Featured: Accessible design, responsive layouts, and interactive JS.";
    });
  }

  const styleInput = document.querySelector("#style-input");
  const styleTarget = document.querySelector("#style-target");

  if (styleInput && styleTarget) {
    styleInput.addEventListener("input", () => {
      const typedLength = styleInput.value.trim().length;
      styleTarget.classList.toggle("is-typing", typedLength > 0);
      styleTarget.classList.toggle("is-complete", typedLength >= 8);
    });
  }

  const listForm = document.querySelector("#dynamic-list-form");
  const listInput = document.querySelector("#dynamic-list-input");
  const itemList = document.querySelector("#dynamic-item-list");

  if (listForm && listInput && itemList) {
    listForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = listInput.value.trim();
      if (!value) return;

      const li = document.createElement("li");
      const labelSpan = document.createElement("span");
      labelSpan.textContent = value;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        li.remove();
      });

      li.appendChild(labelSpan);
      li.appendChild(removeBtn);
      itemList.appendChild(li);

      listInput.value = "";
      listInput.focus();
    });
  }
});
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", () => {
      li.remove();
    });

    li.appendChild(labelSpan);
    li.appendChild(deleteButton);
    itemList.appendChild(li);

    listInput.value = "";
    listInput.focus();
  });
}
