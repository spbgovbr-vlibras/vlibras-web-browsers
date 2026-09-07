import { fireEvent, render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FeedbackQuestion } from "../feedback-question";

describe("FeedbackQuestion", () => {
	it("should render the like and dislike options", () => {
		render(<FeedbackQuestion isPending={false} onLike={() => {}} onDislike={() => {}} />);

		expect(screen.getByText("Sim")).toBeInTheDocument();
		expect(screen.getByText("Não")).toBeInTheDocument();
	});

	it("should call onLike when the like button is clicked", () => {
		const onLike = vi.fn();
		render(<FeedbackQuestion isPending={false} onLike={onLike} onDislike={() => {}} />);

		fireEvent.click(screen.getByText("Sim"));

		expect(onLike).toHaveBeenCalledTimes(1);
	});

	it("should call onDislike when the dislike button is clicked", () => {
		const onDislike = vi.fn();
		render(<FeedbackQuestion isPending={false} onLike={() => {}} onDislike={onDislike} />);

		fireEvent.click(screen.getByText("Não"));

		expect(onDislike).toHaveBeenCalledTimes(1);
	});

	it("should disable both buttons and not fire callbacks while pending", async () => {
		const user = userEvent.setup();
		const onLike = vi.fn();
		const onDislike = vi.fn();
		render(<FeedbackQuestion isPending={true} onLike={onLike} onDislike={onDislike} />);

		const likeButton = screen.getByText("Sim").closest("button");
		const dislikeButton = screen.getByText("Não").closest("button");

		expect(likeButton).toBeDisabled();
		expect(dislikeButton).toBeDisabled();

		if (likeButton) await user.click(likeButton);
		if (dislikeButton) await user.click(dislikeButton);

		expect(onLike).not.toHaveBeenCalled();
		expect(onDislike).not.toHaveBeenCalled();
	});
});
