
import emailjs from "@emailjs/browser";

const sendMeetInvitation = (templateParams) => {
  const serviceID = "service_0idkwdd"; 
  const templateID = "template_03js9lq"; 
  const publicKey = "-faiUiS_mnOZ8xD6o"; 

  return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendMeetInvitation;
