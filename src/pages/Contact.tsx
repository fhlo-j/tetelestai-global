import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { toast } from '@/components/ui/sonner' // Assuming this is your toast notification library

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        // IMPORTANT: Adjust URL if your backend is elsewhere
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(
          data.message || 'Thank you! Your message has been sent successfully.'
        )
        setFormData({
          // Clear form on success
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header with Background Image */}
      <div className="pt-24 pb-12 relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/33999/pexels-photo.jpg"
            alt="Contact header background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-white mb-4">Contact Us</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us with any questions or
            prayer requests.
          </p>
        </div>
      </div>

      {/* Contact Info & Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-divine mb-6">Get in Touch</h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-divine-light rounded-full p-4 h-fit">
                    <Phone
                      className="text-divine"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone</h3>
                    <p className="text-gray-700 mb-1">
                      Main Office: +1 (234) 567-890
                    </p>
                    <p className="text-gray-700">
                      Prayer Line: +1 (234) 567-891
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-divine-light rounded-full p-4 h-fit">
                    <Mail
                      className="text-divine"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p className="text-gray-700 mb-1">
                      General: info@tetelestaiglobal.org
                    </p>
                    <p className="text-gray-700">
                      Prayer Requests: prayer@tetelestaiglobal.org
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-divine-light rounded-full p-4 h-fit">
                    <MapPin
                      className="text-divine"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Location</h3>
                    <p className="text-gray-700 mb-1">123 Faith Street</p>
                    <p className="text-gray-700">Holy City, 12345</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-divine-light rounded-full p-4 h-fit">
                    <Clock
                      className="text-divine"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
                    <p className="text-gray-700 mb-1">
                      Monday - Friday: 9:00 AM - 5:00 PM
                    </p>
                    <p className="text-gray-700">Saturday: Closed</p>
                    <p className="text-gray-700">Sunday: 8:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="bg-divine text-white hover:bg-divine-dark p-3 rounded-full transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="bg-divine text-white hover:bg-divine-dark p-3 rounded-full transition-colors"
                  >
                    <Youtube size={20} />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="bg-divine text-white hover:bg-divine-dark p-3 rounded-full transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="bg-divine text-white hover:bg-divine-dark p-3 rounded-full transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-divine font-semibold mb-6">
                  Send Us a Message
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                        placeholder="+1 (234) 567-890"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Prayer Request">Prayer Request</option>
                        <option value="Volunteer Opportunity">
                          Volunteer Opportunity
                        </option>
                        <option value="Event Information">
                          Event Information
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary w-full flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="rounded-lg overflow-hidden shadow-lg h-96">
            {/* Replace with actual Google Maps embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.931413312187!2d-73.98715568459517!3d40.75889517932695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6dbb145%3A0x5b5c7a43530b6b59!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1628602466347!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Live Chat Section */}
      <section className="py-16 divine-light-gradient">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <MessageSquare
              size={48}
              className="text-divine mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-divine mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Our prayer team is available to chat with you and provide
              spiritual guidance.
            </p>
            <a
              href="#"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start Live Chat
            </a>
            <p className="mt-4 text-gray-600">
              Available Monday-Friday: 9AM - 8PM | Saturday: 10AM - 2PM
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Contact
