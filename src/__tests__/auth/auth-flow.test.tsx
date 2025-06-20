import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock the supabase client
jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  redirect: jest.fn(),
}));

// Import components after mocks
import SignUpForm from "@/app/auth/signup/components/signup-form";
import SignInForm from "@/app/auth/signin/components/signin-form";
import { supabase } from "@/lib/supabase/client";

describe("Authentication Flow", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("User can register and then login with new account", async () => {
    // Step 1: Set up the test user data
    const testUser = {
      firstName: "Test",
      lastName: "User",
      email: "test.user@example.com",
      password: "password123",
    };

    // Step 2: Mock successful signup
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error: null });

    // Step 3: Render signup form and fill it out
    const { unmount } = render(<SignUpForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/First Name/i), testUser.firstName);
    await user.type(screen.getByLabelText(/Last Name/i), testUser.lastName);
    await user.type(screen.getByLabelText(/Email/i), testUser.email);
    await user.type(screen.getByLabelText(/Password/i), testUser.password);
    await user.click(screen.getByRole("button", { name: /Sign up/i }));

    // Verify signup was called with correct data
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            first_name: testUser.firstName,
            last_name: testUser.lastName,
            role: "user",
          },
        },
      });
    });

    // Step 4: Clean up signup component
    unmount();

    // Step 5: Mock successful login
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    // Step 6: Render login form and fill it out
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/Email/i), testUser.email);
    await user.type(screen.getByLabelText(/Password/i), testUser.password);
    await user.click(screen.getByRole("button", { name: /Sign in/i }));

    // Verify login was called with correct data
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: testUser.email,
        password: testUser.password,
      });
    });
  });
});
