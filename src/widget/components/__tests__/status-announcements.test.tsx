import { render, screen } from "@testing-library/preact";
import type { ComponentProps } from "preact";
import { describe, expect, it, vi } from "vitest";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { ProgressBar } from "@/widget/components/controls/progress-bar";
import { TranslatingBadge } from "@/widget/components/controls/translating-badge";
import { UnityLoading } from "@/widget/components/unity-loading";
import { ToasterProvider } from "@/widget/providers/toaster";
import { ToastItem } from "@/widget/providers/toaster/toast-item";
import { useRootStore } from "@/widget/stores/use-root.store";

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

vi.mock("@/widget/components/ui/spinner", () => ({
	Spinner: ({ className, size: _size }: { className?: string; size?: number }) => (
		<span className={className} data-testid="spinner" />
	),
}));

vi.mock("@/widget/components/ui/button", () => ({
	Button: (props: ComponentProps<"button">) => <button {...props} />,
}));

describe("status announcements (issue 172)", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		useRootStore.setState({ appRoot: undefined });
	});

	it("should announce default toasts politely without moving focus", () => {
		render(<ToastItem id="t1" message="Traduzindo..." />);
		const toast = screen.getByRole("status");
		expect(toast).toHaveTextContent("Traduzindo...");
		expect(document.activeElement).toBe(document.body);
	});

	it("should announce destructive toasts assertively", () => {
		render(<ToastItem id="t2" message="Falha ao traduzir" variant="destructive" />);
		expect(screen.getByRole("alert")).toHaveTextContent("Falha ao traduzir");
		expect(document.activeElement).toBe(document.body);
	});

	it("should expose a polite live region on the toaster container", () => {
		const appRoot = document.createElement("div");
		document.body.appendChild(appRoot);
		useRootStore.setState({ appRoot });
		render(<ToasterProvider />);
		expect(appRoot.querySelector('[aria-live="polite"]')).not.toBeNull();
		appRoot.remove();
	});

	it("should announce translating badge via live region", () => {
		render(<TranslatingBadge />);
		expect(screen.getByRole("status")).toHaveTextContent("Traduzindo...");
		expect(document.activeElement).toBe(document.body);
	});

	it("should label translation progressbar with range and text", () => {
		usePlayerStore.setState({ countGloss: { count: 1, max: 4 } });
		render(<ProgressBar />);
		const bar = screen.getByRole("progressbar", { name: "Progresso da tradução" });
		expect(bar).toHaveAttribute("aria-valuemin", "0");
		expect(bar).toHaveAttribute("aria-valuemax", "100");
		expect(bar).toHaveAttribute("aria-valuenow");
		expect(bar).toHaveAttribute("aria-valuetext");
	});

	it("should label player loading progressbar with range and text", () => {
		usePlayerStore.setState({ progress: 42, isLoaded: false, isBroken: false });
		render(<UnityLoading />);
		const bar = screen.getByRole("progressbar", { name: "Carregamento do player" });
		expect(bar).toHaveAttribute("aria-valuemin", "0");
		expect(bar).toHaveAttribute("aria-valuemax", "100");
		expect(bar).toHaveAttribute("aria-valuenow", "42");
		expect(bar).toHaveAttribute("aria-valuetext", "42%");
	});

	it("should announce player load failure as alert", () => {
		usePlayerStore.setState({ progress: 0, isLoaded: false, isBroken: true });
		render(<UnityLoading />);
		expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível carregar o player.");
		expect(document.activeElement).not.toBe(screen.getByRole("alert"));
	});
});
