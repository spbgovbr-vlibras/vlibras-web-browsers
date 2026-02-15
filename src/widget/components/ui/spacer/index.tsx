import type { ComponentPropsWithoutRef } from "preact/compat";

{
	cn;
}
from;
("@/common/lib/utils");

export const Spacer = ({ className, ...props }: Omit<ComponentPropsWithoutRef<"div">, "class" | "children">) => {
	return <div className={cn("h-4", className)} {...props} />;
};
