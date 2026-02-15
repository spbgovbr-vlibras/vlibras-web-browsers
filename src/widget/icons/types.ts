import type { ComponentPropsWithRef } from "preact/compat";

export type CustomSVGProps = ComponentPropsWithRef<"svg"> & { size?: number; iconTitle?: string };
