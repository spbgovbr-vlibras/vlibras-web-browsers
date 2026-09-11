import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { posthogg } from "@/common/lib/posthog";
import * as playerActions from "@/player/actions";
import { TranslatorDialog } from "@/widget/dialogs/translator";
import * as translateHook from "@/widget/hooks/use-translate";
import * as callbackStore from "@/widget/stores/use-callback.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

vi.mock("@/common/hooks", async () => {
	const actual = (await vi.importActual("@/common/hooks")) as Record<string, unknown>;
	return {
		...actual,
		useDebouncedCallback: (fn: (v: string) => void) => fn,
	};
});

vi.mock("@/widget/components/ui/dialog", () => ({
	Dialog: ({ children }: { open: boolean; children: ComponentChildren }) =>
		open ? <div role="dialog">{children}</div> : null,
	DialogContent: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DialogHeader: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DialogTitle: ({ children }: { children: ComponentChildren }) => <h2>{children}</h2>,
}));

vi.mock("@/widget/components/inline-translator-button", () => ({
	InlineTranslatorButton: () => <button type="button">inline</button>,
}));

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: () => <span>icon</span>,
}));

vi.mock("@/widget/components/ui/spinner", () => ({
	Spinner: () => <span>spinner</span>,
}));

describe("TranslatorDialog", () => {
	const onOpenChange = vi.fn();
	const mockTranslate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		useWidgetStore.setState({ isTranslating: false } as unknown as ReturnType<typeof useWidgetStore.getState>);
		vi.spyOn(translateHook, "useTranslate").mockReturnValue({
			mutateAsync: mockTranslate,
			isPending: false,
		} as unknown as ReturnType<typeof translateHook.useTranslate>);
		vi.spyOn(playerActions, "play").mockImplementation(() => {});
		vi.spyOn(callbackStore, "createCallback").mockImplementation(() => {});
		vi.spyOn(posthogg, "trackEvent").mockResolvedValue(undefined);
		mockTranslate.mockResolvedValue("GLOSS");
	});

	it("should track open_translator when open true", () => {
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		expect(posthogg.trackEvent).toHaveBeenCalledWith("open_translator");
	});

	it("should disable translate button when text <3", async () => {
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const btn = screen.getByRole("button", { name: "Traduzir" });
		expect(btn).toBeDisabled();
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		fireEvent.change(textarea, { target: { value: "oi" } });
		// isValidTranslationText for "oi" has letters -> valid but length <3 still disabled
		expect(btn).toBeDisabled();
		fireEvent.change(textarea, { target: { value: "olá mundo" } });
		await waitFor(() => expect(btn).not.toBeDisabled());
	});

	it("should call handleTranslate and play gloss on click", async () => {
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		textarea.value = "ola mundo";
		// set text via change (debounced mocked)
		fireEvent.change(textarea, { target: { value: "ola mundo" } });
		const btn = screen.getByRole("button", { name: "Traduzir" });
		await waitFor(() => expect(btn).not.toBeDisabled());
		fireEvent.click(btn);
		await waitFor(() => expect(mockTranslate).toHaveBeenCalledWith("ola mundo"));
		expect(playerActions.play).toHaveBeenCalledWith("GLOSS");
		expect(onOpenChange).toHaveBeenCalledWith(false);
		expect(callbackStore.createCallback).toHaveBeenCalled();
	});

	it("should fallback to text when gloss falsy", async () => {
		mockTranslate.mockResolvedValue(undefined);
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		textarea.value = "ola";
		fireEvent.change(textarea, { target: { value: "ola mundo teste" } });
		const btn = screen.getByRole("button", { name: "Traduzir" });
		await waitFor(() => expect(btn).not.toBeDisabled());
		fireEvent.click(btn);
		await waitFor(() => expect(playerActions.play).toHaveBeenCalledWith("ola mundo teste"));
	});

	it("should handle Ctrl+Enter when valid", async () => {
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		textarea.value = "ola mundo";
		fireEvent.change(textarea, { target: { value: "ola mundo" } });
		await waitFor(() => expect(screen.getByRole("button", { name: "Traduzir" })).not.toBeDisabled());
		fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
		await waitFor(() => expect(mockTranslate).toHaveBeenCalled());
	});

	it("should not translate on Ctrl+Enter when text <3", async () => {
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		fireEvent.change(textarea, { target: { value: "oi" } });
		fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
		expect(mockTranslate).not.toHaveBeenCalled();
	});

	it("should clear text on trash click", async () => {
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		fireEvent.change(textarea, { target: { value: "ola mundo" } });
		await waitFor(() => expect(screen.getByLabelText("Limpar texto")).toBeInTheDocument());
		fireEvent.click(screen.getByLabelText("Limpar texto"));
		expect(textarea.value).toBe("");
	});

	it("should log error when translate fails", async () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockTranslate.mockRejectedValue(new Error("fail"));
		render(<TranslatorDialog open={true} onOpenChange={onOpenChange} />);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		textarea.value = "ola mundo erro";
		fireEvent.change(textarea, { target: { value: "ola mundo erro" } });
		const btn = screen.getByRole("button", { name: "Traduzir" });
		await waitFor(() => expect(btn).not.toBeDisabled());
		fireEvent.click(btn);
		await waitFor(() => expect(spy).toHaveBeenCalled());
		spy.mockRestore();
	});
});
