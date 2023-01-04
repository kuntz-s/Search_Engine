export const getType = (searchQuery) => {
    const searchText = searchQuery.toLowerCase();
    let result = "";
    if(searchText.startsWith("which")){result="choice";}
    else if(searchText.startsWith("how many")|| searchText.startsWith("how much") ){result="quantity"}
    else if(searchText.startsWith("when")){result="time"}
    else if(searchText.startsWith("where")){result="place"}
    else if(searchText.startsWith("which")){result="choice"}
    else if(searchText.startsWith("who") ){result="person"}
    else if(searchText.startsWith("whose")){result="ownership"}
    else if(searchText.startsWith("why")){result="reason"}
    return result;
}

export const getRandomQuestions = (questionsList) => {
    const randQuestions = [];
    for(let i = 0 ; i < 5 ; i++){
        let randNumber = Math.trunc(Math.random() * questionsList.length);
        randQuestions.push(questionsList[randNumber]);
    }
    console.log(randQuestions);
}