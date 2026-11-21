import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { mockFaqs } from '../../data/faqsData';
import { DEMO_CONTACT_INFO } from '../../utils/constants';

// Zod Validation Schema
const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  subject: z.string().min(4, { message: 'Subject must be at least 4 characters long.' }),
  message: z.string().min(15, { message: 'Message must be at least 15 characters long.' }),
});

export const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    // Frontend demo simulation
    await new Promise((res) => setTimeout(res, 600));
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    reset();
    setIsSubmitted(false);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <div className="w-full py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-xs font-bold text-[#DC2626] border border-red-200">
            Coordination Support Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Get in Touch With MediConnect
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Have questions about volunteer donor registration, hospital onboarding, or technical capstone documentation? Reach out to our demonstration desk.
          </p>
        </div>

        {/* Contact Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Demo Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 border border-[#E2E8F0] space-y-6 bg-white">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  Demonstration Contact Channels
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Illustrative academic support channels for Stage 1.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-[#DC2626] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">General Helpline (Demo)</span>
                    <span className="font-bold text-[#0F172A]">{DEMO_CONTACT_INFO.helpline}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Mon–Sat: 09:00 AM – 06:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-[#DC2626] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Academic Support Email</span>
                    <span className="font-bold text-[#0F172A]">{DEMO_CONTACT_INFO.email}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Project coordination inbox</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Project Lab Location</span>
                    <span className="font-semibold text-[#0F172A] text-xs leading-snug">{DEMO_CONTACT_INFO.address}</span>
                  </div>
                </div>
              </div>

              {/* Simulation Note */}
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs text-red-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                  <span>Demonstration Environment</span>
                </div>
                <p className="leading-relaxed">
                  Submissions through this contact form provide live frontend validation and state confirmation. No real external email dispatch is executed.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 border border-[#E2E8F0] shadow-soft bg-white">
              {isSubmitted ? (
                <div className="py-12 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">
                    Demonstration Message Received!
                  </h3>
                  <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. In the full production release, this submission routes to the database support queue and sends an automated acknowledgment.
                  </p>
                  <div className="pt-4">
                    <Button variant="secondary" size="md" onClick={handleResetForm}>
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A]">Send a Message</h2>
                    <p className="text-xs text-[#64748B] mt-1">
                      Fill out the form below for platform feedback, technical inquiries, or institutional onboarding.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Full Name"
                      placeholder="e.g. Rahul Sharma"
                      required
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      required
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="e.g. Hospital Blood Bank Registration Query"
                    required
                    error={errors.subject?.message}
                    {...register('subject')}
                  />

                  <FormField
                    label="Your Message"
                    required
                    error={errors.message?.message}
                  >
                    <textarea
                      rows={5}
                      placeholder="Explain your inquiry, suggestion, or question in detail..."
                      className={`block w-full rounded-lg border text-sm text-[#0F172A] p-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 ${
                        errors.message
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-[#E2E8F0] focus:border-[#DC2626] bg-white'
                      }`}
                      {...register('message')}
                    />
                  </FormField>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      isLoading={isSubmitting}
                      icon={Send}
                    >
                      Send Message (Frontend Demo)
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <SectionHeading
            eyebrow="Help & Knowledge Base"
            title="Frequently Asked Questions"
            description="Clear answers covering volunteer eligibility, privacy protection, emergency protocols, and institutional roles."
          />

          <div className="max-w-4xl mx-auto space-y-3">
            {mockFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
                        {faq.category}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#0F172A]">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#64748B] leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
