import {
	AlphabetIcon,
	AnimalsIcon,
	BodyIcon,
	CountriesIcon,
	FamilyIcon,
	FeelingsIcon,
	FoodsIcon,
	HealthIcon,
	JobsIcon,
	LocationsIcon,
	MachinesIcon,
	MeasuresIcon,
	NatureIcon,
	NumbersIcon,
	SportsIcon,
	VerbsIcon,
} from "@/widget/icons/categories-icons";

export const CategoriesList = [
	{
		name: "Comidas e Bebidas",
		icon: FoodsIcon,
	},
	{
		name: "Animais",
		icon: AnimalsIcon,
	},
	{
		name: "Aparelho ou Máquina",
		icon: MachinesIcon,
	},
	{
		name: "Corpo",
		icon: BodyIcon,
	},
	{
		name: "Esporte ou Diversão",
		icon: SportsIcon,
	},
	{
		name: "Família",
		icon: FamilyIcon,
	},
	{
		name: "Saúde/Higiene",
		icon: HealthIcon,
	},
	{
		name: "País/Estado/Cidade",
		icon: CountriesIcon,
	},
	{
		name: "Natureza",
		icon: NatureIcon,
	},
	{
		name: "Profissão ou Trabalho",
		icon: JobsIcon,
	},
	{
		name: "Sentimentos",
		icon: FeelingsIcon,
	},
	{
		name: "Verbos",
		icon: VerbsIcon,
	},
	{
		name: "Letras",
		icon: AlphabetIcon,
	},
	{
		name: "Números",
		icon: NumbersIcon,
	},
	{
		name: "Lugares",
		icon: LocationsIcon,
	},
	{
		name: "Medidas",
		icon: MeasuresIcon,
	},
];

export const ALPHABET = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export const prefixMap: Record<string, string> = {
	"1S_": "EU",
	"2S_": "VOCÊ",
	"3S_": "ELE(A)",
	"1P_": "NÓS",
	"2P_": "VOCÊS",
	"3P_": "ELES(AS)",
};

export const suffixMap: Record<string, string> = {
	_1S: "MIM",
	_2S: "VOCÊ",
	_3S: "ELE(A)",
	_1P: "NÓS",
	_2P: "VOCÊS",
	_3P: "ELES(AS)",
};

export const conjugationOrder = [
	"EU PARA MIM",
	"EU PARA VOCÊ",
	"EU PARA ELE(A)",
	"EU PARA NÓS",
	"EU PARA VOCÊS",
	"EU PARA ELES(AS)",
	"VOCÊ PARA MIM",
	"VOCÊ PARA VOCÊ",
	"VOCÊ PARA ELE(A)",
	"VOCÊ PARA NÓS",
	"VOCÊ PARA VOCÊS",
	"VOCÊ PARA ELES(AS)",
	"ELE(A) PARA MIM",
	"ELE(A) PARA VOCÊ",
	"ELE(A) PARA ELE(A)",
	"ELE(A) PARA NÓS",
	"ELE(A) PARA VOCÊS",
	"ELE(A) PARA ELES(AS)",
	"NÓS PARA MIM",
	"NÓS PARA VOCÊ",
	"NÓS PARA ELE(A)",
	"NÓS PARA NÓS",
	"NÓS PARA VOCÊS",
	"NÓS PARA ELES(AS)",
	"VOCÊS PARA MIM",
	"VOCÊS PARA VOCÊ",
	"VOCÊS PARA ELE(A)",
	"VOCÊS PARA NÓS",
	"VOCÊS PARA VOCÊS",
	"VOCÊS PARA ELES(AS)",
	"ELES(AS) PARA MIM",
	"ELES(AS) PARA VOCÊ",
	"ELES(AS) PARA ELE(A)",
	"ELES(AS) PARA NÓS",
	"ELES(AS) PARA VOCÊS",
	"ELES(AS) PARA ELES(AS)",
];

export const verbRegex = new RegExp(
	"^(1S_|2S_|3S_|1P_|2P_|3P_)?" + "([A-ZÇÕÂÊÍÓÚ]+(?:_(?![123][SP])[A-ZÇÕÂÊÍÓÚ]+)*)" + "(_1S|_2S|_3S|_1P|_2P|_3P)?$",
);
