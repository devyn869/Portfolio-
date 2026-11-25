function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initMobileNav() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("is-open", !isExpanded);
  });
}

function initContactFormValidation() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const fields = Array.from(form.querySelectorAll("input, textarea, select"));

  function showError(field, message) {
    const errorEl =
      field.parentElement?.querySelector(".error-message") ||
      document.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(field) {
    const errorEl =
      field.parentElement?.querySelector(".error-message") ||
      document.querySelector(`#${field.id}-error`);
    field.removeAttribute("aria-invalid");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute("required") && !value) {
      showError(field, "This field is required.");
      return false;
    }

    if (field.type === "email" && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showError(field, "Please enter a valid email address.");
        return false;
      }
    }

    if (field.minLength > 0 && value && value.length < field.minLength) {
      showError(field, `Please enter at least ${field.minLength} characters.`);
      return false;
    }

    clearError(field);
    return true;
  }

  fields.forEach((field) => {
    ["input", "blur"].forEach((eventName) => {
      field.addEventListener(eventName, () => {
        validateField(field);
      });
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
        <img src="${escapeHTML(data.avatar_url)}" alt="Avatar for ${safeName}" class="github-avatar" width="72" height="72" />
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
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initContactFormValidation();
  initGitHubProfileCard();

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
const removeBtn = document.createElement("button");
removeBtn.type = "button";
removeBtn.textContent = "Remove";
removeBtn.addEventListener("click", () => {
  li.remove();
});

li.appendChild(labelSpan);
li.appendChild(removeBtn);
itemList.appendChild(li);
