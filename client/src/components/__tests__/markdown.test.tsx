import "../../test/setup";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Markdown } from "../markdown";

vi.mock("yet-another-react-lightbox", () => ({
  default: () => null,
}));

vi.mock("yet-another-react-lightbox/plugins/counter", () => ({
  default: {},
}));

vi.mock("yet-another-react-lightbox/plugins/download", () => ({
  default: {},
}));

vi.mock("yet-another-react-lightbox/plugins/zoom", () => ({
  default: {},
}));

afterEach(() => {
  cleanup();
});

describe("Markdown", () => {
  it("renders fenced code blocks with syntax highlighting", () => {
    render(<Markdown content={"```ts\nconst answer = 42;\n```"} />);

    const codeBlock = screen.getByText("const").closest("code");

    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveTextContent("const answer = 42;");
    expect(codeBlock!.querySelectorAll(".token").length).toBeGreaterThan(0);
  });

  it("renders tilde fenced code blocks with syntax highlighting", () => {
    render(<Markdown content={"~~~ts\nconst answer = 42;\n~~~"} />);

    const codeBlock = screen.getByText("const").closest("code");

    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveTextContent("const answer = 42;");
    expect(codeBlock!.querySelectorAll(".token").length).toBeGreaterThan(0);
  });

  it("renders hyphenated language names with syntax highlighting", () => {
    render(<Markdown content={'```shell-session\n$ echo "Hello Rin"\n```'} />);

    const codeBlock = screen.getByText("echo").closest("code");

    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveTextContent('$ echo "Hello Rin"');
    expect(codeBlock!.querySelectorAll(".token").length).toBeGreaterThan(0);
  });

  it("keeps raw HTML code with language class inline", () => {
    render(<Markdown content={'Here is <code class="language-js">const x = 1</code> inline'} />);

    const code = screen.getByText("const x = 1");

    expect(code.tagName).toBe("CODE");
    expect(code.closest("p")).toBeInTheDocument();
    expect(code.closest(".relative.group")).not.toBeInTheDocument();
  });
});
