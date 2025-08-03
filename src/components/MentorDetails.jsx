import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Briefcase, Award, BookOpen, DollarSign, Loader, AlertCircle } from 'lucide-react';

const MentorProfileModal = ({ mentorId, isOpen, onClose }) => {
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch mentor details when modal opens
  useEffect(() => {
    if (isOpen && mentorId) {
      fetchMentorDetails();
    }
  }, [isOpen, mentorId]);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/v1/academic/mentor/${mentorId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch mentor details: ${response.status}`);
      }
      
      const data = await response.json();
      setMentorData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching mentor details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#450063] to-[#350051] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Mentor Profile</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading mentor details...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchMentorDetails}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Mentor Details */}
          {mentorData && !loading && !error && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="text-center border-b border-gray-200 pb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-[#450063] to-[#350051] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {mentorData.title} {mentorData.first_name} {mentorData.last_name}
                </h3>
                <p className="text-lg text-[#450063] font-medium">{mentorData.profession}</p>
                <p className="text-gray-600">{mentorData.subject}</p>
              </div>

              {/* Bio Section */}
              {mentorData.bio && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700 leading-relaxed">{mentorData.bio}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Contact Information
                  </h4>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#450063]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{mentorData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#450063]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{mentorData.phone_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#450063]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-900">{mentorData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Professional Details
                  </h4>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#450063]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Qualification</p>
                      <p className="text-gray-900">{mentorData.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#450063]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Subject</p>
                      <p className="text-gray-900">{mentorData.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#450063]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Session Fee</p>
                      <p className="text-gray-900">LKR {mentorData.session_fee}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileModal;