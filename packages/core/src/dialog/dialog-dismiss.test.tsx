import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import * as Dialog from "./index.tsx";

function Example() {
	return (
		<Dialog.Root>
			<Dialog.Trigger>Open</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay data-testid="overlay" />
				<Dialog.Content>
					<Dialog.Title>Title</Dialog.Title>
					<button type="button">Inside</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

describe("Dialog dismissal", () => {
	it("registers its layer, so Escape closes it", async () => {
		const user = userEvent.setup();
		render(() => <Example />);
		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByRole("dialog");
		await user.keyboard("{Escape}");
		await expect.poll(() => screen.queryByRole("dialog")).toBeNull();
	});

	it("closes on a pointer down outside but not inside", async () => {
		const user = userEvent.setup();
		render(() => <Example />);
		await user.click(screen.getByRole("button", { name: "Open" }));
		await user.click(await screen.findByRole("button", { name: "Inside" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		await user.click(screen.getByTestId("overlay"));
		await expect.poll(() => screen.queryByRole("dialog")).toBeNull();
	});
});
