import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignInForm from "@/app/auth/signin/components/signin-form";
import { supabase } from "@/lib/supabase/client";

// Mock the next/navigation hooks
const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

// Mock the supabase client
jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe("SignIn Form", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
  });

  test("renders sign in form with all fields", () => {
    render(<SignInForm />);

    // Check form elements exist
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    render(<SignInForm />);

    const user = userEvent.setup();

    // Submit without filling form
    await user.click(screen.getByRole("button", { name: /Sign in/i }));

    // Check error messages
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });
  test("submits the form with valid data and redirects on success", async () => {
    // Mock the successful sign in response
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    render(<SignInForm />);

    const user = userEvent.setup();

    // Fill the form with valid data
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Sign in/i }));

    // Verify supabase.auth.signInWithPassword was called with the right data
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        password: "password123",
      });
    }); // Verify we're redirected to dashboard page
    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
  test("displays an error message when signin fails", async () => {
    // Mock a failed sign in response
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      error: { message: "Invalid login credentials" },
    });

    render(<SignInForm />);

    const user = userEvent.setup();

    // Fill the form with valid data
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Sign in/i }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Invalid login credentials")).toBeInTheDocument();
    });
  });
});
