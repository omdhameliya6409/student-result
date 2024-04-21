let id = -1;

const appendDataForm = (ele) => {
    document.getElementById("name").value = ele.name;
    document.getElementById("number").value = ele.number;
    document.getElementById("Hindi").value = ele.Hindi;
    document.getElementById("English").value = ele.English;
    document.getElementById("Maths").value = ele.Maths;
    id = ele.id;
};

const uimaker = (data) => {
    document.getElementById("box").innerHTML = "";
    data.forEach((ele, i) => {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerHTML = ele.name;
        let td2 = document.createElement("td");
        td2.innerHTML = ele.number;
        let td3 = document.createElement("td");
        td3.innerHTML = ele.Hindi;
        let td4 = document.createElement("td");
        td4.innerHTML = ele.English;
        let td5 = document.createElement("td");
        td5.innerHTML = ele.Maths;
        let td6 = document.createElement("td");
        let tScore = add(ele.Hindi, ele.English, ele.Maths);
        td6.innerHTML = tScore;
        let td7 = document.createElement("td");
        td7.innerHTML = Result(tScore);
        let td8 = document.createElement("td");
        td8.innerHTML = "UPDATE";
        td8.classList.add("green-button");
        td8.addEventListener("click", () => appendDataForm(ele));
        let td9 = document.createElement("td");
        td9.innerHTML = "DELETE";
        td9.classList.add("red-button");
        td9.addEventListener("click", () => {
            deleteData(ele.id);
        });
        tr.append(td1, td2, td3, td4, td5, td6, td7, td8, td9);
        document.getElementById("box").append(tr);
    });
};
const deleteData = (id) => {
    fetch(`http://localhost:3000/student/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error("Failed to delete data");
    })
    .then(response => {
        console.log("Data deleted successfully:", response);
        // Fetch data again from the server after successful deletion
        fetch("http://localhost:3000/student")
            .then(res => res.json())
            .then(data => {
                uimaker(data);
            })
            .catch(error => {
                console.error("Error fetching data after deletion:", error);
            });
    })
    .catch(error => {
        console.error("Error deleting data:", error);
    });
};

const add = (hindi, english, Maths) => {
    return parseInt(hindi) + parseInt(english) + parseInt(Maths);
};

const Result = (tScore) => {
    if (tScore >= 250) {
        return '<span style="color: white; background-color: green;">Pass</span>';
    } else {
        return '<span style="color: white; background-color: red;">Fail</span>';
    }
};

fetch("http://localhost:3000/student")
    .then(res => res.json())
    .then(data => {
        uimaker(data);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

const student = (data) => {
    fetch("http://localhost:3000/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        console.log("Student data submitted successfully:", response);
    })
    .catch(error => {
        console.error("Error submitting student data:", error);
    });
};

const updateData = (id, data) => {
    fetch(`http://localhost:3000/student/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        console.log("Data updated successfully:", response);
    })
    .catch(error => {
        console.error("Error updating data:", error);
    });
};

const handleData = (e) => {
    e.preventDefault();
    let data = {
        name: document.getElementById("name").value,
        number: document.getElementById("number").value,
        Hindi: document.getElementById("Hindi").value,
        English: document.getElementById("English").value,
        Maths: document.getElementById("Maths").value
    };

    const rollNumberRegex = /^\d{2}$/;
    if (!rollNumberRegex.test(data.number)) {
        alert("Roll number should be exactly 2 digits.");
        return;
    }
    if (data.Hindi === "" || parseInt(data.Hindi) > 100) {
        alert("Hindi score should be a number between 0 and 100.");
        return;
    }
    if (data.English === "" || parseInt(data.English) > 100) {
        alert("English score should be a number between 0 and 100.");
        return;
    }
    if (data.Maths === "" || parseInt(data.Maths) > 100) {
        alert("Maths score should be a number between 0 and 100.");
        return;
    }
    if (id !== -1) {
        updateData(id, data);
    } else {
        student(data);
    }
};

document.getElementById("form").addEventListener("submit", handleData);