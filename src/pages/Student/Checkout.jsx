import React, { useState } from 'react';
import { Upload, Calendar, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const navigate = useNavigate();
  const location = useLocation();

  // Get session data from navigation state
  const sessionData = location.state;

  if (!sessionData) {
    navigate('/student/classes');
    return null;
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadStatus(null); // Reset status when new file is selected
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus(null); // Reset status when new file is selected
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('http://localhost:8080/api/v1/academic/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${uploadResponse.status}`);
      }

      const result = await uploadResponse.json();
      return result.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedFile) {
      setUploadStatus('error');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Upload file first
      const fileUrl = await uploadFileToServer(selectedFile);
      console.log('File uploaded successfully:', fileUrl);

      // Update session with slip link
      const response = await fetch(
        `http://localhost:8080/api/v1/academic/session/${sessionData.sessionId}/slip-link`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slipLink: fileUrl }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update session');
      }

      const updatedSession = await response.json();
      console.log('Session updated:', updatedSession);

      setUploadStatus('success');
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error uploading payment slip:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Upload Bank Transfer Slip</h1>
          <div className="text-blue-100 space-y-1">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="text-sm">
                <span className="font-medium">Session with:</span> {sessionData.mentorName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                <span className="font-medium">Session Date:</span> {sessionData.sessionDate}
                {sessionData.sessionTime && ` at ${sessionData.sessionTime}`}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Session Fee:</span> LKR {sessionData.sessionFee}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Payment slip uploaded successfully!</p>
                <p className="text-green-700 text-sm">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Upload failed</p>
                <p className="text-red-700 text-sm">
                  {!selectedFile ? 'Please select a file to upload' : 'Please try again or contact support'}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Bank Transfer Slip
            </label>

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
                disabled={uploading}
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
                  {!uploading && (
                    <button
                      onClick={removeSelectedFile}
                      className="inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Remove file</span>
                    </button>
                  )}
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
            disabled={!selectedFile || uploading || uploadStatus === 'success'}
            className="w-full bg-gradient-to-r from-[#03b2ed] to-[#9414d1] hover:from-[#9414d1] hover:to-[#03b2ed] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : uploadStatus === 'success' ? (
              'Payment Confirmed!'
            ) : selectedFile ? (
              'Confirm Payment'
            ) : (
              'Please upload transfer slip'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;