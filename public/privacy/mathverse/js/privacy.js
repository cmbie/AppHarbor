document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date();
    document.getElementById("date").innerHTML = currentDate.toLocaleDateString();

    const tocLinks = document.querySelectorAll(".toc-link");
    tocLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                tocLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });

    const sections = document.querySelectorAll(".legal-card");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });
        tocLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    const backToTopBtn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

