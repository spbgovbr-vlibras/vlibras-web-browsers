import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { DictionaryError } from "../dictionary-error";

describe("DictionaryError", () => {
	it("should render the error message", () => {
		render(<DictionaryError onRetry={() => {}} isMaxRetries={false} />);

		expect(screen.getByText("Não foi possível carregar o dicionário de sinais.")).toBeInTheDocument();
	});

	it("should render retry button when not max retries", () => {
		const onRetry = vi.fn();
		render(<DictionaryError onRetry={onRetry} isMaxRetries={false} />);

		expect(screen.getByRole("button", { name: /Tentar novamente/i })).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /Tentar novamente/i }));
		expect(onRetry).toHaveBeenCalledOnce();
	});

	it("should not render retry button when max retries", () => {
		render(<DictionaryError onRetry={() => {}} isMaxRetries={true} />);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
		expect(screen.getByText("Tente novamente mais tarde.")).toBeInTheDocument();
	});
});
