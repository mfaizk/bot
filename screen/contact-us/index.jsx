"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MessageSquare, RefreshCw, User } from "lucide-react";
import { contactUsMutation } from "@/queries/miss";
import { useMutation } from "@tanstack/react-query";
import Dropdown from "@/components/dropdown";
import { toast } from "sonner";
import CountryDropdown from "@/components/country-dropdown";
const countryOptions = [
  { value: "+1", label: "United States (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+1", label: "Canada (+1)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+91", label: "India (+91)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+33", label: "France (+33)" },
  { value: "+39", label: "Italy (+39)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+86", label: "China (+86)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+82", label: "South Korea (+82)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+7", label: "Russia (+7)" },
  { value: "+31", label: "Netherlands (+31)" },
  { value: "+52", label: "Mexico (+52)" },
];

export default function ContactFormInline() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    captchaAnswer: "",
    terms: false,
    country: "",
  });

  const [errors, setErrors] = useState({});

  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  useEffect(() => generateCaptcha(), []);

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setCaptcha({ a, b });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?[0-9]{7,15}$/;

  function validate() {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required.";
    if (!formData.phone.trim()) e.phone = "Phone no. is required.";
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!emailPattern.test(formData.email))
      e.email = "Enter a valid email address.";
    if (formData.phone && !phonePattern.test(formData.phone))
      e.phone = "Enter a valid phone number (digits only, optional +).";
    // Message word-count validation: min 10 words, max 200 words
    const messageTrimmed = formData.message.trim();
    if (!messageTrimmed) {
      e.message = "Message cannot be empty.";
    } else {
      // split on one or more whitespace characters, ignore empty entries
      const wordCount = messageTrimmed.split(/\s+/).filter(Boolean).length;
      if (wordCount < 10) {
        e.message = "Message must be at least 10 words.";
      } else if (wordCount > 200) {
        e.message = "Message cannot exceed 200 words.";
      }
    }
    const expected = captcha.a + captcha.b;
    const given = Number(formData.captchaAnswer);
    if (!formData.captchaAnswer && formData.captchaAnswer !== 0) {
      e.captchaAnswer = "Captcha answer is required.";
    } else if (Number.isNaN(given) || given !== expected) {
      e.captchaAnswer = "Captcha answer is incorrect.";
    }
    if (!formData.terms) e.terms = "You must accept Terms & Privacy Policy.";
    if (!formData.country) e.country = "Please select a country.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await contactUsMutate(formData);
    } catch (err) {}
  }

  const { mutateAsync: contactUsMutate, isPending: mutatePending } =
    useMutation({
      mutationFn: async (values) => {
        return contactUsMutation({
          name: values?.name,
          countryCode: values?.country,
          email: values?.email,
          mobileNumber: values?.phone,
          message: values?.message,
        });
      },
      onSuccess: (data) => {
        console.log(data, "datadatadatadatadata");
        if (data?.data?.responseCode == 200) {
          toast.success(
            "Thanks for contacting us! We’ll get back to you within 1–2 business days."
          );
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            captchaAnswer: "",
            terms: false,
            country: "",
          });
          generateCaptcha();
        } else {
        }
      },
      onError: (err) => {
        console.log(err, "err>>>");
      },
    });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  return (
    <div className="text-white px-6 md:px-30 lg:px-60 xl:px-90 sm:px-20 pt-20 sm:pt-30 pb-10 md:pb-20">
      <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
      <p className="text-sm text-slate-400 mb-6">
        Have questions? Fill out the form and our team will respond within 1-2
        business days.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="text-red-500 text-sm mb-4">{errors.form}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 pl-10 bg-[#1A1A24] rounded focus:outline-none ${
                errors.name ? "border border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 pl-10 bg-[#1A1A24] rounded focus:outline-none ${
                errors.email ? "border border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <CountryDropdown
              label="Country"
              options={countryOptions}
              value={formData.country}
              onSelect={(val) => {
                setFormData((s) => ({ ...s, country: val }));
                setErrors((prev) => ({ ...prev, country: undefined }));
              }}
              className="w-full"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="phone"
              placeholder="Enter phone no."
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 pl-10 bg-[#1A1A24] rounded focus:outline-none ${
                errors.phone ? "border border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="relative md:col-span-2">
            <MessageSquare
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
            <textarea
              name="message"
              placeholder="Enter message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full p-3 pl-10 bg-[#1A1A24] rounded focus:outline-none ${
                errors.message ? "border border-red-500" : ""
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <label className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  {captcha.a} + {captcha.b}
                </span>
                <input
                  name="captchaAnswer"
                  value={formData.captchaAnswer}
                  onChange={handleChange}
                  placeholder="Enter captcha answer"
                  className={`w-full p-3 pl-16 bg-[#1A1A24] rounded focus:outline-none ${
                    errors.captchaAnswer ? "border border-red-500" : ""
                  }`}
                />
              </div>
              {errors.captchaAnswer && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.captchaAnswer}
                </p>
              )}
            </label>

            <button
              type="button"
              onClick={generateCaptcha}
              className="rounded p-2 bg-slate-800 hover:bg-slate-700"
              aria-label="Regenerate captcha"
            >
              <RefreshCw size={18} className="text-gray-300" />
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-start text-sm cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2 mt-1"
              />
              I accept the{" "}
              <Link
                href="/terms-conditions"
                className="text-primary ml-1 hover:underline"
              >
                Terms &amp; Conditions{"  "}
              </Link>{" "}
              <p className="text-white ml-1"> &</p>
              <Link
                href="/privacy-policy"
                className="text-primary ml-1 hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary font-semibold text-white py-3 rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-60"
              disabled={mutatePending}
            >
              {mutatePending ? `Sending...` : `SEND MESSAGE`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
