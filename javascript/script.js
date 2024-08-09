// const response = ajax({
//     url:'/php/banco.php',
//     method: 'GET',
// })

// fetch('/php/banco.php') 
//     .then((response)=>{
//         console.log (response)
//     })
//     .catch((error)=>{
//         console.log(error)
//     })

fetch('/php/banco.php') 
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response; 
    })
    .then((data) => {
        console.log(data, 'a');
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });