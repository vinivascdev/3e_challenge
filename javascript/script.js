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
    
    function submitForm() {
        var form = document.getElementById('myForm');
        var formData = new FormData(form);

        fetch('banco.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('response').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }