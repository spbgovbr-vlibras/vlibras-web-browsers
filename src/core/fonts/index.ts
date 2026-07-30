const FONT_FAMILY = "VLibrasWidget_Font";

const FONT_FACES = [
	{ file: "rawline-500.ttf", weight: "500", style: "normal" },
	{ file: "rawline-500i.ttf", weight: "500", style: "italic" },
	{ file: "rawline-600.ttf", weight: "600", style: "normal" },
	{ file: "rawline-600i.ttf", weight: "600", style: "italic" },
	{ file: "rawline-700.ttf", weight: "700", style: "normal" },
	{ file: "rawline-700i.ttf", weight: "700", style: "italic" },
] as const;

let isFontLoaded = false;

export const loadDefaultFont = async (path: string, shadowRoot: ShadowRoot) => {
	if (isFontLoaded) return;
	isFontLoaded = true;

	if (typeof FontFace === "undefined") {
		injectFontFaceStyle(path, shadowRoot);
		return;
	}

	const fonts = FONT_FACES.map(
		({ file, weight, style }) =>
			new FontFace(FONT_FAMILY, `url(${path}/assets/fonts/rawline/${file}) format('truetype')`, {
				weight,
				style,
			}),
	);

	try {
		await loadFontFace(fonts);
	} catch (error) {
		console.error("Error loading default font, falling back to @font-face:", error);
		injectFontFaceStyle(path, shadowRoot);
	}
};

export const loadFontFace = async (fonts: FontFace[]) => {
	await Promise.all(fonts.map((font) => font.load()));
	fonts.forEach((font) => document.fonts.add(font));
};

const injectFontFaceStyle = (path: string, shadowRoot: ShadowRoot) => {
	const style = document.createElement("style");

	style.textContent = FONT_FACES.map(
		({ file, weight, style: fontStyle }) => `
			@font-face {
				font-family: "${FONT_FAMILY}";
				src: url("${path}/assets/fonts/rawline/${file}") format("truetype");
				font-weight: ${weight};
				font-style: ${fontStyle};
			}
		`,
	).join("\n");

	shadowRoot.appendChild(style);
};
