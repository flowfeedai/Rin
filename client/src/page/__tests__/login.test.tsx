import "../../test/setup";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfigWrapper } from "../../state/config";
import { ClientConfigContext, defaultClientConfig } from "../../state/config";
import { LoginPage } from "../login";

const { authStatusMock } = vi.hoisted(() => ({
  authStatusMock: vi.fn(),
}));

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/login", vi.fn()],
}));

vi.mock("../../app/runtime", () => ({
  client: {
    auth: {
      status: authStatusMock,
      login: vi.fn(),
    },
  },
  oauth_url: "https://github.com/login/oauth/authorize",
}));

vi.mock("../../utils/auth", () => ({
  setAuthToken: vi.fn(),
}));

vi.mock("../../utils/auth-redirect", () => ({
  getLoginRedirectPath: vi.fn(() => "/"),
}));

afterEach(() => {
  cleanup();
  authStatusMock.mockReset();
});

function renderLoginPage(registrationEnabled: boolean) {
  const config = new ConfigWrapper({ "registration.enabled": registrationEnabled }, defaultClientConfig);

  return render(
    <ClientConfigContext.Provider value={config}>
      <LoginPage />
    </ClientConfigContext.Provider>,
  );
}

describe("LoginPage", () => {
  it("shows GitHub login when registration is enabled", async () => {
    authStatusMock.mockResolvedValue({ data: { github: true, password: true } });

    renderLoginPage(true);

    expect(await screen.findByRole("button", { name: "github_login" })).toBeInTheDocument();
    expect(screen.getByText("login.or")).toBeInTheDocument();
  });

  it("hides GitHub login and separator when registration is disabled", async () => {
    authStatusMock.mockResolvedValue({ data: { github: true, password: true } });

    renderLoginPage(false);

    await waitFor(() => expect(authStatusMock).toHaveBeenCalled());
    expect(screen.queryByRole("button", { name: "github_login" })).not.toBeInTheDocument();
    expect(screen.queryByText("login.or")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("login.username.placeholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("login.password.placeholder")).toBeInTheDocument();
  });
});
