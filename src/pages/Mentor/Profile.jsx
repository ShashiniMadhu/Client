import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MentorProfile = () => {
  const mentorId = 6; // hardcoded for now
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/academic/mentor/${mentorId}`);
        setMentor(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch mentor details:', error);
        setStatus('Failed to load mentor profile.');
      }
    };
    fetchMentor();
  }, [mentorId]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!mentor) return <p className="text-center text-red-600 mt-10">{status}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-[#280120] mb-4">Mentor Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <span className="font-semibold">Title:</span> {mentor.title}
        </div>
        <div>
          <span className="font-semibold">Full Name:</span> {mentor.first_name} {mentor.last_name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {mentor.email}
        </div>
        <div>
          <span className="font-semibold">Phone:</span> {mentor.phone_number}
        </div>
        <div>
          <span className="font-semibold">Address:</span> {mentor.address}
        </div>
        <div>
          <span className="font-semibold">Profession:</span> {mentor.profession}
        </div>
        <div>
          <span className="font-semibold">Subject:</span> {mentor.subject}
        </div>
        <div>
          <span className="font-semibold">Qualification:</span> {mentor.qualification}
        </div>
        <div>
          <span className="font-semibold">Session Fee:</span> ${mentor.session_fee}
        </div>
        <div className="md:col-span-2">
          <span className="font-semibold">Bio:</span>
          <p className="mt-1">{mentor.bio || 'No bio available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
