import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Button3D from "../components/ui/Button3D";
import toast from "react-hot-toast";

export default function Booking() {
  const [bookingComplete, setBookingComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "consultation",
    date: "",
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
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Booking submitted:", formData);
      toast.success("Booking request submitted successfully!");
      setBookingComplete(true);
    } catch (error) {
      toast.error("Failed to submit booking");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <CalendarDaysIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Book Your <span className="text-gradient">Session</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Ready to bring your musical vision to life? Book a session at Lobodo
            Records and experience professional production.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {bookingComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-3xl p-8 md:p-12 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-4">
              Booking Submitted!
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Thank you for booking a session at Lobodo Records. We've received
              your request and will contact you within 24 hours to confirm your
              booking.
            </p>
            <div className="space-y-4">
              <div className="text-left glass-effect rounded-xl p-6">
                <h4 className="font-semibold mb-3">Booking Details:</h4>
                <div className="space-y-2 text-text-secondary">
                  <p>
                    <span className="font-medium text-text-primary">Name:</span>{" "}
                    {formData.name}
                  </p>
                  <p>
                    <span className="font-medium text-text-primary">
                      Phone:
                    </span>{" "}
                    {formData.phone}
                  </p>
                  <p>
                    <span className="font-medium text-text-primary">
                      Service:
                    </span>{" "}
                    {formData.service === "consultation"
                      ? "Consultation"
                      : "Recording"}
                  </p>
                  <p>
                    <span className="font-medium text-text-primary">Date:</span>{" "}
                    {new Date(formData.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-left glass-effect rounded-xl p-6">
                <h4 className="font-semibold mb-3">What's Next?</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center">
                    <ArrowRightIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    We'll call you to confirm your booking
                  </li>
                  <li className="flex items-center">
                    <ArrowRightIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    Discuss your project requirements
                  </li>
                  <li className="flex items-center">
                    <ArrowRightIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    Finalize the session details
                  </li>
                </ul>
              </div>

              <Button3D
                variant="primary"
                onClick={() => {
                  setBookingComplete(false);
                  setFormData({
                    name: "",
                    phone: "",
                    service: "consultation",
                    date: "",
                  });
                }}
              >
                Book Another Session
              </Button3D>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-3xl p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold mb-2">
                Book Your Session
              </h2>
              <p className="text-text-secondary">
                Fill in your details to reserve your studio time
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <UserIcon className="h-5 w-5 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-3d w-full"
                  placeholder="Enter your full name"
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

              {/* Service */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Service Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="service"
                      value="consultation"
                      checked={formData.service === "consultation"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`
                      glass-effect rounded-xl p-4 text-center transition-all
                      ${
                        formData.service === "consultation"
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background-dark bg-primary/10"
                          : "hover:bg-white/5"
                      }
                    `}
                    >
                      <h3 className="font-semibold mb-1">Consultation</h3>
                      <p className="text-sm text-text-secondary">
                        Discuss your project
                      </p>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="service"
                      value="recording"
                      checked={formData.service === "recording"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`
                      glass-effect rounded-xl p-4 text-center transition-all
                      ${
                        formData.service === "recording"
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background-dark bg-primary/10"
                          : "hover:bg-white/5"
                      }
                    `}
                    >
                      <h3 className="font-semibold mb-1">Recording</h3>
                      <p className="text-sm text-text-secondary">
                        Studio session
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className="input-3d w-full"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-primary/10 to-accent-pink/10">
                <h4 className="font-semibold mb-3">Important Information:</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      We'll call you to confirm availability and discuss details
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>No payment required at this stage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Consultations are free of charge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      Recording fees will be discussed during consultation
                    </span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <Button3D
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto px-12"
                >
                  Submit Booking Request
                </Button3D>
                <p className="text-sm text-text-secondary mt-4">
                  We'll contact you within 24 hours
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
