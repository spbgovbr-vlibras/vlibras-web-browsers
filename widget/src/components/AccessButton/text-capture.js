const { $, addClass, removeClass, canTranslate } = require('~utils');

function loadTextCaptureScript() {
  const $root = Array.from([document.body, ...document.body.children]);
  const vw = $('[vw]');
  const guide = $('.vp-guide-container');

  const hasTag = (el, tags) => tags.includes(el.tagName);
  const hasTooltip = () => $('.vw-links') ? true : false;
  const isLinkOrButton = el => hasTag(el, ["A", "BUTTON"]);
  const isSubmitInput = el => hasTag(el, "INPUT") && el.type === 'submit';
  const isValidImage = el => hasTag(el, "IMG") && el.alt && el.alt.trim();
  const isSelect = el => hasTag(el, "SELECT");
  const isSVG = el => hasTag(el, ['SVG', 'PATH']);

  createTooltip();

  function hasLinkAncestor(el) {
    while (el) {
      if ($root.includes(el)) break;
      if (isLinkOrButton(el) || (el.onclick && !isSVG(el))) return el;
      el = el.parentNode;
    } return null;
  }

  function isValidElement(element) {

    if (vw.contains(element) || guide.contains(element)) return false;

    return element.matches('.vw-links') ? false
      : hasTextContent(element)
      || hasLinkAncestor(element)
      || isSubmitInput(element)
      || isValidImage(element)
      || isSelect(element)
  }

  function hasTextContent(el) {
    const check = (item) => item.nodeType === Node.TEXT_NODE && item.textContent.trim();
    return Array.from(el.childNodes).some(e => check(e));
  }

  function highlightElement({ target: element }) {
    if (isValidElement(element)) addClass(element, 'vw-text--hover');
  }

  function toggleChecked(element) {
    const input = $('input', element.parentElement);
    if (input && (['radio', 'checkbox'].includes(input.type))) input.checked = !input.checked;
  }

  function translateContent(event) {
    removeTooltips();
    const element = event.target;
    const isSubmit = isSubmitInput(element);

    if (!isValidElement(element)) return;

    event.preventDefault();
    event.stopPropagation();

    const textContent = (hasTag(element, 'IMG') ? element.alt
      : isSubmit ? element.value
        : hasTag(element, 'SELECT') ? element.value ? element.value
          : element.children[0].innerText
          : element.innerText && element.innerText.replace(/\s+/g, ' ')
          || element.textContent);

    // Call VLibras Widget
    if (textContent.trim()) window.plugin.translate(textContent);

    const linkElement = element.tagName === "A" ? element : hasLinkAncestor(element);

    if (linkElement) showTooltip(linkElement, event);
    if (hasTag(element, 'LABEL')) toggleChecked(element);
    else if (hasTag(element, 'BUTTON') || isSubmit) showTooltip(element, event);
  }

  function clickHandler(element, event = null) {
    if (event) event.stopPropagation();
    document.removeEventListener("click", translateContent, true);
    element.click();
    document.addEventListener("click", translateContent, true);
  }

  function removeHighlight(event) {
    removeClass(event.target, 'vw-text--hover');
  }

  function showTooltip(linkElement, event) {
    if (!linkElement) return;
    removeTooltips();
    const tooltip = $('.vw-links');
    tooltip.style.display = 'block';
    tooltip.innerText = linkElement.tagName === 'A' ? "Acessar link" : 'Interagir';

    const yView = event.clientY > window.innerHeight - 100;
    const xView = event.clientX > window.innerWidth - 120;

    if (yView) tooltip.style.bottom = '20px';
    else tooltip.style.top = yView + event.clientY + 48 + 'px';

    if (xView) tooltip.style.right = '20px';
    else tooltip.style.left = (event.clientX - 20 < 20 ? 20 : event.clientX - 20) + 'px';

    tooltip.onclick = (e) => clickHandler(linkElement, e);

    document.addEventListener("click", removeTooltips);
  }

  function removeTooltips() {
    const tooltip = $('.vw-links')
    if (tooltip) tooltip.style.display = 'none';
    document.removeEventListener("click", removeTooltips);
  }

  function createTooltip() {
    if (hasTooltip()) return;
    const tooltip = document.createElement('div');
    addClass(tooltip, 'vw-links');
    document.body.appendChild(tooltip);
  }

  function activate() {
    if (!canTranslate()) return;
    document.addEventListener("mouseover", highlightElement);
    document.addEventListener("mouseout", removeHighlight);
    document.addEventListener("scroll", removeTooltips);
    document.addEventListener("click", translateContent, true);

    window.addEventListener('vp-widget-close', deactivate);
    window.addEventListener('vp-disable-text-capture', deactivate);
    window.addEventListener('vp-enable-text-capture', activate);
  }

  function deactivate() {
    removeTooltips();
    document.removeEventListener("mouseover", highlightElement);
    document.removeEventListener("mouseout", removeHighlight);
    document.removeEventListener("scroll", removeTooltips);
    document.removeEventListener("click", translateContent, true);

    window.removeEventListener('vp-widget-close', deactivate);
    window.removeEventListener('vp-disable-text-capture', deactivate);
  }

  activate();

}

export { loadTextCaptureScript }
