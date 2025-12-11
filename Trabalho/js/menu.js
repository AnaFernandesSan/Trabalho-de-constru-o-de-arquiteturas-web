
const btn = document.getElementById("hamburgerBtn");
const menu = document.getElementById("menuMobile");

btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    menu.classList.toggle("active");
});

