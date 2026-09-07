import { fireEvent, render, screen } from "@testing-library/preact";
import type { ComponentProps } from "preact";
import { describe, expect, it, vi } from "vitest";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { UnityLoading } from "@/widget/components/unity-loading";

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

describe("UnityLoading", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should render nothing when loaded", () => {
		usePlayerStore.setState({ progress: 100, isLoaded: true, isBroken: false });
		const state = playerStore.get();
		playerStore.get = () => ({ ...state, retryLoad: vi.fn() });
		const { container } = render(<UnityLoading />);
		expect(container.firstChild).toBeNull();
	});

	it("should render loading UI", () => {
		usePlayerStore.setState({ progress: 50, isLoaded: false, isBroken: false });
		render(<UnityLoading />);
		expect(screen.getByText("VLibras Widget")).toBeInTheDocument();
	});

	it("should render retry button when broken", () => {
		usePlayerStore.setState({ progress: 0, isLoaded: false, isBroken: true });
		render(<UnityLoading />);
		expect(screen.getByText("Não foi possível carregar o player.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
	});

	it("should call retryLoad when retry is clicked", () => {
		const retryLoad = vi.fn();
		usePlayerStore.setState({ progress: 0, isLoaded: false, isBroken: true });
		const state = playerStore.get();
		playerStore.get = () => ({ ...state, retryLoad });
		render(<UnityLoading />);
		fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
		expect(retryLoad).toHaveBeenCalledOnce();
	});
});
