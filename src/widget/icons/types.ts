import type { ComponentProps, ElementType } from "preact/compat";

export type CustomSVGProps = ComponentProps<"svg"> & { size?: number; iconTitle?: string };

export type IconElement = ElementType<CustomSVGProps>;
