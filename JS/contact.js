document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const response = document.getElementById("formResponse");

    response.textContent = `Thank you ${name}, your message has been sent successfully!`;
    response.style.color = "green";

    this.reset();
});
