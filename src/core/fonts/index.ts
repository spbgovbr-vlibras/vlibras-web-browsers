export const loadDefaultFont = async (path: string, shadowRoot: ShadowRoot) => {	
	const fonts = [
		new FontFace("VLibrasWidget_Font", `url(${path}/assets/fonts/rawline/rawline-500.ttf) format('truetype')`, {
			weight: "500",
		}),
		new FontFace("VLibrasWidget_Font", `url(${path}/assets/fonts/rawline/rawline-500i.ttf) format('truetype')`, {
			weight: "500",
			style: "italic",
		}),
		new FontFace("VLibrasWidget_Font", `url(${path}/assets/fonts/rawline/rawline-600.ttf) format('truetype')`, {
			weight: "600",
		}),
		new FontFace("VLibrasWidget_Font", `url(${path}/assets/fonts/rawline/rawline-600i.ttf) format('truetype')`, {
			weight: "600",
			style: "italic",
		}),
		new FontFace("VLibrasWidget_Font", `url(${path}/assets/fonts/rawline/rawline-700.ttf) format('truetype')`, {
			weight: "700",
		}),
		new FontFace("VLibrasWidget_Font", `url(${path}/assets/fonts/rawline/rawline-700i.ttf) format('truetype')`, {
			weight: "700",
			style: "italic",
		}),
	];

	await loadFontFace(fonts, (styleSheets) => {
		shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, ...styleSheets];
	});
};

export const loadFontFace = async (fonts: FontFace[], callback?: (styleSheed: CSSStyleSheet[]) => void) => {
	await Promise.all(fonts.map((font) => font.load()));
	fonts.forEach((font) => document.fonts.add(font));

	if (callback) callback(document.adoptedStyleSheets);
};
