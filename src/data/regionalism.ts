import { flags } from "@/assets";

export type Region = {
	name: string;
	flag: string;
	abbreviation: RegionAbbreviation;
};
export type RegionAbbreviation =
	| "BR"
	| "AC"
	| "AL"
	| "AP"
	| "AM"
	| "BA"
	| "CE"
	| "DF"
	| "ES"
	| "GO"
	| "MA"
	| "MT"
	| "MS"
	| "MG"
	| "PA"
	| "PB"
	| "PR"
	| "PE"
	| "PI"
	| "RJ"
	| "RN"
	| "RS"
	| "RO"
	| "RR"
	| "SC"
	| "SP"
	| "SE"
	| "TO";

export const regions: Region[] = [
	{ name: "BR - Padrão Nacional", flag: flags.BR, abbreviation: "BR" },
	{ name: "Acre", flag: flags.AC, abbreviation: "AC" },
	{ name: "Alagoas", flag: flags.AL, abbreviation: "AL" },
	{ name: "Amapá", flag: flags.AP, abbreviation: "AP" },
	{ name: "Amazonas", flag: flags.AM, abbreviation: "AM" },
	{ name: "Bahia", flag: flags.BA, abbreviation: "BA" },
	{ name: "Ceará", flag: flags.CE, abbreviation: "CE" },
	{ name: "Distrito Federal", flag: flags.DF, abbreviation: "DF" },
	{ name: "Espirito Santo", flag: flags.ES, abbreviation: "ES" },
	{ name: "Goiás", flag: flags.GO, abbreviation: "GO" },
	{ name: "Maranhão", flag: flags.MA, abbreviation: "MA" },
	{ name: "Mato Grosso", flag: flags.MT, abbreviation: "MT" },
	{ name: "Mato Grosso do Sul", flag: flags.MS, abbreviation: "MS" },
	{ name: "Minas Gerais", flag: flags.MG, abbreviation: "MG" },
	{ name: "Pará", flag: flags.PA, abbreviation: "PA" },
	{ name: "Paraíba", flag: flags.PB, abbreviation: "PB" },
	{ name: "Paraná", flag: flags.PR, abbreviation: "PR" },
	{ name: "Pernambuco", flag: flags.PE, abbreviation: "PE" },
	{ name: "Piaui", flag: flags.PI, abbreviation: "PI" },
	{ name: "Rio de Janeiro", flag: flags.RJ, abbreviation: "RJ" },
	{ name: "Rio Grande do Norte", flag: flags.RN, abbreviation: "RN" },
	{ name: "Rio Grande do Sul", flag: flags.RS, abbreviation: "RS" },
];
