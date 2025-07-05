"use client";
import { useEffect, useState } from "react";

const WALink = `https://wa.me/918637704621?text=Hi%20Team%20CodeHub,%20I%20want%20to%20start%20my%20coding%20journey!`;

export default function PopupForm() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 10); // Trigger after 20s

    return () => clearTimeout(timer);
  }, []);

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black dark:text-white">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
          onClick={() => setShowForm(false)}
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold mb-4 text-center text-black dark:text-white">
          Ready to Learn Coding?
        </h3>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.currentTarget;
            const name = form.elements[0].value;
            const phone = form.elements[1].value;

            try {
              const res = await fetch(
                "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeT1ojrYqt_s5PgB24qla7tuKfapOte5m7k4hcyjYImxWUW8g/formResponse",
                {
                  method: "POST",
                  mode: "no-cors", // This is the key
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    "entry.1111111111": name,
                    "entry.2222222222": phone,
                  }),
                },
              );

              const result = await res.json();
              if (result.result === "success") {
                alert("Form submitted successfully!");
                form.reset();
              } else {
                alert("Submission failed.");
              }
            } catch (err) {
              alert("Something went wrong." + err.message);
            }
          }}
        >
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-black dark:text-white"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-black dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <a
            href={WALink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Message on WhatsApp
          </a>
        </form>
      </div>
    </div>
  );
}
