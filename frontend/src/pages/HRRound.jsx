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
  const [companyName, setcompanyName] = useState("")
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(candidateEmail);
  console.log(setSent);
  

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
        console.log("Hiii : ",response.data);
        setcompanyName(response.data.companyName);
        
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };

    fetchCandidateData();
  }, []);


  const sendMeetingLink = async() => {
    // Show loader first
    const loader = document.createElement('div');
    loader.classList.add('loader-container');
    loader.innerHTML = `
      <div class="loader"></div>
    `;
    document.body.appendChild(loader);
 
    const meetingLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
 
    const templateParams = {
      meet_link: meetingLink,
      company_name: companyName, 
      to_email: localStorage.getItem("candidateEmailForMeet")
    };
 
    try {
      await sendMeetInvitation(templateParams);
      
      // Remove loader
      loader.remove();
 
      // Show success popup
      const popup = document.createElement('div');
      popup.classList.add('popup');
      popup.innerHTML = `
        <div class="popup-content">
          <h3>Success!</h3>
          <p>Email sent successfully! You can now join the meeting.</p>
          <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
      `;
      document.body.appendChild(popup);
 
    } catch (emailError) {
      loader.remove();
      console.error("Failed to send email:", emailError);
    }
 
    // Add CSS
    const style = document.createElement('style');
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
 
      .popup {
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
 
      .popup-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
      }
 
      .popup-content button {
        margin-top: 10px;
        padding: 5px 20px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
 };

  useEffect(() => {
    if (meetingContainerRef.current) {
      const appID = 2138661963;
      const serverSecret = "f12b35a6709a5fe7b013ef44c34d1a53";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID, serverSecret, roomID, Date.now().toString(), "SmartRecruit"
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
    }
  }, [roomID]);

  return (
    <div className="relative h-screen">
      <div ref={meetingContainerRef} className="h-full" />
      <button
        onClick={sendMeetingLink}
        className={`absolute top-4 right-20 px-4 py-2 rounded-lg flex items-center gap-2 ${
          sent ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-all duration-300`}
      >
        <Mail size={20} />
        {sent ? 'Link Copied!' : 'Click here to Share Meeting Link to Candidate and Join'}
      </button>
    </div>
  );
}