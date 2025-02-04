///////////////////////////////////////////////////////////////////////////
//TODO: 3번째 Roll 이후 못 넣는 문제 해결하기
//TODO: ROUND 기능 구현하기
//TODO: 남은 Roll 수 오른쪽 상단에 표시하기기
//TODO: 포인트 박스에 들어가는 값이 이미 들어가 있는 경우에는 넣지 못하게 하기 -> 빨간색 하이라이트 기능 넣기기
///////////////////////////////////////////////////////////////////////////


var selected_point_box = 0; //sidebar의 포인트 박스 번호를 의미
var point_box_values = [0,0,0,0,0,0,0,0,0,0,0,0]; //각 포인트 박스의 값
var point_box_visited = [false, false, false, false, false, false, false, false, false, false, false, false]; //각 포인트 박스의 방문 여부
var dices = [0, 0, 0, 0, 0]; //굴리는 주사위(rdice) 의 값
var contained_dices = [0,0,0,0,0]; //선택한 주사위(dice)의 값
var roll_phase = 0;

var selected_dice = 0;
var selected_rdice = 0;
var present_rdice = 5;
var present_dice = 0;

var highlighting_row = 0;
var round_phase = 1;
var roll_phase = 0;

const dice_dot = [[], [5], [1, 9], [1, 5, 9], [1, 3, 7, 9], [1, 3, 5, 7, 9], [1, 3, 4, 6, 7, 9]];
const total_point_box = document.getElementById(`total_point`);
const bonus_point_box = document.getElementById(`bonus_point`);
const grand_total_point_box = document.getElementById(`grand_point`);
const round_box = document.getElementById(`round`);

var possible_point = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function reset_all_values() {
    selected_point_box = 0;
    dices = [0,0,0,0,0]
    contained_dices = [0,0,0,0,0]
    roll_phase = 0;
    selected_dice = 0;
    selected_rdice = 0;
    present_rdice = 5;
    present_dice = 0;
    highlighting_row = 1    ;
    show_round();
    show_roll_phase();

}
function show_round(){
    round_box.innerHTML = `round \n ${round_phase}/12`;
}

function show_roll_phase(){
    document.getElementById('roll_phase_text').innerText = `Roll \n ${roll_phase}/3`;
}

function reset_all_dices(){
    showDices();
    showRDices();
    for(let i=0; i<5; i++){
        let selected_rdice_box = document.getElementById(`rdice_` + i);
        selected_rdice_box.style.display = 'grid';
    }
}

function possible_point_calculate() {
    contained_dices.sort();
    //Aces
    possible_point[0] = contained_dices.filter(x => x === 1).length;
    //Deuces
    possible_point[1] = contained_dices.filter(x => x === 2).length * 2;
    //Threes
    possible_point[2] = contained_dices.filter(x => x === 3).length * 3;
    //Fours
    possible_point[3] = contained_dices.filter(x => x === 4).length * 4;
    //Fives
    possible_point[4] = contained_dices.filter(x => x === 5).length * 5;
    //Sixes
    possible_point[5] = contained_dices.filter(x => x === 6).length * 6;
    //Choice
    possible_point[6] = contained_dices.reduce((a, b) => a + b, 0);
    //4 of a kind
    let fourkind = [0,0,0,0,0,0,0]
    let is_fourkind = false;
    for (let i = 0; i < 5; i++) {
        fourkind[contained_dices[i]] += 1;
    }
    for (let i = 1; i <= 6; i++) {
        if (fourkind[i] >= 4) {
            is_fourkind = true;
        }
    }
    possible_point[7] = is_fourkind ? contained_dices.reduce((a, b) => a + b, 0): 0;

    //Full house
    let fullhouse = false;
    let threes = false;
    let twos = false;
    for (let i = 1; i <= 6; i++) {
        if (contained_dices.filter(x => x === i).length >= 3) {
            threes = true;
        }
        if (contained_dices.filter(x => x === i).length >= 2) {
            twos = true;
        }
    }
    if (threes && twos) {
        fullhouse = true;
    }
    possible_point[8] = fullhouse ? contained_dices.reduce((a, b) => a + b, 0): 0;
    //Small straight
    let smallstraight = true;
    for (let i=0; i<5; i++){
        if(contained_dices[i] != i+1){
            smallstraight = false;
        }
    }
    possible_point[9] = smallstraight ? 30 : 0;
    //Large straight
    let largestraight = true;
    for (let i=0; i<5; i++){
        if(contained_dices[i] != i+2){
            largestraight = false;
        }
    }
    possible_point[10] = largestraight ? 30 : 0;
    //Yacht
    let yacht = false;
    for (let i = 1; i <= 6; i++) {
        if (contained_dices.filter(x => x === i).length === 5) {
            yacht = true;
        }
    }
    possible_point[11] = yacht ? 50 : 0;
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1; // 1과 6 사이의 정수 난수
} 
function showDices() {
    for (let i = 0; i < 5; i++) {
        for (let j = 1; j <= 9; j++) {
            let updatedot = document.getElementById(`dot${i}_${j}`);
            updatedot.style.backgroundColor = `white`;
        }
    }
    for (let i = 0; i < 5; i++) {
        let num = contained_dices[i];
        for (let j = 0; j < dice_dot[num].length; j++) {
            let updatedot = document.getElementById(`dot${i}_${dice_dot[num][j]}`);
            updatedot.style.backgroundColor = `black`;
        }
    }
}

