// show/hide the content
function toggleDiv() {
    const hiddenDiv = document.getElementById("hiddenContent");
    if (hiddenDiv.classList.contains("visible-div")) {
        hiddenDiv.classList.remove("visible-div");
        document.getElementById("toggleDivBtn").textContent = "Show More Projects";
    } else {
        hiddenDiv.classList.add("visible-div");
        document.getElementById("toggleDivBtn").textContent = "Hide";
    }
}

// Simple image swap on hover for project cards

function enableProjectImageSwap() {
    document.querySelectorAll(".project-card").forEach(function(project) {
        const container = project.querySelector(".image-hover-container");
        if (!container) {
            return;
        }

        const img = container.querySelector("img");
        if (!img) {
            return;
        }

        const defaultImage = container.getAttribute("data-default");
        const hoverImage = container.getAttribute("data-hover");
        if (!defaultImage || !hoverImage) {
            return;
        }

        project.addEventListener("mouseenter", function() {
            img.src = hoverImage;
        });

        project.addEventListener("mouseleave", function() {
            img.src = defaultImage;
        });
    });
}

enableProjectImageSwap();
