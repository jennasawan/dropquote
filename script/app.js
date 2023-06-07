let table = document.getElementById('array-table');

let switchArray = [];
let tableArr = [];
let nonChars = ['?', '!', '.', ',', ";", ':', ' ', "'"]
let correctAnswer = [];
let gameCount = 0;

let quotes = new Map();

quotes.set(1, "I am no bird; and no net ensnares me: I am a free human being with an independent will, which I now exert to leave you.");
quotes.set(2, "And so we beat on, boats against the current, borne back ceaselessly into the past.");
quotes.set(3, "He has put a knife on the things that held us together and we have fallen apart.");
quotes.set(4, "I wish, as well as everybody else, to be perfectly happy; but, like everybody else, it must be in my own way.");
quotes.set(5, "Ralph wept for the end of innocence, the darkness of man's heart, and the fall through the air of the true, wise friend called Piggy.");
quotes.set(6, "The creatures outside looked from pig to man, and from man to pig, and from pig to man again; but already it was impossible to say which was which.");
quotes.set(7, "I wanted you to see what real courage is, instead of getting the idea that courage is a man with a gun in his hand. It's when you know you're licked before you begin but you begin anyway and you see it through no matter what. You rarely win, but sometimes you do.");

let authors = new Map();

authors.set(1, "Charlotte Bronte's 'Jane Eyre'");
authors.set(2, "F. Scott Fitzgerald's 'The Great Gatsby'");
authors.set(3, "Chinua Achebe's 'Things Fall Apart'");
authors.set(4, "Jane Austen's 'Sense and Sensibility'");
authors.set(5, "William Golding's 'Lord of the Flies'");
authors.set(6, "George Orwell's 'Animal Farm'");
authors.set(7, "Harper Lee's 'To Kill a Mockingbird'");

let quote = '';
let author = '';
let gameKey = '';


function createGame(){

    gameKey = Math.floor(Math.random() * quotes.size + 1);
    quote = quotes.get(gameKey);
    author = authors.get(gameKey);

    let qLen = quote.length; 

    let div = 0;

    //div == the number of lines that will be generated; basing it on quote length here
    if(qLen > 200){
        div = 8
    }else if(qLen > 100){
        div = 6
    }else if(qLen > 800){
        div = 5
    }else{
        div = 4
    }
    
    let lineLen = qLen/div;

    let marker = 0;

    //marker is where the line quote will be broken into a new line
    for(let i = 0; i < qLen; i++){
        marker++;
        if(marker >= lineLen && quote.charAt(i) === " "){
            quote = quote.substring(0, i) + '/' + quote.substring(i+1);
            marker = 0;
        }

    }


    //putting the separated strings into an array of strings and then determining the longest string and adding spaces to the others to match the longest length 
    let linesArr = quote.toUpperCase().split('/');
    
    let longestLine = linesArr[0].length;

    for(let i = 0; i < linesArr.length; i++){
        if(linesArr[i].length > longestLine){
            longestLine = linesArr[i].length;
        }
    }


    for(let i = 0; i < linesArr.length; i++){
        if(linesArr[i].length < longestLine){
            linesArr[i] = (linesArr[i]+ " ".repeat(longestLine - linesArr[i].length));
        }
    }

    //correctAnswer will be used to compare the table rows later and determine if the user answer is correct, tableArr below will be used to store each character for table creation 
    correctAnswer = linesArr;

    for(let i = 0; i < linesArr.length; i++){
        tableArr.push(linesArr[i].split(''));
    }
    
    //creating the table
    for(let row of tableArr){
        table.insertRow();
        for(let cell of row){
            let newCell = table.rows[table.rows.length-1].insertCell();
            newCell.textContent = cell;
        }
    }


    //for some reason the table creates an extra top row but only the first time it generates; need to figure out why  
    if(gameCount == 0){
        table.deleteRow(0);
    }

    shuffleColumns();


    //making each cell a button so their letters can be swapped
    let letterBtns = document.querySelectorAll('td');

    switchArray = [];
    let colArray = [];
    let rowArray = [];

    letterBtns.forEach((btn) => {
        if (btn.textContent != ' ' && btn.textContent != '.' && btn.textContent != ',' && btn.textContent != '?') {
            btn.addEventListener('click', () => {
                switchArray.push(btn.textContent);
                colArray.push(btn.cellIndex);
                rowArray.push(btn.parentNode.rowIndex)
                btn.classList.add('active')
                if (switchArray.length == 2) {
                    if (colArray[0] == colArray[1]) {

                        let text1 = switchArray[0]
                        let text2 = switchArray[1]

                        let btn1 = document.getElementById("array-table").rows[rowArray[0]].cells[colArray[0]];
                        let btn2 = document.getElementById("array-table").rows[rowArray[1]].cells[colArray[1]];


                        btn1.textContent = text2;
                        btn2.textContent = text1;
                        btn1.classList.remove('active')
                        btn2.classList.remove('active')

                        switchArray = [];
                        rowArray = [];
                        colArray = [];

                        checkAnswer();

                    } else {
                        let btn1 = document.getElementById("array-table").rows[rowArray[0]].cells[colArray[0]];
                        let btn2 = document.getElementById("array-table").rows[rowArray[1]].cells[colArray[1]];
                        btn1.classList.remove('active')
                        btn2.classList.remove('active')
                        switchArray = [];
                        rowArray = [];
                        colArray = [];
                    }
                }

            })
        }
    })



}



function shuffleColumns() {

    for(let x = 0; x < 5; x++){
        for (let i = 0; i < tableArr[0].length; i++) {
            let j = Math.floor(Math.random() * tableArr.length)
            let q = Math.floor(Math.random() * tableArr.length)

            if (j == q) {
                i--;
            } else {

                let el1 = document.getElementById("array-table").rows[j].cells[i];
                let el2 = document.getElementById("array-table").rows[q].cells[i];

                if (((!nonChars.includes(el1.textContent) && (!nonChars.includes(el2.textContent))) || (el1.textContent == ' ' && el2.textContent == ' '))) {
                       

                    let txt1 = el1.textContent;
                    let txt2 = el2.textContent;

                    el1.textContent = txt2;
                    el2.textContent = txt1;
                    

                } else {
                    i--;
                }

            }

        }
    }
    
}

function checkAnswer(){

    
    let totalNeeded = correctAnswer.length;
    let correct = 0;

    for(let i = 0; i < correctAnswer.length; i++){
        if(table.rows[i].textContent == correctAnswer[i]){
            correct++;
        }        
    }

    if(correct == totalNeeded){

        if(window.confirm('Congrats, you win!\n' + '\n"' + quotes.get(gameKey) + '" -' + authors.get(gameKey) + "\n\nPlay again?") == true) {
            newGameTime();
        }else{
            window.close()
        }   
    }
}


function newGameTime(){
  
    gameCount++;

    let rows = table.rows.length; 

    for(let i = rows - 1; i >= 0; i--){
     table.deleteRow(i)
    }
    
     tableArr = [];
     createGame();
}



document.addEventListener('DOMContentLoaded', () => {
    
    createGame();

    let newGame = document.getElementById('new-quote');

    newGame.addEventListener('click', () => {

        newGameTime();

    })

})
