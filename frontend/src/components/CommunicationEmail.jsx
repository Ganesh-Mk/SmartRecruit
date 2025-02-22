import emailjs from "@emailjs/browser";

const sendEmailComm = async (templateParams) => {
  const serviceID = "service_mse5zov"; 
  const templateID = "template_r6c50n4"; 
  const publicKey = "a9v96yLFO602P52fd"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default sendEmailComm;