function showRollRDices() {
    for (let i = 0; i < present_rdice; i++) {
        let num = dices[i];
        for (let j = 1; j <=9; j++) {
            let updatedot = document.getElementById(`rdot${i}_${j}`);
            updatedot.style.backgroundColor = `white`;
        }
    }
    for (let i = 0; i < present_rdice; i++) {
        dices[i] = rollDice();
        console.log('yay2');
    }
    for (let i = 0; i < present_rdice; i++) {
        let num = dices[i];
        for (let j = 0; j < dice_dot[num].length; j++) {
            let updatedot = document.getElementById(`rdot${i}_${dice_dot[num][j]}`);
            updatedot.style.backgroundColor = `black`;
        }
    }
}

function showRDices() {
    for (let i = 0; i < present_rdice; i++) {
        let num = dices[i];
        for (let j = 1; j <=9; j++) {
            let updatedot = document.getElementById(`rdot${i}_${j}`);
            updatedot.style.backgroundColor = `white`;
        }
    }
    for (let i = 0; i < present_rdice; i++) {
        let num = dices[i];
        for (let j = 0; j < dice_dot[num].length; j++) {
            let updatedot = document.getElementById(`rdot${i}_${dice_dot[num][j]}`);
            updatedot.style.backgroundColor = `black`;
        }
    }
}

function pointboard(event){
    if (event.key === 'ArrowDown') {
        let selected_box = document.getElementById(`point_` + selected_point_box);
        selected_box.style.border = `2px solid black`;
        selected_point_box = (selected_point_box + 1) % 12;
        if(point_box_visited[selected_point_box] === false){
        selected_box = document.getElementById(`point_` + selected_point_box);
        selected_box.style.border = `4px solid greenyellow`;
        }else{
            selected_box = document.getElementById(`point_` + selected_point_box);
            selected_box.style.border = `4px solid red`;
        }
    } else if (event.key === 'ArrowUp') {
        let selected_box = document.getElementById(`point_` + selected_point_box);
        selected_box.style.border = `2px solid black`;
        selected_point_box = (selected_point_box + 11) % 12;
        if(point_box_visited[selected_point_box] === false){
        selected_box = document.getElementById(`point_` + selected_point_box);
        selected_box.style.border = '4px solid greenyellow';
        }else{
            selected_box = document.getElementById(`point_` + selected_point_box);
            selected_box.style.border = `4px solid red`;
        }
    }
    if (event.key === 'Enter') {
        if(point_box_visited[selected_point_box] === false){
        point_box_visited[selected_point_box] = true;
        let selected_box = document.getElementById(`point_` + selected_point_box);
        selected_box.style.border = `2px solid black`;
        console.log(selected_point_box);
        possible_point_calculate();
        changePointBoxValue(selected_point_box, possible_point[selected_point_box]);
        reset_all_values();
        let rollbutton = document.getElementById('roll_button');
        rollbutton.style.display = 'flex';
        rollbutton.addEventListener('click', initializeRoller);
        reset_all_dices();
        document.removeEventListener('keydown', pointboard);
        round_phase += 1;
        show_round();
        let audio = new Audio("./audio_files/levelup.ogg")
        audio.play();
        return;
    }
    }
}
function initializePointBoard() {
    let selected_box = document.getElementById(`point_` + selected_point_box);
    selected_box.style.border = `4px solid greenyellow`;

    document.addEventListener('keydown', pointboard);
}

function offallhighlights(){
    for(let i = 0; i < 5; i++){
        let selected_dice_box = document.getElementById(`dice_` + i);
        selected_dice_box.style.border = `10px solid rgb(40, 40, 40)`;
    }
    for(let i = 0; i < 5; i++){
        let selected_rdice_box = document.getElementById(`rdice_` + i);
        selected_rdice_box.style.border = `2px solid black`;
    }
}

