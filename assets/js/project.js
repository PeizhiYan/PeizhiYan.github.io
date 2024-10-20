
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



// document.querySelectorAll('.project').forEach(function(project) {
//     const container = project.querySelector('.image-hover-container');
//     const img = container.querySelector('img');
//     const defaultImage = container.getAttribute('data-default');
//     const hoverImage = container.getAttribute('data-hover');

//     // Add hover event listeners to change the image source when hovering over the entire project div
//     project.addEventListener('mouseenter', function() {
//         img.src = hoverImage; // Set to hover image on mouse enter
//     });

//     project.addEventListener('mouseleave', function() {
//         img.src = defaultImage; // Set back to default image on mouse leave
//     });
// });



document.querySelectorAll('.project').forEach(function(project) {
    const container = project.querySelector('.image-hover-container');
    const img = container.querySelector('img');
    const defaultImage = container.getAttribute('data-default');
    const hoverImage = container.getAttribute('data-hover');
    const matrixRain = container.querySelector('.matrix-rain');


    // Function to generate random Matrix-style characters
    function generateMatrixCharacters() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アァカサタナハマヤラワンツヒフヘホモルレロン゛';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Function to generate a single column of falling characters
    function generateMatrixColumn() {
        const column = document.createElement('div');
        column.classList.add('matrix-column');

        // Create 20 characters per column, each character is a span
        for (let i = 0; i < 20; i++) {
            const charElement = document.createElement('span');
            charElement.textContent = generateMatrixCharacters();
            column.appendChild(charElement);
        }

        return column;
    }

    // Function to generate Matrix rain effect
    function generateMatrixRain() {
        matrixRain.innerHTML = ''; // Clear any existing rain

        const columns = Math.floor(window.innerWidth / 20); // Number of columns based on viewport width
        for (let i = 0; i < columns; i++) {
            const column = generateMatrixColumn();
            column.style.left = `${i * 20}px`; // Space columns evenly across the width
            //column.style.top = `${i * 20}px`; // Space columns evenly across the width
            matrixRain.appendChild(column);
        }
    }

    // Add hover event listeners to change the image source when hovering over the entire project div
    project.addEventListener('mouseenter', function() {
        img.src = hoverImage; // Set to hover image on mouse enter
        matrixRain.style.opacity = '1'; // Show the full-page Matrix rain effect
        generateMatrixRain(); // Generate and display the Matrix rain
    });

    project.addEventListener('mouseleave', function() {
        img.src = defaultImage; // Set back to default image on mouse leave
        matrixRain.style.opacity = '0'; // Hide the full-page Matrix rain effect
    });

});
