import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Rinjani Transport",
  description: "Get in touch with Rinjani Transport for booking assistance, partnership inquiries, or 24/7 support.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[280px] overflow-hidden md:h-[320px]">
        <Image src="/landing1.png" alt="Contact Us" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1184px]">
            <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">Contact</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/75">
              Need help with your booking or have questions? Our team is ready to assist you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left: Contact Info */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                <div className="mt-5 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                      <a href="mailto:info@rinjanitransport.com" className="text-sm text-gray-500 hover:text-primary">
                        info@rinjanitransport.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">WhatsApp</h3>
                      <a href="https://wa.me/6281234567890" className="text-sm text-gray-500 hover:text-green-600">
                        +62 812 3456 7890
                      </a>
                      <p className="text-xs text-gray-400">Fastest response</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                      <p className="text-sm text-gray-500">+62 812 3456 7890</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Office</h3>
                      <p className="text-sm text-gray-500">Jl. Raya Senggigi No.88<br />Lombok, NTB 83355, Indonesia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Working Hours</h3>
                      <p className="text-sm text-gray-500">24/7 Customer Support</p>
                      <p className="text-xs text-gray-400">Office: Mon-Sat 08:00 - 18:00 WITA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-gray-100 bg-primary/5 p-5">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                <div className="mt-3 space-y-2">
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-gray-700 shadow-sm transition-all hover:shadow-md">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Chat via WhatsApp</span>
                  </a>
                  <Link href="/booking/search"
                    className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-gray-700 shadow-sm transition-all hover:shadow-md">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium">Book a Transfer</span>
                  </Link>
                </div>
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63209.87!2d116.0472!3d-8.4933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdb0a4be5e2ad1%3A0xdb6e7b9586a7e5e5!2sSenggigi%2C%20Lombok!5e0!3m2!1sen!2sid!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rinjani Transport Location"
                />
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
