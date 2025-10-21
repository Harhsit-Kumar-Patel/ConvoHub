import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../pages/Auth.jsx';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock socket
vi.mock('../lib/socket.js', () => ({
  getSocket: () => ({
    emit: vi.fn(),
  }),
}));

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderAuth = () => {
    return render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
  };

  describe('Login Form', () => {
    it('should render login form by default', () => {
      renderAuth();
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'student',
            workspaceType: 'educational'
          }
        }
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      renderAuth();

      // Fill in form
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'TestPass123' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/auth/login'),
          {
            email: 'test@example.com',
            password: 'TestPass123'
          }
        );
      });

      await waitFor(() => {
        expect(localStorage.getItem('convohub_token')).toBe('test-token');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should display error on failed login', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      });

      renderAuth();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Register Form', () => {
    it('should switch to register mode', () => {
      renderAuth();

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);

      expect(screen.getByText('Create an Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    });

    it('should handle successful registration', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: {
            id: '123',
            name: 'New User',
            email: 'new@example.com',
            role: 'student',
            workspaceType: 'educational'
          }
        }
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      renderAuth();

      // Switch to register
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      // Fill in form
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(nameInput, { target: { value: 'New User' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'TestPass123' } });

      // Submit
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/auth/register'),
          expect.objectContaining({
            name: 'New User',
            email: 'new@example.com',
            password: 'TestPass123',
            workspaceType: 'educational',
            role: 'student'
          })
        );
      });

      await waitFor(() => {
        expect(localStorage.getItem('convohub_token')).toBe('test-token');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should allow workspace type selection', () => {
      renderAuth();

      // Switch to register
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      const workButton = screen.getByRole('button', { name: /work/i });
      fireEvent.click(workButton);

      // Check if role dropdown changed
      const roleSelect = screen.getByRole('combobox');
      expect(roleSelect).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button while loading', async () => {
      axios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderAuth();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'TestPass123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Please wait...')).toBeInTheDocument();
      });
    });
  });
});
