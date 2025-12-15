const TaskInput = document.getElementById('taskInput'); //รับค่ามาจาก ID 
const TaskList = document.getElementById('taskList');

TaskInput.addEventListener('keydown', function(e){ // เป็น method จับเมื่อมีการกระทำใดๆ ในที่นี่คือจับจังหวะเมื่อผู้ใช้กด keyboard > keypress,keydown,keyup
    if(e.key === 'Enter'){
        addTask();
    }
});

function addTask(){
    TaskText = taskInput.value.trim(); //trim() เป็นการตัดช่องว่างออก , value เป็นการรับค่าจาก input
    if(TaskText === ""){
        alert('กรุณาป้อนรายการที่ต้องทำ');
        return;
    }
    // alert('okok');
    
    const newListItem = createListItem(TaskText);
    taskList.appendChild(newListItem);
    
    saveTasks();
    taskInput.value = "";
}

function createListItem(taskText){
    const listItem = document.createElement('li'); // CreateElement สร้าง element ใหม่
    listItem.textContent = taskText; // TextContent เป็นการเพิ่มข้อความลงใน element

    const  deleteBtn = document.createElement('button');
    deleteBtn.textContent= 'X';

    deleteBtn.onclick = function(e){
        e.stopPropagation(); // stopPropagation หยุดไม่ให้คลิกไหลไปยัง li
        taskList.removeChild(listItem);
        saveTasks();
    }

    listItem.appendChild(deleteBtn); //appendChild การเพิ่ม Element ลูกลงในแม่ <li>...<button>X</button></li>

    listItem.onclick = function(e){
        if (e.target.tagName != 'button'){ // target เป็นการตรวจสอบว่า คลิกที่ element ไหน tagName เป็นการตรวจสอบชื่อ tag ว่าเป็นอะไร
            listItem.classList.toggle('completed'); 
        }
    }
// classList
// คือ API สำหรับ จัดการ class ของ element
// เช่น เพิ่ม / ลบ / เช็ก class ได้ง่ายกว่าการเขียน className
// ตัวอย่างเมธอดที่ใช้บ่อย:
// add('completed') → เพิ่ม class
// remove('completed') → ลบ class
// contains('completed') → เช็กว่ามี class นี้ไหม
// toggle('completed') → สลับสถานะ

    return listItem;
}

function saveTasks(){
    localStorage.setItem('data',TaskList.innerHTML);
}

function ShowTask(){
    const SaveData = localStorage.getItem('data');
    if (SaveData){
        TaskList.innerHTML = SaveData;

        TaskList.querySelectorAll('li').forEach(item => {
            item.onclick = function(e){
            if (e.target.tagName != 'button'){
                item.classList.toggle('completed');
                saveTasks();
                }
            }

            const deleteBtn = item.querySelector('button');
            if (deleteBtn) {
                deleteBtn.onclick = function(e) {
                    e.stopPropagation();
                    taskList.removeChild(item);
                    saveTasks();
                };
            }
        });
    }
}

ShowTask();
