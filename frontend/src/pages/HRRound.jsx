import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Mail } from "lucide-react";
import axios from "axios";
import sendMeetInvitation from "../components/MeetInvitation";

export default function HRRound() {
  const { id, candidateEmail } = useParams();
  const roomID = id;
  const meetingContainerRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [companyName, setcompanyName] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(candidateEmail);
  console.log(setSent);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
        console.log("Hiii : ", response.data);
        setcompanyName(response.data.companyName);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };

    fetchCandidateData();
  }, []);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 7000);
  };

  const sendMeetingLink = async () => {
    // Show loader first
    const loader = document.createElement("div");
    loader.classList.add("loader-container");
    loader.innerHTML = `
      <div class="loader"></div>
    `;
    document.body.appendChild(loader);

    const meetingLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

    const templateParams = {
      meet_link: meetingLink,
      company_name: companyName,
      to_email: localStorage.getItem("candidateEmailForMeet"),
    };

    try {
      await sendMeetInvitation(templateParams);
      loader.remove();
      showToast('Email successfully sent to the candidate. They can now join the meeting.');
      setSent(true);
    } catch (emailError) {
      loader.remove();
      console.error("Failed to send email:", emailError);
      showToast('Failed to send email. Please try again.', 'error');
    }

    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
   
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: transparent;
        border-radius: 50%;
        animation: rotation 1s linear infinite;
      }
   
      @keyframes rotation {
        0% { transform: rotate(0deg) }
        100% { transform: rotate(360deg) }
      }

      .custom-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        border-radius: 4px;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.3s ease;
        z-index: 1001;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      .custom-toast.error {
        background-color: #f44336;
      }

      .custom-toast.show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    if (meetingContainerRef.current) {
      const appID = 1316708813;
      const serverSecret = "f3f2dcca34f6cd0178c17e5375d83ac5";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID, serverSecret, roomID, Date.now().toString(), "Enter your name"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetingContainerRef.current,
        sharedLinks: [
          {
            name: "Copy link",
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });

      // Automatically trigger sendMeetingLink when the component mounts
      sendMeetingLink();
    }
  }, [roomID]);

  return (
    <div className="relative h-screen">
      <div ref={meetingContainerRef} className="h-full" />
    </div>
  );
}