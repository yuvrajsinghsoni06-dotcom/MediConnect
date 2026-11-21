import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '../pages/public/ContactPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { EmergencyRequestModal } from '../components/common/EmergencyRequestModal';

describe('MediConnect Forms & Validation', () => {
  it('validates required fields on Contact form', async () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Send Message \(Frontend Demo\)/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Full name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates and submits Contact form with valid data', async () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example\.com/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Hospital Blood Bank Registration Query/i), {
      target: { value: 'Blood Bank Onboarding' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Explain your inquiry/i), {
      target: { value: 'We would like to coordinate emergency blood reserves for our facility.' },
    });

    const submitBtn = screen.getByRole('button', { name: /Send Message \(Frontend Demo\)/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Demonstration Message Received!/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility on Login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/Show password/i);
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/Hide password/i)).toBeInTheDocument();
  });

  it('validates password mismatch on Registration page', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Dr\. Ananya Sharma/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@domain\.com/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/10-digit contact number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByPlaceholderText(/At least 8 chars/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Repeat password/i), {
      target: { value: 'DifferentPassword123' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    const submitBtn = screen.getByRole('button', { name: /Create Platform Account \(Demo\)/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('submits Emergency Request modal and displays demo reference code', async () => {
    const handleClose = () => {};
    render(
      <EmergencyRequestModal isOpen={true} onClose={handleClose} />
    );

    expect(screen.getByText(/Create Emergency Blood Request/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Apollo Hospital/i), {
      target: { value: 'Metro Hospital' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Patient Name/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByPlaceholderText(/10-digit mobile number/i), {
      target: { value: '9876543210' },
    });

    const submitBtn = screen.getByRole('button', { name: /Broadcast Emergency Blood Request \(Demo\)/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Demo Emergency Broadcast Logged/i)).toBeInTheDocument();
      expect(screen.getByText(/Case Reference:/i)).toBeInTheDocument();
    });
  });
});
