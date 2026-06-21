import "../../../../test/setup";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfigWrapper } from "../../../../state/config";
import { ClientConfigContext, defaultClientConfig } from "../../../../state/config";
import { NavBar } from "../nav-bar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("wouter", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ["/", vi.fn()],
}));

afterEach(() => {
  cleanup();
});

function renderNavBar(friendApplyEnabled: boolean) {
  const config = new ConfigWrapper({ friend_apply_enable: friendApplyEnabled }, defaultClientConfig);

  return render(
    <ClientConfigContext.Provider value={config}>
      <NavBar menu={true} />
    </ClientConfigContext.Provider>,
  );
}

describe("NavBar", () => {
  it("shows the friends link when friend applications are enabled", () => {
    renderNavBar(true);

    expect(screen.getByRole("link", { name: "friends.title" })).toBeInTheDocument();
  });

  it("hides the friends link when friend applications are disabled", () => {
    renderNavBar(false);

    expect(screen.queryByRole("link", { name: "friends.title" })).not.toBeInTheDocument();
  });
});
