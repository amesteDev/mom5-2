//create som functions for more compact code later
const createNode = (element) => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);
const getEl = (el) => document.getElementById(el);

//set up some variables that are used in the code
const output = document.getElementById("kram");
const stdurl = 'http://amhax.se/mom5/api/index.php'
const methods = ['GET', 'POST', 'PUT', 'DELETE'];

//not really needed to do this with a class, but wanted to try it out
class callData {
    constructor(code, name, prog, syllabus) {
        this.code = code;
        this.name = name;
        this.prog = prog;
        this.syllabus = syllabus;
    }
}

//here all calls to the API is made with fetch
//if the method is not GET it sends some headers and a body in the request
//if the method is GET only the get request is sent
//when we recieve a response it returned to the function that called it
const fetchCall = async(url, methodToUse, bodyData) => {
    if (methodToUse !== 'GET') {
        return data = fetch(url, {
                method: methodToUse,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            })
            .then(response => response.json())
    } else {
        return data = fetch(url)
            .then(response => response.json())
    }
}

//big chunky function to handle the response of a get request and display the data on the site
const fetchCourse = async() => {
    let data = await fetchCall(stdurl, methods[0])
    output.innerHTML = '';
    data.map(course => {
        let tr = createNode('tr');
        Object.keys(course).forEach(key => {
            let td = createNode('td');
            let text = document.createTextNode(course[key]);
            append(td, text);
            append(tr, td);
            td.classList.add(key);
            td.setAttribute('contenteditable', 'true');
        });
        let aC = createNode('a');
        let aCtext = document.createTextNode('Kursplan');
        aC.setAttribute('href', course.syllabus);
        aC.setAttribute('target', '_blank');
        append(aC, aCtext);
        append(tr, aC);
        let upButton = createNode('button');
        let deButton = createNode('button');
        let btext = document.createTextNode('Uppdatera');
        let dtext = document.createTextNode('Ta bort');
        append(upButton, btext);
        append(deButton, dtext);
        append(tr, upButton);
        append(tr, deButton);
        append(output, tr);
        upButton.addEventListener('click', () => {
            updateCourse(upButton.parentNode.getElementsByTagName('td'));
        })
        deButton.addEventListener('click', () => {
            deleteCourse(upButton.parentNode.getElementsByTagName('td'));
        })
    });
}

//constructs the body data and returns it as an new instance of the class callData
const constructData = (code) => {
    let i = 0;
    let dataSet = [];
    while (i < code.length) {
        dataSet[code[i].classList.value] = code[i].innerText || code[i].value;
        i++;
    }
    return returnData = new callData(dataSet.code, dataSet.name, dataSet.prog, dataSet.syllabus);
}

//gets the data from the form and constructs it with constructData to and then sends the returned data
//to the addCourse function afterwards resets the form
const formEle = document.getElementById('form');
formEle.addEventListener('submit', (event) => {
    constructData(formEle);
    addCourse(returnData);
    formEle.reset();
    event.preventDefault();
})

//uses fetchCall to send request to API and then displays the returned message in a popup
const addCourse = async(toAdd) => {
    let data = await fetchCall(stdurl, methods[1], toAdd)
    popup(data.message);
    fetchCourse();
}

//uses fetchCall to send request to API and then displays the returned message in a popup
//before sending data it gets a instance of the class callData
const updateCourse = async(code) => {
    let toUpdate = constructData(code);
    let data = await fetchCall(stdurl, methods[2], toUpdate);
    popup(data.message);
    fetchCourse();

}

//uses fetchCall to send request to API and then displays the returned message in a popup
//before sending data it gets a instance of the class callData
const deleteCourse = async(code) => {
    let toDelete = constructData(code);
    let data = await fetchCall(stdurl, methods[3], toDelete);
    popup(data.message);
    fetchCourse();
}

//the popup is displayed for 3 seconds with message sent to it.
const popup = (message) => {
    let popup = getEl("popup");
    popup.innerHTML = `<p>${message}</p>`
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

//when it loads, fetch the courses and display them.
window.onload = fetchCourse();