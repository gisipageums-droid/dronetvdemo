import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. Company Interface - covers API fields
interface Company {
  companyName: string;
  companyLogo?: string;
  heroHeadline?: string;
  heroBackground?: string;
  aboutImage?: string;
  aboutDescription?: string;
  aboutExperienceYears?: number;
  aboutTeamExperience?: string;
  city?: string;
  state?: string;
  timestamp?: string;
  industry?: string;
  category?: string;
  products?: { title?: string; image?: string; description?: string;[key: string]: any }[];
  services?: { title?: string; description?: string;[key: string]: any }[];
  companyValues?: { title?: string; description?: string;[key: string]: any }[];
  testimonials?: { rating?: number }[];
  productsTitle?: string;
  templateSelection?: string;
  publishedId?: string;
}

const FeaturedCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  const navigate = useNavigate();

  useEffect(() => {

    axios.get('https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=main')
      .then(response => {
        console.log("response", response.data);
        if (response.data.success == true) {

          setCompanies(response.data.cards.slice(0, 6)); // Top 6 featured

        }
        else {
          setCompanies([]);
        }

      })
      .catch(error => {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      });
    // const fetchCompanies = async () => {
    //   try {
    //     const res = await fetch('https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=main');
    //     const data = await res.json();
    //     setCompanies(data.slice(0, 6)); // Top 6 featured
    //   } catch {
    //     setCompanies([]);
    //   }
    // };
    // fetchCompanies();
  }, []);

  return (
    <section className="py-12 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-black">
            Featured Companies
          </h2>
          <button 
            onClick={() => navigate('/companies')}
            className="text-sm font-bold text-black hover:underline"
          >
            View all companies →
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {
            companies.length > 0
              ? companies.map((company: Company, index: number) => {
                const desc =
                  company.aboutDescription ||
                  (company as any).companyDescription ||
                  company.productsTitle ||
                  'No company description.';
                const locationText = (company as any).location || company.city || company.state || 'India';
                const servicesCount =
                  (company.services && company.services.length) || (company as any).servicesCount || 'N/A';
                const productsCount = (company.products && company.products.length) || (company as any).productsCount || 'N/A';

                const handleCardClick = () => {
                  if (company.templateSelection === 'template-1') {
                    navigate(`/company/${company.companyName}`);
                  } else {
                    navigate(`/companies/${company.companyName}`);
                  }
                };

                return (
                  <div
                    key={company.publishedId || index}
                    onClick={handleCardClick}
                    className="group bg-[#f1ee8e] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                  >
                    {/* Image Section - Full Width Banner */}
                    <div className="relative w-full h-56 bg-yellow-100 overflow-hidden p-6">
                      {(company as any).previewImage ? (
                        <img
                          src={(company as any).previewImage}
                          alt={company.companyName}
                          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-full h-full bg-yellow-200">
                          <span className="text-5xl font-bold text-gray-700 uppercase">
                            {company.companyName?.[0] || '?'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col items-center px-4 pt-4 pb-2 text-center">
                      <h3 className="mb-1 text-lg font-bold text-black transition-colors group-hover:text-gray-800 line-clamp-1">
                        {company.companyName}
                      </h3>
                      {locationText && (
                        <div className="flex gap-1 justify-center items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {locationText}
                        </div>
                      )}
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col flex-1 justify-between px-4 pb-4">
                      <p className="mb-3 text-xs text-gray-700 line-clamp-2 text-center">
                        {(company as any).companyDescription || desc}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="py-1 text-center bg-yellow-200 rounded-md">
                          <div className="text-sm font-bold text-black">{servicesCount}</div>
                          <div className="text-[10px] text-gray-600">Services</div>
                        </div>
                        <div className="py-1 text-center bg-yellow-200 rounded-md">
                          <div className="text-sm font-bold text-yellow-700">{productsCount}</div>
                          <div className="text-[10px] text-yellow-700">Products</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              : "No featured companies available at the moment."
          }


        </div>
        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-black mb-4">Want to be featured?</h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Join our network of innovative companies shaping the future of drone technology and reach thousands of industry professionals.
            </p>
            <button
              className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => navigate('/partner')}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
