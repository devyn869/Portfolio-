# Portfolio Project - Milestone 3: Accessible & Designed

* Fixed missing alt text on the profile image by adding a descriptive alt attribute.
* Resolved a low contrast error on the main navigation links by darkening the text color to pass WebAIM AA standards.
* Added a missing `aria-label` to the mobile menu hamburger button for screen reader support.
* Verified all text and background color combinations across index, portfolio, and contact pages meet WCAG AA contrast requirements using the WebAIM Contrast Checker.

2. Visual Design (Gestalt Principles & Palette)
* **Proximity:** I used proximity to group related portfolio project cards together, placing description text and links closely associated with their respective preview images.
* **Similarity:** I applied similarity by giving all primary call-to-action buttons identical styling (background color, padding, and border radius) to create a cohesive user experience.
* **Color Palette:** Maintained a consistent color palette across all three pages consisting of a deep navy primary (`#1A2530`), a dark pink, and an off-white background (`#F9F9F9`).

3. Accessible Form
* Built a semantic contact form using proper `<label>` elements explicitly tied to their inputs via `for` and `id` attributes.
* Grouped related radio/checkbox inputs using `<fieldset>` and `<legend>` elements for screen reader clarity.
Implemented accessible error states using aria attributes and clear visual error messages when required fields are left blank.
