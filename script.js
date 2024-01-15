// variables
let optionDiv = document.querySelector('.option-div');
let question = document.querySelector('.question');
let questionNum = document.querySelector('.ques-num');
let questionType = document.querySelector('.ques-type');
let button = document.querySelectorAll('button');
let main = document.querySelector('main')

// the options of indivaidual questions array
let optionArray = [];

optionDiv.innerHTML = '';

let fetchedData;
let current = 0;

const updateQuestion = (current) => {
  question.innerHTML = fetchedData.results[current].question;
  questionNum.innerHTML = `${current + 1}. `;
  questionType.innerHTML = fetchedData.results[current].type;

  optionDiv.innerHTML = '';

  optionArray = [
    ...fetchedData.results[current].incorrect_answers,
    fetchedData.results[current].correct_answer
  ].sort();

  optionArray.forEach((option) => {
    let template = `<div class="theOptions"><p>${option}</p></div>`;
    
    optionDiv.innerHTML += template;
  });

  validateAnswer();
};


const validateAnswer = ()=>{
  let options = document.querySelectorAll('.option-div .theOptions');

  options.forEach((optionBtn)=>{
    optionBtn.addEventListener('click', ()=>{
      // disables the options when you ckick
      let options2 = document.querySelectorAll('.option-div .theOptions')
      options2.forEach((btns)=>{
        btns.classList.add('disabled');
      });

      // makes the correct answer green
      options.forEach((item)=>{
        if(item.innerText === fetchedData.results[current].correct_answer){
          item.classList.add('js-correct');
        }
      });

      // detects the wronk and right answer when you click
      if(optionBtn.innerText != fetchedData.results[current].correct_answer){
        optionBtn.classList.add('js-wrong');
        optionDiv.classList.remove('js-correct');
        return
      }else{
        optionBtn.classList.add('js-correct');
        optionDiv.classList.remove('js-wrong');
        return
      }
    });
  });
}


const getData = async () => {
  try {
    let response = await fetch('https://opentdb.com/api.php?amount=15&category=27&difficulty=medium');
    fetchedData = await response.json();

    updateQuestion(current);
    validateAnswer();

    button[1].addEventListener('click', () => {
      if (current < fetchedData.results.length - 1) {
        current++;
        updateQuestion(current);
      }
      else{
        main.innerHTML = `
        <div>
            <img src="images-removebg-preview.png">
            <p>Refresh to start again</p>
        </div>
      `;
      main.classList.add('js-main')
      // disables the next and previous buttons when we reachthe end of the quiz
      button[1].classList.add('disabled');
      button[0].classList.add('disabled');
      }
    });

    button[0].addEventListener('click', () => {
      if (current > 0) {
        current--;
        updateQuestion(current);
      }
    });

  } catch (err) {
    console.error('error -->', err);
  }
}

getData();