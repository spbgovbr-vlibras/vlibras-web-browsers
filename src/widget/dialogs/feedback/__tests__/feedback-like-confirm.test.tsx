import { fireEvent, render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FeedbackLikeConfirm } from "../feedback-like-confirm";

describe("FeedbackLikeConfirm", () => {
	it("should show the confirm label and like icon when not pending", () => {
		render(<FeedbackLikeConfirm isPending={false} isMobile={false} onConfirm={() => {}} onCancel={() => {}} />);

		expect(screen.getByText("Confirmar")).toBeInTheDocument();
		expect(screen.getByText("Voltar")).toBeInTheDocument();
	});

	it("should show the sending label and spinner when pending", () => {
		render(<FeedbackLikeConfirm isPending={true} isMobile={false} onConfirm={() => {}} onCancel={() => {}} />);

		expect(screen.getByText("Enviando")).toBeInTheDocument();
		expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
	});

	it("should call onConfirm when the confirm button is clicked", () => {
		const onConfirm = vi.fn();
		render(<FeedbackLikeConfirm isPending={false} isMobile={false} onConfirm={onConfirm} onCancel={() => {}} />);

		fireEvent.click(screen.getByText("Confirmar"));

		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it("should call onCancel when the back button is clicked", () => {
		const onCancel = vi.fn();
		render(<FeedbackLikeConfirm isPending={false} isMobile={false} onConfirm={() => {}} onCancel={onCancel} />);

		fireEvent.click(screen.getByText("Voltar"));

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it("should disable both buttons and not fire callbacks while pending", async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		render(<FeedbackLikeConfirm isPending={true} isMobile={false} onConfirm={onConfirm} onCancel={onCancel} />);

		const confirmButton = screen.getByText("Enviando").closest("button");
		const cancelButton = screen.getByText("Voltar").closest("button");

		expect(confirmButton).toBeDisabled();
		expect(cancelButton).toBeDisabled();

		if (confirmButton) await user.click(confirmButton);
		if (cancelButton) await user.click(cancelButton);

		expect(onConfirm).not.toHaveBeenCalled();
		expect(onCancel).not.toHaveBeenCalled();
	});
});