function changePointBoxValue(index, value) {
    let selected_box = document.getElementById(`point_` + index);
    selected_box.innerText = value;
    point_box_values[index] = value;
    updateTotalBoxValue();
}

function updateTotalBoxValue() {
    let uppersum = 0;
    for (let i = 0; i < 6; i++) {
        uppersum += point_box_values[i];
    }
    total_point_box.innerHTML = `${uppersum}/63`;
    if (uppersum >= 63) {
        uppersum += 35;
        bonus_point_box.innerHTML = `+35`;
    }
    for (let i = 6; i < 12; i++) {
        uppersum += point_box_values[i];
    }
    grand_total_point_box.innerHTML = `${uppersum}`;
}
function highlighter(event){
    if(highlighting_row === 0){
        if(event.key === 'ArrowDown'){
            if(present_rdice != 0){
            highlighting_row = 1;
            let selected_dice_box = document.getElementById(`dice_` + selected_dice);
            selected_dice_box.style.border = `10px solid rgb(40, 40, 40)`;
            selected_rdice = selected_dice <= present_rdice-1 ? selected_dice : present_rdice-1;
            let selected_rdice_box = document.getElementById(`rdice_` + (selected_rdice<=0 ? 0 : selected_rdice));
            selected_rdice_box.style.border = `4px solid greenyellow`;
            }
        }else if (event.key === 'ArrowRight') {
            let selected_dice_box = document.getElementById(`dice_` + selected_dice);
            selected_dice_box.style.border = `10px solid rgb(40, 40, 40)`;
            selected_dice = (selected_dice + 1) % present_dice;
            selected_dice_box = document.getElementById(`dice_` + selected_dice);
            selected_dice_box.style.border = `4px solid greenyellow`;
        } else if (event.key === 'ArrowLeft') {
            let selected_dice_box = document.getElementById(`dice_` + selected_dice);
            selected_dice_box.style.border = `10px solid rgb(40, 40, 40)`;
            selected_dice = (selected_dice + present_dice - 1) % present_dice;
            selected_dice_box = document.getElementById(`dice_` + selected_dice);
            selected_dice_box.style.border = '4px solid greenyellow';
        } else if (event.key === 'Enter') {
            let selected_dice_box = document.getElementById(`dice_` + selected_dice);
            selected_dice_box.style.border = `10px solid rgb(40, 40, 40)`;
            selected_dice_box.style.border = `10px solid rgb(40, 40, 40)`;
            dices[present_rdice] = contained_dices[selected_dice]
            contained_dices.splice(selected_dice, 1);
            contained_dices.push(0);
            showDices();
            selected_dice_box = document.getElementById(`rdice_` + present_rdice);
            selected_dice_box.style.display = 'grid';
            selected_dice_box.style.border = `2px solid black`;

            present_dice -= 1;
            if (present_dice === selected_dice) {
                selected_dice -= 1;
            }
            present_rdice +=1;
            showRDices();
            if(present_dice != 0){
                selected_rdice_box = document.getElementById(`dice_` + selected_dice);
                selected_rdice_box.style.border = `4px solid greenyellow`;
            }
            else{
                 highlighting_row = 1;
                 selected_rdice = 0;
                 let selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
                 selected_rdice_box.style.border = `4px solid greenyellow`;
            }
            
            
        }
        }else{
        //RDICE HIGHLIGHTING ZONE    
        if(event.key === 'ArrowUp'){
            // if(present_dice != 0){
            // let selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            // selected_rdice_box.style.border = `2px solid black`;
            // highlighting_row = 0;
            // selected_dice = selected_rdice <= present_dice-1 ? selected_rdice : present_dice-1;
            // let selected_dice_box = document.getElementById(`dice_` + selected_dice);
            // selected_dice_box.style.border = `4px solid greenyellow`;
            // }
            if(present_dice != 0){
                let selected_rdice_box = document.getElementById(`rdice_` +selected_rdice);
                selected_rdice_box.style.border = `2px solid black`;
                highlighting_row = 0;
                selected_dice = selected_rdice <= present_dice-1 ? selected_rdice : present_dice-1;
                let selected_dice_box = document.getElementById(`dice_` + (selected_dice <= 0 ? 0 : selected_dice));
                selected_dice_box.style.border = `4px solid greenyellow`;
            }
        }else if (event.key === 'ArrowRight') {
            // let selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            // selected_rdice_box.style.border = `2px solid black`;
            // selected_rdice = (selected_rdice + 1) % present_rdice;
            // selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            // selected_rdice_box.style.border = `4px solid greenyellow`;
            let selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
            selected_rdice_box.style.border = `2px solid black`;
            selected_rdice = (selected_rdice + 1) % present_rdice;
            selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
            selected_rdice_box.style.border = `4px solid greenyellow`;

        } else if (event.key === 'ArrowLeft') {
            // let selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            // selected_rdice_box.style.border = `2px solid black`;
            // selected_rdice = (selected_rdice + present_rdice - 1) % present_rdice;
            // selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            // selected_rdice_box.style.border = '4px solid greenyellow';
            let selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
            selected_rdice_box.style.border = `2px solid black`;
            selected_rdice = (selected_rdice + present_rdice - 1) % present_rdice;
            selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
            selected_rdice_box.style.border = '4px solid greenyellow';
        }
        if (event.key === 'Enter') {
            // selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            // selected_rdice_box.style.border = `2px solid black`;
            // present_rdice -= 1;

            // present_dice_list.push(present_rdice_list[selected_rdice]);
            // contained_dices[present_dice] = dices[present_rdice_list[selected_rdice]];
            // present_dice += 1;
            // showDices();
            // present_rdice_list.splice(selected_rdice, 1);
            // console.log(present_dice_list);
            // if (present_rdice === selected_rdice) {
            //     selected_rdice -= 1;
            // }
            // selected_rdice_box.style.display = 'none';
            // if (present_rdice != 0) {
            //     selected_rdice_box = document.getElementById(`rdice_` + present_rdice_list[selected_rdice]);
            //     selected_rdice_box.style.border = `4px solid greenyellow`
            // }else{
            //     highlighting_row = 0;
            //     selected_dice = 0;
            //     let selected_dice_box = document.getElementById(`dice_` + selected_dice);
            //     selected_dice_box.style.border = `4px solid greenyellow`;
            // }
            let selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
            contained_dices[present_dice] = dices[selected_rdice]
            present_dice += 1;
            showDices();
            dices.splice(selected_rdice, 1);
            dices.push(0);
            console.log(present_rdice);
            selected_rdice_box = document.getElementById(`rdice_` + (present_rdice-1));
            selected_rdice_box.style.display = 'none';
            present_rdice -= 1;
            if (present_rdice === selected_rdice) {
                selected_rdice -= 1;
            }
            showRDices();
            if(present_rdice != 0){
                selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
                selected_rdice_box.style.border = `4px solid greenyellow`;
            }else{
                highlighting_row = 0;
                selected_dice = 0;
                let selected_dice_box = document.getElementById(`dice_` + selected_dice);
                selected_dice_box.style.border = `4px solid greenyellow`;
            }
        }
        }
}
function initializeHighlighter(){
    if(highlighting_row ===1){
        let selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
        selected_rdice_box.style.border = `4px solid greenyellow`;
    }else{
        let selected_dice_box = document.getElementById(`dice_` + selected_dice);
        selected_dice_box.style.border = `4px solid greenyellow`;
    }
    document.addEventListener('keydown', highlighter); 
}
function initializeRoller(){
    var rolling_dices = document.getElementsByClassName('roll_dice')
        selected_dice = 0;
        selected_rdice = 0;
        roll_phase+=1;
        offallhighlights();
        document.removeEventListener('keydown', highlighter);
        show_roll_phase();
        for (var i = 0; i < rolling_dices.length; i++) {
            rolling_dices[i].classList.add('rolling');
        }

        setTimeout(function () {
            for (var i = 0; i < rolling_dices.length; i++) {
                rolling_dices[i].classList.remove('rolling');
            }
            if(present_dice === 5){
                highlighting_row = 0;
            }else{
                highlighting_row = 1;
            }
            showRollRDices();
            initializeHighlighter();
            if(roll_phase >= 3){
                document.getElementById('roll_button').style.display = 'none';
                document.removeEventListener('keydown', highlighter);
                offallhighlights();
                let temp = present_rdice;
                for(let i=0; i<temp; i++){
                    endroll();
                }
                initializePointBoard();
                return;
            }
        }, 200);
        
}
function endroll(){
    let selected_rdice_box = document.getElementById(`rdice_` + selected_rdice);
    contained_dices[present_dice] = dices[selected_rdice]
    present_dice += 1;
    showDices();
    dices.splice(selected_rdice, 1);
    dices.push(0);
    console.log();
    selected_rdice_box = document.getElementById(`rdice_` + (present_rdice-1));
    selected_rdice_box.style.display = 'none';
    present_rdice -= 1;
    if (present_rdice === selected_rdice) {
        selected_rdice -= 1;
    }
    showRDices();
}
window.onload = function () {
    var rollbutton = document.getElementById('roll_button');
    show_round();
    show_roll_phase();
    rollbutton.addEventListener('click', initializeRoller);
}

console.log('yay!');
