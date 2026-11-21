import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center mx-auto shadow-xs">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            We Couldn't Find That Page
          </h1>
          <p className="text-sm text-[#64748B] leading-relaxed">
            The healthcare navigation path or coordinate resource you requested does not exist or has been relocated in the platform hierarchy.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/find-donors">
            <Button variant="secondary" size="md" icon={Search}>
              Find Donors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
