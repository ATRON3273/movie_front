export function fill_code(str){
    return new Array(16-str.length).join('_') + str;
}