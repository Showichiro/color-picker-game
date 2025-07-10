import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentPropsWithRef, FC, forwardRef } from "react";
import { expect, it, vi } from "vitest";

const Button: FC<ComponentPropsWithRef<"button">> = forwardRef((props, ref) => (
    <button ref={ref} {...props}>
        {props.children}
    </button>
));

it("Button, display children and function called", async () => {
    const user = userEvent.setup();
    const mockFunction = vi.fn();
    render(<Button onClick={mockFunction}>a</Button>);
    const target = screen.getByRole("button");
    expect(target).toHaveTextContent("a");
    await user.click(target);
    expect(mockFunction).toBeCalledTimes(1);
});
