import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Button3D from "../components/ui/Button3D";
import toast from "react-hot-toast";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.message.length < 10) {
      toast.error("Please provide a more detailed message");
      return;
    }

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Contact form submitted:", formData);
      toast.success("Message sent successfully!");
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Have questions or want to work with us? We'd love to hear from you.
          </p>
        </motion.div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Contact Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-3xl p-6 sticky top-24"
            >
              <h2 className="font-heading text-2xl font-bold mb-6">
                Contact Info
              </h2>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center mr-3 flex-shrink-0">
                      <MapPinIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Location</h3>
                  </div>
                  <p className="text-text-secondary pl-13">
                    Step Ahead Complex
                    <br />
                    Kawale, Lilongwe
                    <br />
                    Malawi
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-accent-pink to-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <PhoneIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Phone</h3>
                  </div>
                  <p className="text-text-secondary pl-13">
                    <a
                      href="tel:+265999123456"
                      className="hover:text-primary transition-colors"
                    >
                      +265 999 123 456
                    </a>
                  </p>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary to-cyan-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <EnvelopeIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Email</h3>
                  </div>
                  <p className="text-text-secondary pl-13 break-all">
                    <a
                      href="mailto:info@lobodorecords.com"
                      className="hover:text-primary transition-colors"
                    >
                      info@lobodorecords.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-effect rounded-3xl p-8 md:p-12 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold mb-4">
                  Message Sent!
                </h2>
                <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                  Thank you for reaching out. We'll get back to you as soon as
                  possible.
                </p>
                <div className="glass-effect rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                  <h4 className="font-semibold mb-3">Your Message:</h4>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>
                      <span className="font-medium text-text-primary">
                        Name:
                      </span>{" "}
                      {formData.name}
                    </p>
                    <p>
                      <span className="font-medium text-text-primary">
                        Phone:
                      </span>{" "}
                      {formData.phone}
                    </p>
                    <p className="pt-2 border-t border-white/10">
                      <span className="font-medium text-text-primary block mb-1">
                        Message:
                      </span>
                      {formData.message}
                    </p>
                  </div>
                </div>
                <Button3D
                  variant="primary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", phone: "", message: "" });
                  }}
                >
                  Send Another Message
                </Button3D>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center mb-8">
                  <PaperAirplaneIcon className="h-8 w-8 text-primary mr-3" />
                  <h2 className="font-heading text-3xl font-bold">
                    Send Us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <UserIcon className="h-5 w-5 inline mr-2" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-3d w-full"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <PhoneIcon className="h-5 w-5 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-3d w-full"
                      placeholder="+265 999 123 456"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={8}
                      className="input-3d w-full"
                      placeholder="Tell us what you need help with..."
                      required
                    />
                  </div>

                  {/* Info Box */}
                  <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-primary/10 to-accent-pink/10">
                    <p className="text-sm text-text-secondary">
                      We'll respond to your message as soon as possible. For
                      urgent matters, please call us directly at{" "}
                      <a
                        href="tel:+265999123456"
                        className="text-primary hover:underline font-medium"
                      >
                        +265 999 123 456
                      </a>
                      .
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-4">
                    <Button3D
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full md:w-auto px-12"
                    >
                      <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      Send Message
                    </Button3D>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
