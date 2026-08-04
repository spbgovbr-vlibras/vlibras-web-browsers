import pkg from "../../../package.json";
import { pick } from "../utils";

export const APP_INFO = pick(
	pkg,
	"name",
	"version",
	"description",
	"author",
	"homepage",
	"keywords",
	"repository",
	"license",
);
