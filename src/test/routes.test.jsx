import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../routes/AppRoutes';

describe('MediConnect Routing & Navigation', () => {
  it('renders Home page at "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Every Second Counts/i)).toBeInTheDocument();
    expect(screen.getByText(/Intelligent Healthcare Blood Network/i)).toBeInTheDocument();
  });

  it('renders About page at "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/About MediConnect/i)).toBeInTheDocument();
    expect(screen.getByText(/Bridging the Critical Gap/i)).toBeInTheDocument();
  });

  it('renders Find Donors page at "/find-donors"', () => {
    render(
      <MemoryRouter initialEntries={['/find-donors']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Find Volunteer Blood Donors/i)).toBeInTheDocument();
    expect(screen.getByText(/Donor Discovery Filters/i)).toBeInTheDocument();
  });

  it('renders Campaigns page at "/campaigns"', () => {
    render(
      <MemoryRouter initialEntries={['/campaigns']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Voluntary Blood Donation Campaigns/i)).toBeInTheDocument();
  });

  it('renders Contact page at "/contact"', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Get in Touch With MediConnect/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('renders Login page at "/login"', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign In to Your Account/i)).toBeInTheDocument();
  });

  it('renders Register page at "/register"', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Create Platform Account/i })).toBeInTheDocument();
    expect(screen.getByText(/Select Account Role/i)).toBeInTheDocument();
  });

  it('renders 404 NotFound page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-page-url']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error 404 • Page Not Found/i)).toBeInTheDocument();
  });

  it('toggles mobile navigation drawer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle navigation menu/i);
    expect(toggleButton).toBeInTheDocument();

    // Click to open mobile navigation
    fireEvent.click(toggleButton);
    expect(screen.getAllByText(/Emergency Blood Request/i).length).toBeGreaterThanOrEqual(1);

    // Click again to close
    fireEvent.click(toggleButton);
  });
});
