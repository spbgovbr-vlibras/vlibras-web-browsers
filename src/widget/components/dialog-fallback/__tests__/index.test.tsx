import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { DialogFallback } from "@/widget/components/dialog-fallback";
import { useRootStore } from "@/widget/stores/use-root.store";

describe("DialogFallback", () => {
	it("should render nothing when the widget root isn't mounted yet", () => {
		useRootStore.setState({ appRoot: undefined });
		const { container } = render(<DialogFallback />);
		expect(container).toBeEmptyDOMElement();
	});

	it("should announce the loading state via a polite live region", () => {
		const appRoot = document.createElement("div");
		document.body.appendChild(appRoot);
		useRootStore.setState({ appRoot });

		render(<DialogFallback />);
		expect(screen.getByRole("status")).toHaveTextContent("Carregando...");

		appRoot.remove();
	});
});
