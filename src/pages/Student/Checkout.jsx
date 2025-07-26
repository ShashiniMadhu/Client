import React, { useState } from 'react';
import { Upload, Calendar, User, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  // Define user role here
  const userRole = 'student';
  const userName = 'SkillMentor';
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  // Get session data from navigation state
  const location = useLocation();
  const defaultSessionData = {
    mentorName: "Michelle Burns",
    sessionDate: "7/26/2025",
    sessionTime: "14:00"
  };
  const currentSessionData = location.state || defaultSessionData;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirmPayment = () => {
    if (selectedFile) {
      // Optionally handle upload logic here
      // After successful upload/confirmation, navigate to dashboard
      navigate('/student/dashboard');
    } else {
      alert('Please upload a bank transfer slip to confirm payment.');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div>      
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Upload Bank Transfer Slip</h1>
          <div className="text-blue-100 space-y-1">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="text-sm">
                <span className="font-medium">Session with:</span> {currentSessionData.mentorName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                <span className="font-medium">Session Date:</span> {currentSessionData.sessionDate}
                {currentSessionData.sessionTime && ` at ${currentSessionData.sessionTime}`}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Bank Transfer Slip
            </label>
            
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-[#03b2ed] bg-blue-50/50'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={removeSelectedFile}
                    className="inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Remove file</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-[#03b2ed] font-medium hover:text-[#9414d1] transition-colors">
                        Choose File
                      </span>
                      <span className="text-slate-500"> or drag and drop</span>
                    </label>
                    <p className="text-sm text-slate-500 mt-1">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 leading-relaxed">
              Please upload a clear image of your bank transfer slip to confirm your payment.
              Make sure all transaction details are visible and readable.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={!selectedFile}
            className="w-full bg-gradient-to-r from-[#03b2ed] to-[#9414d1] hover:from-[#9414d1] hover:to-[#03b2ed] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            {selectedFile ? 'Confirm Payment' : 'Please upload transfer slip'}
          </button>
        </div>
        </div>
      </div> 
    </div>
  );
};

export default CheckoutPage;