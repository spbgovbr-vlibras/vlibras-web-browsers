import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { playerStore } from "@/player/stores/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { FeedbackDialog } from "../index";
import { useFeedbackSuggestionStore } from "../stores/use-feedback-suggestion.store";

const { mockUseSendFeedback, mockOnFeedbackSuccess } = vi.hoisted(() => ({
	mockUseSendFeedback: vi.fn(),
	mockOnFeedbackSuccess: vi.fn(),
}));

vi.mock("@/common/hooks", () => ({
	useMobile: () => false,
}));

vi.mock("@/core/actions/hooks", () => ({
	useSendFeedback: mockUseSendFeedback,
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

vi.mock("../feedback-question", () => ({
	FeedbackQuestion: ({ onLike, onDislike }: { onLike: () => void; onDislike: () => void }) => (
		<div>
			<button type="button" onClick={onLike}>
				like
			</button>
			<button type="button" onClick={onDislike}>
				dislike
			</button>
		</div>
	),
}));

vi.mock("../feedback-like-confirm", () => ({
	FeedbackLikeConfirm: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
		<div>
			<button type="button" onClick={onConfirm}>
				confirm
			</button>
			<button type="button" onClick={onCancel}>
				cancel
			</button>
		</div>
	),
}));

vi.mock("../feedback-suggestion", () => ({
	FeedbackSuggestion: () => <div data-testid="suggestion-dialog" />,
}));

describe("FeedbackDialog", () => {
	beforeEach(() => {
		mockUseSendFeedback.mockReset();
		mockOnFeedbackSuccess.mockReset();
		mockUseSendFeedback.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
		playerStore.set({ gloss: undefined });
		widgetStore.set({ text: undefined });
		useFeedbackSuggestionStore.setState({ reopen: false, draftValue: undefined });
	});

	it("should show the question step on initial render", () => {
		render(<FeedbackDialog open={true} onOpenChange={() => {}} />);

		expect(screen.getByText("Gostou da tradução?")).toBeInTheDocument();
		expect(screen.getByText("like")).toBeInTheDocument();
		expect(screen.getByText("dislike")).toBeInTheDocument();
	});

	it("should switch to the like-confirm step when like is clicked", () => {
		render(<FeedbackDialog open={true} onOpenChange={() => {}} />);

		fireEvent.click(screen.getByText("like"));

		expect(screen.getByText("Confirmar avaliação positiva?")).toBeInTheDocument();
		expect(screen.getByText("confirm")).toBeInTheDocument();
	});

	it("should send a good-rating feedback and run cleanup when confirming like with valid state", () => {
		const sendFeedback = vi.fn();
		mockUseSendFeedback.mockReturnValue({ mutateAsync: sendFeedback, isPending: false });
		playerStore.set({ gloss: "GLOSA CORRETA" });
		widgetStore.set({ text: "texto original" });

		const onOpenChange = vi.fn();
		render(<FeedbackDialog open={true} onOpenChange={onOpenChange} />);

		fireEvent.click(screen.getByText("like"));
		fireEvent.click(screen.getByText("confirm"));

		expect(sendFeedback).toHaveBeenCalledWith({
			text: "texto original",
			translation: "GLOSA CORRETA",
			review: "GLOSA CORRETA",
			rating: "good",
		});
		expect(onOpenChange).toHaveBeenCalledWith(false);
		expect(mockOnFeedbackSuccess).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Gostou da tradução?")).toBeInTheDocument();
	});

	it("should not send feedback when gloss or text is missing", () => {
		const sendFeedback = vi.fn();
		mockUseSendFeedback.mockReturnValue({ mutateAsync: sendFeedback, isPending: false });
		playerStore.set({ gloss: undefined });
		widgetStore.set({ text: undefined });

		const onOpenChange = vi.fn();
		render(<FeedbackDialog open={true} onOpenChange={onOpenChange} />);

		fireEvent.click(screen.getByText("like"));
		fireEvent.click(screen.getByText("confirm"));

		expect(sendFeedback).not.toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(mockOnFeedbackSuccess).not.toHaveBeenCalled();
		expect(screen.getByText("Confirmar avaliação positiva?")).toBeInTheDocument();
	});

	it("should close the main dialog and open the suggestion dialog when dislike is clicked", async () => {
		const onOpenChange = vi.fn();
		render(<FeedbackDialog open={true} onOpenChange={onOpenChange} />);

		fireEvent.click(screen.getByText("dislike"));

		expect(onOpenChange).toHaveBeenCalledWith(false);

		await waitFor(() => expect(screen.getByTestId("suggestion-dialog")).toBeInTheDocument());
	});

	it("should reset the like-confirm step when the dialog is reopened", () => {
		const onOpenChange = vi.fn();
		const { rerender } = render(<FeedbackDialog open={true} onOpenChange={onOpenChange} />);

		fireEvent.click(screen.getByText("like"));
		expect(screen.getByText("Confirmar avaliação positiva?")).toBeInTheDocument();

		rerender(<FeedbackDialog open={false} onOpenChange={onOpenChange} />);
		rerender(<FeedbackDialog open={true} onOpenChange={onOpenChange} />);

		expect(screen.getByText("Gostou da tradução?")).toBeInTheDocument();
	});

	it("should automatically open the suggestion dialog when the feedback-suggestion store's reopen flips true", async () => {
		const onOpenChange = vi.fn();
		render(<FeedbackDialog open={true} onOpenChange={onOpenChange} />);

		useFeedbackSuggestionStore.setState({ reopen: true });

		await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
		await waitFor(() => expect(screen.getByTestId("suggestion-dialog")).toBeInTheDocument());
	});
});
