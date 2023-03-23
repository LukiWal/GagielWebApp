export const generateId=(length, useLowerCaseCharacters)=>{
    let result = '';

    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if(useLowerCaseCharacters){
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }
    
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result; 
}

