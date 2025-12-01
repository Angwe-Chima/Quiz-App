const progressFill = document.querySelector('.progress-fill');
const questionNumber = document.querySelector('.question-number');
const questionType = document.querySelector('.question-type');
const questionText = document.querySelector('.question-text');
const optionsContainer = document.querySelector('.options-container');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const main = document.querySelector('main');

let fetchedData;
let current = 0;
let answered = false;

const updateQuestion = (index) => {
  answered = false;
  const q = fetchedData.results[index];
  
  questionNumber.textContent = `Question ${index + 1}`;
  questionType.textContent = q.type.replace('_', ' ');
  questionText.textContent = decodeHTML(q.question);

  const options = [
    ...q.incorrect_answers,
    q.correct_answer
  ].sort(() => Math.random() - 0.5);

  optionsContainer.innerHTML = '';
  options.forEach(option => {
    const optionEl = document.createElement('button');
    optionEl.className = 'option';
    optionEl.textContent = decodeHTML(option);
    optionEl.addEventListener('click', () => selectAnswer(optionEl, q.correct_answer));
    optionsContainer.appendChild(optionEl);
  });

  updateProgress();
  btnPrev.disabled = current === 0;
};

const selectAnswer = (optionEl, correct) => {
  if (answered) return;
  answered = true;

  const allOptions = document.querySelectorAll('.option');
  allOptions.forEach(opt => opt.classList.add('disabled'));

  if (optionEl.textContent === decodeHTML(correct)) {
    optionEl.classList.add('correct');
  } else {
    optionEl.classList.add('wrong');
    allOptions.forEach(opt => {
      if (opt.textContent === decodeHTML(correct)) {
        opt.classList.add('correct');
      }
    });
  }
};

const updateProgress = () => {
  const progress = ((current + 1) / fetchedData.results.length) * 100;
  progressFill.style.width = progress + '%';
};

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const showCompletion = () => {
  main.innerHTML = `
    <div class="completion-screen">
      <div class="completion-icon">🎉</div>
      <div class="completion-text">Quiz Complete!</div>
      <div class="completion-desc">You've completed all questions. Great job!</div>
      <button class="restart-btn" onclick="location.reload()">Start Over</button>
    </div>
  `;
};

const getData = async () => {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=15&category=27&difficulty=medium');
    fetchedData = await response.json();
    updateQuestion(current);

    btnNext.addEventListener('click', () => {
      if (current < fetchedData.results.length - 1) {
        current++;
        updateQuestion(current);
      } else {
        showCompletion();
      }
    });

    btnPrev.addEventListener('click', () => {
      if (current > 0) {
        current--;
        updateQuestion(current);
      }
    });
  } catch (err) {
    console.error('Error fetching quiz:', err);
  }
};

getData();