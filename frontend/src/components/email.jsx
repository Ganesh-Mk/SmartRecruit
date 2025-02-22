import emailjs from "@emailjs/browser";

const sendEmail = async (templateParams) => {
  const serviceID = "service_k24gx2a"; 
  const templateID = "template_beb6b3i"; 
  const publicKey = "9BvLyWOUXCWd5o4lw"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default sendEmail;
