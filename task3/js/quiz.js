// Quiz functionality
class Quiz {
    constructor() {
        this.questions = [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language", 
                    "Home Tool Markup Language",
                    "Hyperlink and Text Markup Language"
                ],
                correct: 0
            },
            {
                question: "Which CSS property is used to change the text color?",
                options: [
                    "font-color",
                    "text-color",
                    "color",
                    "background-color"
                ],
                correct: 2
            },
            {
                question: "What method is used to add an element to the end of an array in JavaScript?",
                options: [
                    "append()",
                    "push()",
                    "add()",
                    "insert()"
                ],
                correct: 1
            },
            {
                question: "Which HTML element is used to define internal CSS?",
                options: [
                    "<css>",
                    "<script>",
                    "<style>",
                    "<link>"
                ],
                correct: 2
            },
            {
                question: "What does the '===' operator do in JavaScript?",
                options: [
                    "Assigns a value",
                    "Compares values only",
                    "Compares values and types",
                    "Creates a new variable"
                ],
                correct: 2
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        
        this.elements = {
            startScreen: document.getElementById('quiz-start'),
            questionScreen: document.getElementById('quiz-question'),
            resultScreen: document.getElementById('quiz-result'),
            questionNumber: document.querySelector('.question-number'),
            progressFill: document.querySelector('.progress-fill'),
            questionText: document.querySelector('.question-text'),
            optionsContainer: document.querySelector('.options'),
            nextButton: document.getElementById('next-question'),
            resultScore: document.querySelector('.result-score'),
            resultMessage: document.querySelector('.result-message')
        };
    }
    
    start() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        
        this.elements.startScreen.classList.add('hidden');
        this.elements.resultScreen.classList.add('hidden');
        this.elements.questionScreen.classList.remove('hidden');
        
        this.displayQuestion();
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        
        // Update progress
        this.elements.questionNumber.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        const progressPercent = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.elements.progressFill.style.width = `${progressPercent}%`;
        
        // Update question
        this.elements.questionText.textContent = question.question;
        
        // Clear and populate options
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index, optionElement));
            this.elements.optionsContainer.appendChild(optionElement);
        });
        
        // Reset button state
        this.elements.nextButton.disabled = true;
        this.elements.nextButton.textContent = this.currentQuestion === this.questions.length - 1 ? 'Finish Quiz' : 'Next Question';
        this.selectedAnswer = null;
    }
    
    selectOption(index, element) {
        // Remove previous selections
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked option
        element.classList.add('selected');
        this.selectedAnswer = index;
        this.elements.nextButton.disabled = false;
    }
    
    nextQuestion() {
        if (this.selectedAnswer === null) return;
        
        // Check if answer is correct
        const question = this.questions[this.currentQuestion];
        const isCorrect = this.selectedAnswer === question.correct;
        
        if (isCorrect) {
            this.score++;
        }
        
        // Show correct/incorrect feedback
        this.showAnswerFeedback(question.correct, isCorrect);
        
        // Proceed to next question or show results after delay
        setTimeout(() => {
            this.currentQuestion++;
            
            if (this.currentQuestion < this.questions.length) {
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }, 1500);
    }
    
    showAnswerFeedback(correctIndex, isCorrect) {
        const options = document.querySelectorAll('.option');
        
        options.forEach((option, index) => {
            option.style.pointerEvents = 'none';
            
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        this.elements.nextButton.disabled = true;
    }
    
    showResults() {
        this.elements.questionScreen.classList.add('hidden');
        this.elements.resultScreen.classList.remove('hidden');
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.elements.resultScore.textContent = `You scored ${this.score} out of ${this.questions.length} (${percentage}%)`;
        
        // Set message based on score
        let message;
        if (percentage >= 80) {
            message = "Excellent! You have a strong understanding of web development fundamentals.";
        } else if (percentage >= 60) {
            message = "Good job! You have a solid foundation, but there's room for improvement.";
        } else if (percentage >= 40) {
            message = "Not bad! Consider reviewing the basics to strengthen your knowledge.";
        } else {
            message = "Keep learning! Web development takes time to master.";
        }
        
        this.elements.resultMessage.textContent = message;
    }
    
    restart() {
        this.elements.resultScreen.classList.add('hidden');
        this.elements.startScreen.classList.remove('hidden');
    }
}

// Initialize quiz
let quiz;

function startQuiz() {
    if (!quiz) {
        quiz = new Quiz();
    }
    quiz.start();
}

function nextQuestion() {
    if (quiz) {
        quiz.nextQuestion();
    }
}

function restartQuiz() {
    if (quiz) {
        quiz.restart();
    }
}