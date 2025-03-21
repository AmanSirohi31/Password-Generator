const length = document.querySelector(".passwordLength");
const sliderPosition = document.querySelector(".slider");
const strIndicator = document.querySelector(".indicator");
const uppercaseCheck = document.querySelector('.upperCheck');
const lowercaseCheck = document.querySelector('.lowerCheck');
const numberCheck = document.querySelector('.numCheck');
const symbolCheck = document.querySelector('.symCheck');
//const passwordDisplay = document.querySelector('.passwordSelector');
const copyMessage = document.querySelector('.copiedMsg');
const copyBtn = document.querySelector('.copyButton');
const generateBtn = document.querySelector('.generatePass');
const allCheckbox = document.querySelectorAll('input[type=checkbox]');
const passDisplay = document.querySelector('.passwordDisplay');
const symbols = '~`!@#$%^&*()_+-=<>?:"{}|,./;[]';

let password = "";
let passLength = 10;
let checkedCount = 0;

setSlider();
setIndicator("#ccc");

function setSlider(){
    sliderPosition.value = passLength;
    length.innerText = passLength;
    const min = sliderPosition.min;
    const max = sliderPosition.max;
    sliderPosition.style.backgroundSize = ((passLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    strIndicator.style.backgroundColor = color;
    strIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function generateRndmInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndmNumber(){
    return generateRndmInteger(0,9);
}

function generateUpperChar(){
    return String.fromCharCode(generateRndmInteger(65,91));
}

function generateLowerChar(){
    return String.fromCharCode(generateRndmInteger(97,123));
}

function generateSymbols(){
    return symbols.charAt(generateRndmInteger(0,symbols.length));
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passLength>=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyFunction(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMessage.innerText = "Copied";
    }catch(e){
        copyMessage.innerText = "failed";
    }
    copyMessage.classList.add("active");

    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 2000);
}

function shufflePassword(arr){
    for(let i=arr.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str = "";
    arr.forEach((el) => (str+=el));
    return str;
}

sliderPosition.addEventListener('input', (e) => {
    passLength = e.target.value;
    setSlider();
})

copyBtn.addEventListener('click', () => {
    if(passDisplay.value){
        copyFunction();
    }
})

function handleCheckboxChange(){
    checkedCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            checkedCount++;
    });

    if(passLength<checkedCount){
        passLength = checkedCount;
        setSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

generateBtn.addEventListener('click', () => {
    if(checkedCount==0){
        return;
    }
    if(passLength<checkedCount){
        passLength = checkedCount;
        setSlider();
    }
    password = "";

    
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperChar);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerChar);

    if(numberCheck.checked)
        funcArr.push(generateRndmNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbols);


    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }



    for(let i=0; i<passLength-funcArr.length; i++){
        let randIndex = generateRndmInteger(0, funcArr.length);
        password+=funcArr[randIndex]();
    }


    password = shufflePassword(Array.from(password));

    passDisplay.value = password;

    calcStrength();
});