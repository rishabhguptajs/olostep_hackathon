"use client";
import React, { useState } from "react";

interface ScrapedItem {
  headline: string;
  summary: string;
  url: string;
}

const Home: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [scrapedData, setScrapedData] = useState<ScrapedItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      // Assuming the API response has a 'news' property containing the array
      setScrapedData(result.news); // Adjust based on actual response structure
    } catch (err) {
      setError("An error occurred while scraping the data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Olastep Track</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#cta" className="text-gray-600 hover:text-blue-600">
                  Get Started
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-extrabold mb-4">
              Welcome to Olastep Track
            </h2>
            <p className="text-xl mb-8">
              Your one-stop solution for tracking and managing your projects
              effectively.
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex items-center border-2 border-white rounded-full overflow-hidden">
                <input
                  type="url"
                  required
                  className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                  placeholder="Enter URL to scrape"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-blue-900 font-bold py-2 px-6 hover:bg-yellow-400 transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Scraping..." : "Scrape"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Scraped Data Display */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {scrapedData && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Scraped Data
              </h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {scrapedData.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-5 sm:px-6 border-b border-gray-200"
                  >
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {item.headline}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {item.summary}
                    </p>
                    <a
                      href={item.url}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      target="_blank"
                    >
                      {item.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features section */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Web Scraping",
                  description: "Extract data from any website with ease.",
                  icon: "🌐",
                },
                {
                  title: "Data Analysis",
                  description:
                    "Analyze and visualize scraped data effortlessly.",
                  icon: "📊",
                },
                {
                  title: "Automated Tracking",
                  description:
                    "Set up automated scraping schedules for continuous data updates.",
                  icon: "⏱️",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial section */}
        <section id="testimonials" className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
            <div className="max-w-2xl mx-auto">
              <blockquote className="text-xl italic text-gray-700">
                "Olastep Track has revolutionized how we gather and analyze web
                data. It's powerful, intuitive, and has greatly improved our
                research capabilities."
              </blockquote>
              <p className="mt-4 font-semibold">- John Smith, Data Scientist</p>
            </div>
          </div>
        </section>

        {/* Call to action section */}
        <section id="cta" className="bg-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Data Collection?
            </h2>
            <p className="text-xl mb-8">
              Sign up now to take advantage of our powerful web scraping
              features and start gathering valuable data effortlessly.
            </p>
            <button className="bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition duration-300">
              Get Started for Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Olastep Track. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
