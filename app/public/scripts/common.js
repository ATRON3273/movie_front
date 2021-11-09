function requestGetAPI() {
    return axios.get(url)
    .catch(function (error) {
        console.log(error);
    });
}

function requestPostAPI(url, data){
    return axios.post(url, data)
    .catch(function (error) {
        console.log(error);
    });
}

function findId(id){
    return document.getElementById(id);
}
