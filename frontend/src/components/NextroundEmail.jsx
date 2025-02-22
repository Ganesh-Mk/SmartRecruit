import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendProgressEmail = (templateParams) => {
  const serviceID = "service_rtxf8ll"; // Replace with your EmailJS service ID
  const templateID = "template_hrdes14"; // Replace with your EmailJS template ID
  const publicKey = "oEAb6Q3Ml9ZXZCcwA"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendProgressEmail;

