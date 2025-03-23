let trivia = [];
        let currentIndex = 0;
        let currentCategory = 'general';
        let score = 0; // Initialize score

        async function loadTrivia() {
            try {
                const response = await fetch('trivia_2.json');
                const data = await response.json();
                trivia = data[currentCategory].questions || [];
                document.getElementById("category-name").innerText = data[currentCategory].category;
                nextQuestion();
            } catch (error) {
                console.error("Error loading trivia:", error);
            }
        }

        function loadCategory(category) {
            currentCategory = category;
            loadTrivia();
        }

        // Utility function to shuffle an array (Fisher-Yates shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadQuestion() {
    if (trivia.length === 0) return;
    const currentQ = trivia[currentIndex];
    document.getElementById("answer").innerText = currentQ.answer;
    document.getElementById("message").innerText = "";

    // Copy and shuffle options
    let optionsCopy = currentQ.options.slice();
    shuffle(optionsCopy);

    // Determine new correct index based on the shuffled array
    let correctAnswer = currentQ.options[currentQ.correctIndex];
    let newCorrectIndex = optionsCopy.indexOf(correctAnswer);
    currentQ.newCorrectIndex = newCorrectIndex; // store it for checking later

    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    optionsCopy.forEach((option, index) => {
        let button = document.createElement("button");
        button.innerText = option;
        // Pass the index of the option, and check against newCorrectIndex when clicked
        button.onclick = () => checkQuestion(index);
        optionsContainer.appendChild(button);
    });
}

function checkQuestion(selectedIndex) {
    if (trivia.length === 0) return;
    let currentQ = trivia[currentIndex];
    let message = document.getElementById("message");
    
    // Disable all option buttons so that the user can only answer once
    const optionsContainer = document.getElementById("options");
    Array.from(optionsContainer.children).forEach((button) => {
        button.disabled = true;
    });
    
    if (selectedIndex === currentQ.newCorrectIndex) {
        score++; // Increase score on correct answer
        document.getElementById("answer").classList.add("correct-glow");
        setTimeout(() => document.getElementById("answer").classList.remove("correct-glow"), 2000);
        document.getElementById("score").innerText = `Score: ${score}`;
        triggerConfetti(); // 🎉 Trigger confetti when correct
    } else {
        document.getElementById("answer").classList.add("shake");
        setTimeout(() => document.getElementById("answer").classList.remove("shake"), 500);
        message.innerText = `❌ Wrong! Hint: ${currentQ.hint}`;
    }
    
    setTimeout(nextQuestion, 2000);
}



        function nextQuestion() {
            if (trivia.length === 0) return;
            currentIndex = Math.floor(Math.random() * trivia.length);
            loadQuestion();
        }

        loadTrivia();
        
        function toggleInstructions() {
            let instructions = document.getElementById("instructions");
            if (instructions.style.display === "none") {
              instructions.style.display = "block";
            } else {
              instructions.style.display = "none";
            }
          }
          function triggerConfetti() {
            confetti({
                particleCount: 200,  // More particles
                spread: 90,          // Wider spread
                startVelocity: 60,   // Faster explosion
                origin: { x: 0.5, y: 0.6 }
              });
          }