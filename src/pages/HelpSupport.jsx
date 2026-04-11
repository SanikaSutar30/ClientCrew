import { useOutletContext } from "react-router-dom";
import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

export default function HelpSupport() {
  const { darkMode } = useOutletContext();

  const cardClass = darkMode
    ? "bg-gray-700 border border-gray-600 text-white"
    : "bg-white border border-gray-200 text-black";

  const subTextClass = darkMode ? "text-gray-300" : "text-gray-500";

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Help & Support
        </h1>
        <p className={`text-sm mt-1 ${subTextClass}`}>
          Get help, contact support, and find answers to common questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 shadow-sm ${cardClass}`}>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <Mail className="text-blue-600" size={22} />
          </div>
          <h2 className="text-lg font-semibold mb-2">Email Support</h2>
          <p className={`text-sm mb-3 ${subTextClass}`}>
            Reach out to our support team by email.
          </p>
          <p className="text-sm font-medium">support@clientcrew.com</p>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm ${cardClass}`}>
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
            <Phone className="text-green-600" size={22} />
          </div>
          <h2 className="text-lg font-semibold mb-2">Call Support</h2>
          <p className={`text-sm mb-3 ${subTextClass}`}>
            Talk to our support team during working hours.
          </p>
          <p className="text-sm font-medium">+91 98765 43210</p>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm ${cardClass}`}>
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <MessageCircle className="text-purple-600" size={22} />
          </div>
          <h2 className="text-lg font-semibold mb-2">Live Chat</h2>
          <p className={`text-sm mb-3 ${subTextClass}`}>
            Start a live chat session for quick support.
          </p>
          <button className="px-4 py-2 rounded-xl bg-[#0f766e] text-white text-sm font-medium hover:opacity-90 cursor-pointer">
            Start Chat
          </button>
        </div>
      </div>

      <div className={`rounded-2xl p-6 shadow-sm ${cardClass}`}>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={20} className="text-[#0f766e]" />
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium mb-1">How do I update my profile?</h3>
            <p className={`text-sm ${subTextClass}`}>
              Go to My Profile from the topbar dropdown and click Edit Profile.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium mb-1">How do I manage notifications?</h3>
            <p className={`text-sm ${subTextClass}`}>
              Open the Notifications page or use the notification dropdown in
              the topbar.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">
              How do I change system settings?
            </h3>
            <p className={`text-sm ${subTextClass}`}>
              Go to the Settings page from the profile dropdown and update your
              preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
