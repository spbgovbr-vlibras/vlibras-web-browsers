const $ = (path, element = null) => {
  return element ? element.querySelector(path) : $(path, document);
};

const addClass = (element, clss) => {
  element.classList.add(clss);
};

const removeClass = (element, clss) => {
  element.classList.remove(clss);
};

const toggleClass = (element, clss, bool = undefined) => {
  element.classList.toggle(clss, bool);
};

const HIGHLIGHT_CLASS = "vlibras-text-capture-target";
const HIGHLIGHT_STYLE_KEY = "vlibrasTextCaptureTextDecoration";
const HIGHLIGHT_OFFSET_KEY = "vlibrasTextCaptureTextUnderlineOffset";
const HIGHLIGHT_THICKNESS_KEY = "vlibrasTextCaptureTextDecorationThickness";
const HIGHLIGHT_CURSOR_KEY = "vlibrasTextCaptureCursor";
const SYNTHETIC_CLICK_FLAG = "__vlibrasSyntheticClick";

function loadTextCaptureScript() {
  if (!document.body) return;

  const $root = Array.from([document.body, ...document.body.children]);
  const isElement = (el) => el instanceof HTMLElement;

  const hasTag = (el, tags) =>
    Array.isArray(tags) ? tags.includes(el.tagName) : el.tagName === tags;
  const hasTooltip = () => ($(".vw-links") ? true : false);
  const isLinkOrButton = (el) => hasTag(el, ["A", "BUTTON"]);
  const isSubmitInput = (el) => hasTag(el, "INPUT") && el.type === "submit";
  const isValidImage = (el) => hasTag(el, "IMG") && el.alt && el.alt.trim();
  const isSelect = (el) => hasTag(el, "SELECT");
  const isSVG = (el) => hasTag(el, ["SVG", "PATH"]);
  const isButton = (el) => hasTag(el, "BUTTON") || el.role === "button";

  createTooltip();
  let isActive = false;

  function findInteractiveElement(el) {
    while (el) {
      if ($root.includes(el)) break;
      if (isLinkOrButton(el) || (el.onclick && !isSVG(el))) return el;
      el = el.parentNode;
    }
    return null;
  }

  function isValidElement(element) {
    if (!isElement(element)) return false;

    return element.matches(".vw-links")
      ? false
      : hasTextContent(element) ||
          findInteractiveElement(element) ||
          isSubmitInput(element) ||
          isValidImage(element) ||
          isSelect(element);
  }

  function hasTextContent(el) {
    const check = (item) =>
      item.nodeType === Node.TEXT_NODE && item.textContent.trim();
    return Array.from(el.childNodes).some((e) => check(e));
  }

  function highlightElement({ target: element }) {
    if (!isValidElement(element)) return;

    addClass(element, HIGHLIGHT_CLASS);

    if (!(HIGHLIGHT_STYLE_KEY in element.dataset))
      element.dataset[HIGHLIGHT_STYLE_KEY] = element.style.textDecoration || "";
    if (!(HIGHLIGHT_OFFSET_KEY in element.dataset))
      element.dataset[HIGHLIGHT_OFFSET_KEY] =
        element.style.textUnderlineOffset || "";
    if (!(HIGHLIGHT_THICKNESS_KEY in element.dataset))
      element.dataset[HIGHLIGHT_THICKNESS_KEY] =
        element.style.textDecorationThickness || "";
    if (!(HIGHLIGHT_CURSOR_KEY in element.dataset))
      element.dataset[HIGHLIGHT_CURSOR_KEY] = element.style.cursor || "";

    element.style.textDecoration = "underline";
    element.style.textUnderlineOffset = "0.15em";
    element.style.textDecorationThickness = "2px";
    element.style.cursor =
      "url(data:image/png;base64,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), pointer";
  }

  function toggleChecked(element) {
    const input = $("input", element.parentElement);
    if (input && ["radio", "checkbox"].includes(input.type))
      input.checked = !input.checked;
  }

  function translateContent(event) {
    if (event[SYNTHETIC_CLICK_FLAG]) return;

    removeTooltips();
    const element = event.target;
    if (!isElement(element)) return;

    const isSubmit = isSubmitInput(element);

    if (!isValidElement(element)) return;

    event.preventDefault();
    event.stopPropagation();

    const getTextContent = () => {
      try {
        if (element.dataset.vlibrasGloss) return element.dataset.vlibrasGloss;
        if (hasTag(element, "IMG")) return element.alt;
        if (isSubmit) return element.value;
        if (hasTag(element, "SELECT"))
          return element.selectedOptions?.[0]?.innerText || "";
        if (element.innerText) return element.innerText.replace(/\s+/g, " ");
        return element.textContent;
      } catch {}
    };

    const textContent = getTextContent();

    if (textContent && textContent.trim()) {
      try {
        chrome.runtime.sendMessage({ selectedText: textContent });
      } catch {}
    }

    const isLinkElement = element.tagName === "A" && !!element.href;
    const interactiveElement = isLinkElement
      ? element
      : findInteractiveElement(element);

    if (interactiveElement) showTooltip(interactiveElement, event);
    if (hasTag(element, "LABEL")) toggleChecked(element);
    else if (isButton(element) || isSubmit) showTooltip(element, event);
  }

  function clickHandler(element, event = null) {
    if (event) event.stopPropagation();
    const syntheticClick = new MouseEvent("click", { bubbles: true, cancelable: true });
    Object.defineProperty(syntheticClick, SYNTHETIC_CLICK_FLAG, { value: true });
    element.dispatchEvent(syntheticClick);
  }

  function removeHighlight(event) {
    const element = event.target;
    if (!isElement(element)) return;
    if (!element.classList.contains(HIGHLIGHT_CLASS)) return;

    removeClass(element, HIGHLIGHT_CLASS);
    element.style.textDecoration = element.dataset[HIGHLIGHT_STYLE_KEY] || "";
    element.style.textUnderlineOffset =
      element.dataset[HIGHLIGHT_OFFSET_KEY] || "";
    element.style.textDecorationThickness =
      element.dataset[HIGHLIGHT_THICKNESS_KEY] || "";
    element.style.cursor = element.dataset[HIGHLIGHT_CURSOR_KEY] || "";
    delete element.dataset[HIGHLIGHT_STYLE_KEY];
    delete element.dataset[HIGHLIGHT_OFFSET_KEY];
    delete element.dataset[HIGHLIGHT_THICKNESS_KEY];
    delete element.dataset[HIGHLIGHT_CURSOR_KEY];
  }

  function showTooltip(linkElement, event) {
    if (!linkElement) return;
    removeTooltips();
    const tooltip = $(".vw-links");
    const isLink = linkElement.tagName === "A" && !!linkElement.href;

    tooltip.innerText = isLink ? "Acessar link" : "Interagir";

    const { clientX, clientY } = event;
    const yView = clientY > innerHeight - 100;
    const xView = clientX > innerWidth - 120;
    const iWidth = innerWidth - clientX - 20;

    toggleClass(tooltip, "vw-yView", yView);
    toggleClass(tooltip, "vw-xView", xView);

    tooltip.style.top = clientY + (yView ? -68 : 48) + "px";
    tooltip.style.right = xView
      ? (iWidth < 20 ? 20 : iWidth - 20) + "px"
      : "auto";
    tooltip.style.left = !xView
      ? (clientX < 20 ? 20 : clientX - 20) + "px"
      : "auto";
    tooltip.style.display = "block";

    tooltip.onclick = (e) => clickHandler(linkElement, e);
    document.addEventListener("click", removeTooltips);
  }

  function removeTooltips() {
    const tooltip = $(".vw-links");
    if (tooltip) tooltip.style.display = "none";
    document.removeEventListener("click", removeTooltips);
  }

  function createTooltip() {
    if (hasTooltip()) return;
    const tooltip = document.createElement("div");
    addClass(tooltip, "vw-links");
    tooltip.style.display = "none";
    tooltip.style.cursor = "pointer";
    tooltip.style.position = "fixed";
    tooltip.style.zIndex = "2147483647";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.background = "#1351b4";
    tooltip.style.color = "#fff";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontFamily = "Rawline, Arial, sans-serif";
    tooltip.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(tooltip);
  }

  function activate() {
    if (isActive) return;
    isActive = true;

    document.addEventListener("mouseover", highlightElement);
    document.addEventListener("mouseout", removeHighlight);
    document.addEventListener("scroll", removeTooltips);
    document.addEventListener("click", translateContent, true);

    window.addEventListener("vp-widget-close", deactivate);
    window.addEventListener("vp-disable-text-capture", deactivate);
    window.addEventListener("vp-enable-text-capture", activate);
  }

  function deactivate() {
    if (!isActive) return;
    isActive = false;

    removeTooltips();
    document.removeEventListener("mouseover", highlightElement);
    document.removeEventListener("mouseout", removeHighlight);
    document.removeEventListener("scroll", removeTooltips);
    document.removeEventListener("click", translateContent, true);

    window.removeEventListener("vp-widget-close", deactivate);
    window.removeEventListener("vp-disable-text-capture", deactivate);
    window.removeEventListener("vp-enable-text-capture", activate);

    const highlighted = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
    for (const element of highlighted) removeHighlight({ target: element });
  }

  window.__vlibrasTextCapture = {
    activate,
    deactivate,
    get active() {
      return isActive;
    },
  };

  activate();
}

if (!window.__vlibrasTextCaptureLoaded) {
  window.__vlibrasTextCaptureLoaded = true;

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", loadTextCaptureScript, {
      once: true,
    });
  else loadTextCaptureScript();
}

if (!window.__vlibrasTextCaptureMessageListenerLoaded) {
  window.__vlibrasTextCaptureMessageListenerLoaded = true;

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "VLibrasTextCaptureEnable")
      window.__vlibrasTextCapture?.activate?.();
    if (message?.type === "VLibrasTextCaptureDisable")
      window.__vlibrasTextCapture?.deactivate?.();
  });
}
