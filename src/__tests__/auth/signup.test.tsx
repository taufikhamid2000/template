import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignUpForm from "@/app/auth/signup/components/signup-form";
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
      signUp: jest.fn(),
    },
  },
}));

describe("SignUp Form", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
  });

  test("renders sign up form with all fields", () => {
    render(<SignUpForm />);

    // Check form elements exist
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign up/i })
    ).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    render(<SignUpForm />);

    const user = userEvent.setup();

    // Submit without filling form
    await user.click(screen.getByRole("button", { name: /Sign up/i }));

    // Check error messages
    await waitFor(() => {
      expect(
        screen.getByText(/first name must be at least 2 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/last name must be at least 2 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });
  test("submits the form with valid data", async () => {
    // Mock the successful sign up response
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<SignUpForm />);

    const user = userEvent.setup();

    // Fill the form with valid data
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Sign up/i }));

    // Verify supabase.auth.signUp was called with the right data
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        password: "password123",
        options: {
          data: {
            first_name: "John",
            last_name: "Doe",
            role: "user",
          },
        },
      });
    }); // Verify we're redirected to dashboard (not verification)
    await waitFor(() => {
      // Test for window.location.href instead of pushMock since we're using direct navigation
      expect(window.location.href).toBe("/dashboard");
    });
  });
  test("displays an error message when signup fails", async () => {
    // Mock a failed sign up response
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      error: { message: "This email is already registered" },
    });

    render(<SignUpForm />);

    const user = userEvent.setup();

    // Fill the form with valid data
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Sign up/i }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("This email is already registered")
      ).toBeInTheDocument();
    });
  });
});
