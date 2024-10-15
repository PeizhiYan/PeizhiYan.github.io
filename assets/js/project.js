
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

// mouse hover event for image-hover-container
document.querySelectorAll('.image-hover-container').forEach(function(container) {
    const img = container.querySelector('img');
    const defaultImage = container.getAttribute('data-default');
    const hoverImage = container.getAttribute('data-hover');

    // Add hover event listeners to change the image source
    container.addEventListener('mouseenter', function() {
        img.src = hoverImage; // Set to hover image on mouse enter
    });

    container.addEventListener('mouseleave', function() {
        img.src = defaultImage; // Set back to default image on mouse leave
    });
});

