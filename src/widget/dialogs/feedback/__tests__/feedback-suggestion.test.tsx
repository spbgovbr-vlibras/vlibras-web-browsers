import { act, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TrieNode, TrieRoot } from "@/common/lib/trie";
import { playerStore } from "@/player/stores/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { FeedbackSuggestion } from "../feedback-suggestion";
import { useFeedbackSuggestionStore } from "../stores/use-feedback-suggestion.store";

function buildRoot(words: string[]): TrieRoot {
	const root: TrieNode = { children: {}, end: false };
	for (const word of words) {
		let node = root;
		for (const char of word) {
			node.children[char] ??= { children: {}, end: false };
			node = node.children[char];
		}
		node.end = true;
	}
	return { root };
}

const { mockUseDictionarySigns, mockUseSendFeedback, mockPlayStatic, mockCreateCallback, mockOnFeedbackSuccess } =
	vi.hoisted(() => ({
		mockUseDictionarySigns: vi.fn(),
		mockUseSendFeedback: vi.fn(),
		mockPlayStatic: vi.fn(),
		mockCreateCallback: vi.fn(),
		mockOnFeedbackSuccess: vi.fn(),
	}));

vi.mock("@/common/hooks", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/common/hooks")>();
	return {
		...actual,
		useMobile: () => false,
	};
});

vi.mock("@/core/actions/hooks", () => ({
	useDictionarySigns: mockUseDictionarySigns,
	useSendFeedback: mockUseSendFeedback,
}));

vi.mock("@/player/actions", () => ({
	playStatic: mockPlayStatic,
}));

vi.mock("@/widget/stores/use-callback.store", () => ({
	createCallback: mockCreateCallback,
}));

vi.mock("@/widget/utils/feedback", () => ({
	onFeedbackSuccess: mockOnFeedbackSuccess,
}));

vi.mock("@/widget/components/ui/dialog", () => ({
	Dialog: ({ children }: { open: boolean; onOpenChange: (v: boolean) => void; children: ComponentChildren }) => (
		<div role="dialog">{children}</div>
	),
	DialogContent: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DialogHeader: ({ children, closeProps }: { children: ComponentChildren; closeProps?: { "aria-label"?: string } }) => (
		<header>
			{children}
			{closeProps && (
				<button type="button" aria-label={closeProps["aria-label"]}>
					Close
				</button>
			)}
		</header>
	),
	DialogTitle: ({ children }: { children: ComponentChildren }) => <h2>{children}</h2>,
}));

const getTextarea = () => screen.getByLabelText("Informe a glosa correta") as HTMLTextAreaElement;
const getSubmitButton = () => screen.getByText(/Enviar sugestão|Enviando/).closest("button") as HTMLButtonElement;
const getPlayButton = () => screen.getByText("Reproduzir").closest("button") as HTMLButtonElement;

