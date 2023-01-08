export const getType = (searchQuery) => {
    const searchText = searchQuery.toLowerCase();
    let result = "";
    if(searchText.startsWith("which")){result="choice";}
    else if(searchText.startsWith("how many")|| searchText.startsWith("how much") ){result="quantity"}
    else if(searchText.startsWith("when")){result="time"}
    else if(searchText.startsWith("where")){result="place"}
    else if(searchText.startsWith("which") || searchText.startsWith("do")){result="choice"}
    else if(searchText.startsWith("who") ){result="person"}
    else if(searchText.startsWith("whose")){result="ownership"}
    else if(searchText.startsWith("why")){result="reason"}
    else if(searchText.startsWith("is") || searchText.startsWith("does")){result="boolean"}
    else if(searchText.startsWith("what")){result="constitution"}
    return result;
}

export const getRandomQuestions = (questionsList, searchQuery) => {
    let newQuestionsList = [];
    //je parcours la liste des entités de question et si il y'a un mot en commun je retiens la question
    let matching = null;
    for(let question of questionsList){
        for(let entity of question.entity){
            matching = searchQuery.includes(entity);
            if(matching){
                newQuestionsList.push(question);
            };
            break;
        }
    }
    if(newQuestionsList.length < 7 ){
        newQuestionsList = questionsList;
    }
    const randQuestions = [];
    for(let i = 0 ; i < 5 ; i++){
        let randNumber = Math.trunc(Math.random() * newQuestionsList.length);
        randQuestions.push(questionsList[randNumber]);
    }
    return randQuestions;
}