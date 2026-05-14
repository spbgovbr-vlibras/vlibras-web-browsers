export const getCategories = async () => {
	try {
		const response = await fetch("https://repositorio-dth.vlibras.lavid.ufpb.br/api/tags", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		return await response.json();
	} catch (e) {
		console.error(e);
		return e;
	}
};

export const getCategorySigns = async (category: string) => {
	try {
		const response = await fetch(`https://repositorio-dth.vlibras.lavid.ufpb.br/api/tagsigns?tag=${category}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		console.log("categoria: ", category);
		return await response.json();
	} catch (e) {
		console.error(e);
		return e;
	}
};
