const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")
const overflow = document.querySelector(".overflow")
const links = document.querySelectorAll(".nav-links li")
const currentPage = document.querySelector(".currentPage")

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("open");
    overflow.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade")
    });
});

currentPage.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("open");
    overflow.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade")
    });
});