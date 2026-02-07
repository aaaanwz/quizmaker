/**
 * Quiz Application JavaScript
 */

class QuizApp {
    constructor(quizData, allAnswers) {
        this.quizData = quizData;
        this.allAnswers = allAnswers;
        this.questions = this.shuffleArray([...quizData.questions]);
        this.currentIndex = 0;
        this.correctCount = 0;
        this.isAnswering = false;

        // Audio elements
        this.questionSound = new Audio('../content/question.mp3');
        this.correctSound = new Audio('../content/correct.mp3');
        this.incorrectSound = new Audio('../content/incorrect.mp3');

        // DOM elements
        this.progressFill = document.getElementById('progressFill');
        this.currentQuestionEl = document.getElementById('currentQuestion');
        this.totalQuestionsEl = document.getElementById('totalQuestions');
        this.questionImage = document.getElementById('questionImage');
        this.answersContainer = document.getElementById('answersContainer');
        this.questionScreen = document.getElementById('questionScreen');
        this.resultScreen = document.getElementById('resultScreen');
        this.feedbackOverlay = document.getElementById('feedbackOverlay');
        this.feedbackIcon = document.getElementById('feedbackIcon');
        this.feedbackText = document.getElementById('feedbackText');
        this.correctCountEl = document.getElementById('correctCount');
        this.totalCountEl = document.getElementById('totalCount');
        this.accuracyRateEl = document.getElementById('accuracyRate');
        this.retryButton = document.getElementById('retryButton');

        this.init();
    }

    init() {
        this.totalQuestionsEl.textContent = this.questions.length;
        this.retryButton.addEventListener('click', () => this.restart());
        this.showQuestion();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.currentQuestionEl.textContent = this.currentIndex + 1;
    }

    showQuestion() {
        if (this.currentIndex >= this.questions.length) {
            this.showResult();
            return;
        }

        const question = this.questions[this.currentIndex];
        this.updateProgress();

        // Play question sound
        this.questionSound.currentTime = 0;
        this.questionSound.play().catch(() => { });

        // Show image
        this.questionImage.src = question.photo;

        // Generate answers
        this.generateAnswers(question);
    }

    generateAnswers(question) {
        const correctAnswer = question.answer;

        // Get wrong answers (different from correct answer)
        const wrongAnswers = this.allAnswers.filter(a => a !== correctAnswer);

        // Shuffle and take 3 wrong answers
        const shuffledWrong = this.shuffleArray(wrongAnswers).slice(0, 3);

        // Combine and shuffle all answers
        const allAnswerOptions = this.shuffleArray([correctAnswer, ...shuffledWrong]);

        // Render answer buttons
        this.answersContainer.innerHTML = '';
        allAnswerOptions.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.addEventListener('click', () => this.handleAnswer(answer, correctAnswer, button));
            this.answersContainer.appendChild(button);
        });

        this.isAnswering = false;
    }

    handleAnswer(selected, correct, button) {
        if (this.isAnswering) return;
        this.isAnswering = true;

        // Disable all buttons
        const buttons = this.answersContainer.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.disabled = true);

        const isCorrect = selected === correct;

        if (isCorrect) {
            this.correctCount++;
            button.classList.add('correct');
            this.showFeedback('⭕', 'せいかい！', true);
            this.correctSound.currentTime = 0;
            this.correctSound.play().catch(() => { });
        } else {
            button.classList.add('incorrect');
            // Highlight the correct answer
            buttons.forEach(btn => {
                if (btn.textContent === correct) {
                    btn.classList.add('correct');
                }
            });
            this.showFeedback('❌', `こたえ: ${correct}`, false);
            this.incorrectSound.currentTime = 0;
            this.incorrectSound.play().catch(() => { });
        }

        // Move to next question after delay
        setTimeout(() => {
            this.hideFeedback();
            this.currentIndex++;
            this.showQuestion();
        }, 1500);
    }

    showFeedback(icon, text, isCorrect) {
        this.feedbackIcon.textContent = icon;
        this.feedbackText.textContent = text;
        this.feedbackOverlay.classList.remove('hidden');
    }

    hideFeedback() {
        this.feedbackOverlay.classList.add('hidden');
    }

    showResult() {
        this.questionScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');

        const total = this.questions.length;
        const accuracy = Math.round((this.correctCount / total) * 100);

        this.correctCountEl.textContent = this.correctCount;
        this.totalCountEl.textContent = total;
        this.accuracyRateEl.textContent = `${accuracy}%`;

        // Update result icon and title based on accuracy
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');

        if (accuracy === 100) {
            resultIcon.textContent = '🏆';
            resultTitle.textContent = 'パーフェクト！';
        } else if (accuracy >= 80) {
            resultIcon.textContent = '🎉';
            resultTitle.textContent = 'すばらしい！';
        } else if (accuracy >= 60) {
            resultIcon.textContent = '😊';
            resultTitle.textContent = 'よくできました！';
        } else if (accuracy >= 40) {
            resultIcon.textContent = '💪';
            resultTitle.textContent = 'もうすこし！';
        } else {
            resultIcon.textContent = '📚';
            resultTitle.textContent = 'がんばろう！';
        }
    }

    restart() {
        this.currentIndex = 0;
        this.correctCount = 0;
        this.questions = this.shuffleArray([...this.quizData.questions]);

        this.resultScreen.classList.add('hidden');
        this.questionScreen.classList.remove('hidden');

        this.showQuestion();
    }
}

// Initialize the quiz when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp(QUIZ_DATA, ALL_ANSWERS);
});
