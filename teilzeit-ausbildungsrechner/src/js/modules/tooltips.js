export function initializeTooltips() {
  const wrappers = document.querySelectorAll('#calculator-section .info-icon-wrapper');
  if (!wrappers.length) return;

  let openWrapper = null;

  const closeOpen = () => {
    if (!openWrapper) return;
    const icon = openWrapper.querySelector('.fa-info-circle');
    openWrapper.classList.remove('open');
    if (icon) icon.setAttribute('aria-expanded', 'false');
    openWrapper = null;
  };

  // Global listeners to close on outside click / Escape
  document.addEventListener('click', (e) => {
    if (!openWrapper) return;
    if (!openWrapper.contains(e.target)) closeOpen();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOpen();
  });

  wrappers.forEach((wrapper) => {
    const icon = wrapper.querySelector('.fa-info-circle');
    const box = wrapper.querySelector('.info-box');
    if (!icon || !box) return;

    // Accessibility attributes
    if (!box.id) box.id = `tooltip-${Math.random().toString(36).slice(2, 9)}`;
    box.setAttribute('role', 'tooltip');
    icon.setAttribute('aria-haspopup', 'true');
    icon.setAttribute('aria-expanded', 'false');
    icon.setAttribute('aria-controls', box.id);
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('role', 'button');

    const toggle = () => {
      const isOpen = wrapper.classList.toggle('open');
      icon.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        if (openWrapper && openWrapper !== wrapper) {
          const prevIcon = openWrapper.querySelector('.fa-info-circle');
          openWrapper.classList.remove('open');
          if (prevIcon) prevIcon.setAttribute('aria-expanded', 'false');
        }
        openWrapper = wrapper;
      } else if (openWrapper === wrapper) {
        openWrapper = null;
      }
    };

    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

