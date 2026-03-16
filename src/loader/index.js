const path = window.vw_path || "https://vlibras.com/dist";

const template = `
<div id="vlb-access-wrapper">
	<img id="vlb-access-popup" src="${path}/assets/images/vlb-popup.webp" />
	<button type="button" aria-label="Recursos assistivos com VLibras Widget+" id="vlb-access-button">
      <img src="${path}/assets/images/vlb-access.svg" />
    </button>
</div>
<style>
#vlb-access-wrapper {
	height: 40px;
	width: 40px;
}

#vlb-access-button,
#vlb-access-popup {
	border-radius: 8px;
	overflow: hidden;
	height: 40px;
}

#vlb-access-wrapper {
	display: flex;
	align-items: center;
	position: fixed;
	z-index: 2147483639;
	right: 10px;
	top: calc(50vh - 20px);
	transition: all .5s ease;
	width: 40px;

	&:hover { 
		width: 208px;
	}
}

#vlb-access-button {
	right: 0;
	z-index: 1;
	position: absolute;
	width: 40px;
	height: 40px;
	border: none;
	padding: 0;
	cursor: pointer;

	&:hover { 
		filter: brightness(1.1);
	}
}
</style>`;

const wrapper = document.createElement("div");
const shadow = wrapper.attachShadow({ mode: "open" });
wrapper.id = "vlb-app-wrapper";

shadow.innerHTML = template;
document.body.appendChild(wrapper);

let widget;
const initBtn = shadow.querySelector("#vlb-access-button");

const open = () => {
  if (widget) return (widget.dataset.active = true);

  const script = document.createElement("script");
  script.src = `${path}/vlibras-plugin-app.umd.cjs`;
  script.async = true;
  script.onload = () => {
    widget = document.getElementById("vlb-app-root");
    widget.dataset.active = true;
  };

  document.body.appendChild(script);
};

initBtn.onclick = open;

window.VLibrasWidget = {};
window.VLibrasWidget = { path, initBtn, open };

if (localStorage.getItem("@vlibras-wp").includes('"isActive":true')) open();
