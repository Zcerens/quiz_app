document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://jsonplaceholder.typicode.com/posts';
    const QUESTIONS_COUNT = 10;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let questions = [];
    let timerInterval;

    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const resultContainer = document.getElementById('result-container');
    const resultBody = document.getElementById('result-body');
    const timerElement = document.getElementById('timer');

    const fetchQuestions = async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.slice(0, QUESTIONS_COUNT);
    };

    const displayQuestion = (questionIndex) => {
        const question = questions[questionIndex];
        questionElement.textContent = question.title;
        choicesElement.innerHTML = '';

        const choices = generateChoices(question.body);
        choices.forEach((choice, index) => {
            const choiceElement = document.createElement('button');
            choiceElement.className = 'choice';
            choiceElement.textContent = choice;
            choiceElement.disabled = true;
            choiceElement.onclick = () => {
                selectAnswer(questionIndex, choice);
                nextQuestion();
            };
            choicesElement.appendChild(choiceElement);
        });

        startTimer(30);

        setTimeout(() => {
            document.querySelectorAll('.choice').forEach(button => button.disabled = false);
        }, 10000);
    };

    const generateChoices = (text) => {
        const words = text.split(' ');
        const choices = [];
        for (let i = 0; i < 4; i++) {
            choices.push(words[Math.floor(Math.random() * words.length)]);
        }
        return choices;
    };

    const selectAnswer = (questionIndex, choice) => {
        userAnswers[questionIndex] = choice;
    };

    const nextQuestion = () => {
        clearInterval(timerInterval);
        currentQuestionIndex++;
        if (currentQuestionIndex < QUESTIONS_COUNT) {
            displayQuestion(currentQuestionIndex);
        } else {
            showResults();
        }
    };

    const startTimer = (duration) => {
        let timeRemaining = duration;
        timerElement.textContent = timeRemaining;
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                nextQuestion();
            }
        }, 1000);
    };

    const showResults = () => {
        questionContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        questions.forEach((question, index) => {
            const row = document.createElement('tr');
            const questionCell = document.createElement('td');
            const answerCell = document.createElement('td');

            questionCell.textContent = question.title;
            answerCell.textContent = userAnswers[index] || 'Cevaplanmadı';

            row.appendChild(questionCell);
            row.appendChild(answerCell);
            resultBody.appendChild(row);
        });
    };

    questions = await fetchQuestions();
    displayQuestion(currentQuestionIndex);
});
