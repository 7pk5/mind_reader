
        // Game state
        let currentStep = 0;
        let randomNumber = 0;
        let userAnswer = '';
        let calculatorVisible = false;

        // Questions with their answers
        const questions = {
            10: "How many digits are there in an Indian mobile number (excluding +91)?",
            7: "How many colors are there in a rainbow?",
            12: "How many months are there in a year?",
            4: "How many sides does a square have?",
            3: "How many primary colors are there?",
            5: "How many fingers on one hand?",
            2: "How many eyes does a normal human have?",
            1: "How many noses does a normal human have?",
            8: "How many planets are there in the solar system (excluding Pluto)?"
        };

        // Calculator toggle function
        function toggleCalculator() {
            const calculatorSection = document.querySelector('.calculator-section');
            const toggleButton = document.getElementById('toggleCalc');
            const container = document.querySelector('.container');
            
            calculatorVisible = !calculatorVisible;
            
            if (calculatorVisible) {
                calculatorSection.classList.add('show');
                toggleButton.textContent = '🧮 Hide Calculator';
                container.classList.remove('calculator-hidden');
            } else {
                calculatorSection.classList.remove('show');
                toggleButton.textContent = '🧮 Show Calculator';
                container.classList.add('calculator-hidden');
            }
        }

        // Step definitions
        const steps = [
            {
                icon: '🎯',
                title: 'Think of Any Secret Number',
                instruction: 'Think of a number and keep it in your mind (don\'t tell anyone!).',
                button: 'I\'ve Thought of It!'
            },
            {
                icon: '🔢',
                title: 'Multiply by 2',
                instruction: 'Multiply your secret number by 2 using the calculator.',
                button: 'Done Multiplying!'
            },
            {
                icon: '🧠',
                title: 'Answer This Question',
                instruction: '',
                button: 'Added the Answer!'
            },
            {
                icon: '➗',
                title: 'Divide by 2',
                instruction: 'Now, divide your current total by 2.',
                button: 'Done Dividing!'
            },
            {
                icon: '➖',
                title: 'Subtract Your Original Number',
                instruction: 'Now subtract the number you first thought of.',
                button: 'Reveal the Magic!'
            }
        ];

        // Calculator functions
        function appendValue(value) {
            document.getElementById('display').value += value;
        }

        function clearDisplay() {
            document.getElementById('display').value = '';
        }

        function calculate() {
            try {
                const result = eval(document.getElementById('display').value);
                document.getElementById('display').value = result;
            } catch (error) {
                document.getElementById('display').value = 'Error';
            }
        }

        // Game functions
        function initializeGame() {
            // Pick a random question
            const questionNumbers = Object.keys(questions);
            randomNumber = parseInt(questionNumbers[Math.floor(Math.random() * questionNumbers.length)]);
            
            // Update step 3 instruction
            steps[2].instruction = `${questions[randomNumber]}<br><br><strong>Once you know the answer, add that number to your current result.</strong>`;
            
            // Set initial container state
            const container = document.querySelector('.container');
            if (!calculatorVisible) {
                container.classList.add('calculator-hidden');
            }
            
            renderCurrentStep();
            updateProgress();
        }

        function renderCurrentStep() {
            const gameContent = document.getElementById('gameContent');
            
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                
                gameContent.innerHTML = `
                    <div class="step-card active">
                        <div class="step-header">
                            <div class="step-icon">${step.icon}</div>
                            <div class="step-info">
                                <h3>${step.title}</h3>
                            </div>
                            <div class="step-number">Step ${currentStep + 1}</div>
                        </div>
                        <div class="step-instruction">${step.instruction}</div>
                        <div class="step-actions">
                            ${currentStep === 2 ? `
                                <input type="text" id="answerInput" class="answer-input" placeholder="Enter answer" autocomplete="off">
                                <button class="step-button primary" onclick="checkAnswer()">${step.button}</button>
                            ` : currentStep === 4 ? `
                                
                                <button class="step-button primary" onclick="nextStep()">${step.button}</button>
                            ` : `
                                <button class="step-button primary" onclick="nextStep()">${step.button}</button>
                            `}
                            ${currentStep > 0 ? `<button class="step-button secondary" onclick="resetGame()">🔄 Start Over</button>` : ''}
                        </div>
                        <div id="errorMessage"></div>
                    </div>
                `;
                
                // Add event listener for answer input to prevent interference with calculator
                if (currentStep === 2) {
                    const answerInput = document.getElementById('answerInput');
                    if (answerInput) {
                        answerInput.addEventListener('keydown', function(e) {
                            e.stopPropagation(); // Prevent event bubbling to document
                            if (e.key === 'Enter') {
                                checkAnswer();
                            }
                        });
                    }
                }
                
                // Add event listener for original number input in step 5
                if (currentStep === 4) {
                    const originalInput = document.getElementById('originalInput');
                    if (originalInput) {
                        originalInput.addEventListener('keydown', function(e) {
                            e.stopPropagation(); // Prevent event bubbling to document
                            if (e.key === 'Enter') {
                                nextStep();
                            }
                        });
                    }
                }
            } else {
                showFinalResult();
            }
        }

        function nextStep() {
            addCompletedStep();
            currentStep++;
            renderCurrentStep();
            updateProgress();
        }

        function checkAnswer() {
            const answerInput = document.getElementById('answerInput');
            const userAnswer = answerInput.value.trim();
            const errorDiv = document.getElementById('errorMessage');
            
            if (userAnswer === randomNumber.toString()) {
                addCompletedStep();
                currentStep++;
                renderCurrentStep();
                updateProgress();
                errorDiv.innerHTML = '';
            } else {
                errorDiv.innerHTML = '<div class="error-message">🤔 Oops! That doesn\'t seem correct. Please check your answer carefully.</div>';
                answerInput.value = '';
                answerInput.focus();
            }
        }

        function addCompletedStep() {
            const completedSteps = document.getElementById('completedSteps');
            const stepDiv = document.createElement('div');
            stepDiv.className = 'completed-step';
            stepDiv.innerHTML = `✅ Step ${currentStep + 1} Complete`;
            completedSteps.appendChild(stepDiv);
        }

        function updateProgress() {
            const progressBar = document.getElementById('progressBar');
            const progress = (currentStep / steps.length) * 100;
            progressBar.style.width = progress + '%';
        }

        function showFinalResult() {
            const result = randomNumber / 2;
            const gameContent = document.getElementById('gameContent');
            
            gameContent.innerHTML = `
                <div class="reveal-card">
                    <div class="reveal-title">🧠 I've Read Your Mind!</div>
                    <div class="reveal-result">🎊 ${result} 🎊</div>
                    <p>See? It's math, but with a brainy twist! 😉</p>                    
                    <div class="step-actions" style="margin-top: 20px;">
                        <button class="step-button primary" onclick="resetGame()">🎮 Play Again!</button>
                    </div>
                </div>
            `;
        }

        function resetGame() {
            currentStep = 0;
            document.getElementById('completedSteps').innerHTML = '';
            document.getElementById('progressBar').style.width = '0%';
            clearDisplay(); // Clear calculator display
            initializeGame();
        }

        // Initialize the game when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeGame();
        });

        // Add keyboard support for calculator (only when not in answer input)
        document.addEventListener('keydown', function(event) {
            // Check if we're currently in the answer input field
            if (document.activeElement && document.activeElement.id === 'answerInput') {
                return; // Don't process calculator keys when in answer input
            }
            
            const key = event.key;
            if ('0123456789+-*/.'.includes(key)) {
                event.preventDefault();
                appendValue(key === '/' ? '/' : key === '*' ? '*' : key);
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                event.preventDefault();
                clearDisplay();
            }
        });