describe("FeedbackSuggestion", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		mockUseDictionarySigns.mockReset();
		mockUseSendFeedback.mockReset();
		mockPlayStatic.mockReset();
		mockCreateCallback.mockReset();
		mockOnFeedbackSuccess.mockReset();

		mockUseDictionarySigns.mockReturnValue({ data: buildRoot(["TESTE", "TESTAR", "OUTRO"]) });
		mockUseSendFeedback.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

		playerStore.set({ gloss: undefined });
		widgetStore.set({ text: undefined });
		useFeedbackSuggestionStore.setState({ reopen: false, draftValue: undefined });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should prefill the textarea from the draft value when one is present", () => {
		useFeedbackSuggestionStore.setState({ reopen: true, draftValue: "RASCUNHO" });
		playerStore.set({ gloss: "GLOSSA IGNORADA" });

		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		expect(getTextarea().value).toBe("RASCUNHO");
	});

	it("should fall back to the player gloss when there is no draft value", () => {
		playerStore.set({ gloss: "GLOSSA ATUAL" });

		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		expect(getTextarea().value).toBe("GLOSSA ATUAL");
	});

	it("should start empty when there is neither a draft value nor a gloss", () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		expect(getTextarea().value).toBe("");
	});

	it("should reset the feedback-suggestion store's reopen and draftValue on mount", () => {
		useFeedbackSuggestionStore.setState({ reopen: true, draftValue: "RASCUNHO" });

		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		expect(useFeedbackSuggestionStore.getState()).toMatchObject({ reopen: false, draftValue: undefined });
	});

	it("should populate suggestions from the trie after typing a word with 2+ characters, once the debounce elapses", async () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		fireEvent.input(getTextarea(), { target: { value: "TE" } });

		expect(screen.queryByText("TESTE")).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(300);
		});

		await waitFor(() => expect(screen.getByText("TESTE")).toBeInTheDocument());
		expect(screen.getByText("TESTAR")).toBeInTheDocument();
		expect(screen.queryByText("OUTRO")).not.toBeInTheDocument();
	});

	it("should clear suggestions instead of querying the trie when the current word has fewer than 2 characters", () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		fireEvent.input(getTextarea(), { target: { value: "T" } });

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(screen.queryByText("TESTE")).not.toBeInTheDocument();
	});

	it("should apply the selected suggestion to the textarea value and clear the suggestion list", async () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		fireEvent.input(getTextarea(), { target: { value: "TE" } });
		act(() => {
			vi.advanceTimersByTime(300);
		});
		await waitFor(() => expect(screen.getByText("TESTAR")).toBeInTheDocument());

		fireEvent.click(screen.getByText("TESTAR"));

		expect(getTextarea().value).toBe("TESTAR ");
		expect(screen.queryByText("TESTAR")).not.toBeInTheDocument();
	});

	it("should disable the submit button while the textarea is empty", () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		expect(getSubmitButton()).toBeDisabled();
	});

	it("should enable the submit button once a non-empty value is committed and disable it again while pending", () => {
		mockUseSendFeedback.mockReturnValue({ mutateAsync: vi.fn(), isPending: true });

		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		fireEvent.input(getTextarea(), { target: { value: "TESTE" } });
		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(getSubmitButton()).toBeDisabled();
		expect(screen.getByText("Enviando...")).toBeInTheDocument();
	});

	it("should submit feedback with a 'bad' rating and the uppercased review when text and gloss are present", () => {
		const sendFeedback = vi.fn();
		mockUseSendFeedback.mockReturnValue({ mutateAsync: sendFeedback, isPending: false });
		widgetStore.set({ text: "texto original" });
		playerStore.set({ gloss: "GLOSA ORIGINAL" });

		const onOpenChange = vi.fn();
		render(<FeedbackSuggestion open={true} onOpenChange={onOpenChange} />);

		fireEvent.input(getTextarea(), { target: { value: "testar" } });
		act(() => {
			vi.advanceTimersByTime(300);
		});

		fireEvent.click(getSubmitButton());

		expect(sendFeedback).toHaveBeenCalledWith({
			text: "texto original",
			translation: "GLOSA ORIGINAL",
			review: "TESTAR",
			rating: "bad",
		});
		expect(onOpenChange).toHaveBeenCalledWith(false);
		expect(mockOnFeedbackSuccess).toHaveBeenCalledTimes(1);
	});

	it("should not submit feedback when text or gloss is missing, even with a non-empty value", () => {
		const sendFeedback = vi.fn();
		mockUseSendFeedback.mockReturnValue({ mutateAsync: sendFeedback, isPending: false });
		widgetStore.set({ text: undefined });
		playerStore.set({ gloss: "GLOSA ORIGINAL" });

		const onOpenChange = vi.fn();
		render(<FeedbackSuggestion open={true} onOpenChange={onOpenChange} />);

		fireEvent.input(getTextarea(), { target: { value: "testar" } });
		act(() => {
			vi.advanceTimersByTime(300);
		});

		fireEvent.click(getSubmitButton());

		expect(sendFeedback).not.toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(mockOnFeedbackSuccess).not.toHaveBeenCalled();
	});

	it("should disable the play button while empty and not call playStatic when clicked", () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		expect(getPlayButton()).toBeDisabled();
	});

	it("should call playStatic and register a callback that persists the draft when play is clicked with a value", () => {
		render(<FeedbackSuggestion open={true} onOpenChange={() => {}} />);

		fireEvent.input(getTextarea(), { target: { value: "TESTE" } });
		act(() => {
			vi.advanceTimersByTime(300);
		});

		fireEvent.click(getPlayButton());

		expect(mockPlayStatic).toHaveBeenCalledWith("TESTE");
		expect(mockCreateCallback).toHaveBeenCalledTimes(1);

		const registered = mockCreateCallback.mock.calls[0][0] as { action: () => void; auto: boolean };
		expect(registered.auto).toBe(true);

		registered.action();

		expect(useFeedbackSuggestionStore.getState()).toMatchObject({ reopen: true, draftValue: "TESTE" });
	});
});
