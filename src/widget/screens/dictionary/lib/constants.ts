import alphabetIcon from "@/widget/icons/categories/AlphabetIcon.webp";
import animalsIcon from "@/widget/icons/categories/AnimalsIcon.webp";
import bodyIcon from "@/widget/icons/categories/BodyIcon.webp";
import countriesIcon from "@/widget/icons/categories/CountriesIcon.webp";
import familyIcon from "@/widget/icons/categories/FamilyIcon.webp";
import feelingsIcon from "@/widget/icons/categories/FeelingsIcon.webp";
import foodsIcon from "@/widget/icons/categories/FoodsIcon.webp";
import healthIcon from "@/widget/icons/categories/HealthIcon.webp";
import jobsIcon from "@/widget/icons/categories/JobsIcon.webp";
import locationsIcon from "@/widget/icons/categories/LocationsIcon.webp";
import machinesIcon from "@/widget/icons/categories/MachinesIcon.webp";
import measuresIcon from "@/widget/icons/categories/MeasuresIcon.webp";
import natureIcon from "@/widget/icons/categories/NatureIcon.webp";
import numbersIcon from "@/widget/icons/categories/NumbersIcon.webp";
import sportsIcon from "@/widget/icons/categories/SportsIcon.webp";
import verbsIcon from "@/widget/icons/categories/VerbsIcon.webp";

export const CategoriesList = [
	{
		id: 5,
		name: "Comidas e Bebidas",
		icon: foodsIcon,
	},
	{
		id: 10,
		name: "Animais",
		icon: animalsIcon,
	},
	{
		id: 6,
		name: "Aparelho ou Máquina",
		icon: machinesIcon,
	},
	{
		id: 9,
		name: "Corpo",
		icon: bodyIcon,
	},
	{
		id: 14,
		name: "Esporte ou Diversão",
		icon: sportsIcon,
	},
	{
		id: 15,
		name: "Família",
		icon: familyIcon,
	},
	{
		id: 8,
		name: "Saúde/Higiene",
		icon: healthIcon,
	},
	{
		id: 13,
		name: "País/Estado/Cidade",
		icon: countriesIcon,
	},
	{
		id: 16,
		name: "Natureza",
		icon: natureIcon,
	},
	{
		id: 12,
		name: "Profissão ou Trabalho",
		icon: jobsIcon,
	},
	{
		id: 7,
		name: "Sentimentos",
		icon: feelingsIcon,
	},
	{
		id: 3,
		name: "Verbos",
		icon: verbsIcon,
	},
	{
		id: 4,
		name: "Letras",
		icon: alphabetIcon,
	},
	{
		id: 2,
		name: "Números",
		icon: numbersIcon,
	},
	{
		id: 11,
		name: "Lugares",
		icon: locationsIcon,
	},
	{
		id: 1,
		name: "Medidas",
		icon: measuresIcon,
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
