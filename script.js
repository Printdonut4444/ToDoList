// ดึงองค์ประกอบ HTML ที่จำเป็นมาเก็บไว้ในตัวแปร
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// --- 1. ฟังก์ชันบันทึกข้อมูลไปที่ localStorage ---
function saveTasks() {
    // บันทึกเนื้อหา HTML ของ <ul> ทั้งหมด
    localStorage.setItem('data', taskList.innerHTML);
}

// --- 2. ฟังก์ชันหลักสำหรับสร้างรายการใหม่ ---
function createListItem(taskText, isCompleted = false) {
    // A. สร้างองค์ประกอบ <li>
    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    // ถ้าสถานะเป็นเสร็จแล้ว ให้เพิ่ม class 'completed'
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    // B. สร้างปุ่มลบ (Delete Button)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    
    // C. กำหนด Event Listener ให้ปุ่มลบ
    deleteBtn.onclick = function(e) {
        e.stopPropagation(); // ป้องกันไม่ให้ Event ไปทำงานที่ <li>
        taskList.removeChild(listItem);
        saveTasks(); // บันทึกทุกครั้งที่มีการลบ
    };

    // D. กำหนด Event Listener สำหรับแก้ไขและทำเครื่องหมายเสร็จ
    attachSingleListener(listItem);

    // E. นำปุ่มลบไปใส่ในรายการ <li>
    listItem.appendChild(deleteBtn);
    
    return listItem;
}

// --- 3. ฟังก์ชันเพิ่มรายการ (เรียกใช้เมื่อกดปุ่ม "เพิ่ม" หรือกด Enter) ---
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("กรุณาป้อนรายการที่ต้องทำ!");
        return;
    }

    const newListItem = createListItem(taskText);
    taskList.appendChild(newListItem);

    saveTasks(); // บันทึกข้อมูล
    taskInput.value = ""; // ล้างช่อง input
}

// --- 4. ฟังก์ชันสำหรับแนบ Event Listeners ให้รายการ (คลิกเสร็จ, ดับเบิลคลิกแก้ไข) ---
function attachSingleListener(listItem) {
    // 4.1. คลิกเพื่อทำเครื่องหมายว่าเสร็จแล้ว
    listItem.onclick = function(e) {
        // ตรวจสอบว่าไม่ได้คลิกที่ปุ่ม (เนื่องจากปุ่มมีการจัดการ Event แยกไปแล้ว)
        if (e.target.tagName !== 'BUTTON') { 
            listItem.classList.toggle('completed');
            saveTasks(); // บันทึกสถานะเสร็จ
        }
    };
    
    // 4.2. ดับเบิลคลิกเพื่อแก้ไขข้อความ
    listItem.ondblclick = function() {
        // ดึงข้อความปัจจุบัน (ลบ 'X' ออกไป)
        const currentText = listItem.textContent.slice(0, -1).trim(); 
        const isCompleted = listItem.classList.contains('completed');
        
        // 1. สร้างช่อง input ชั่วคราว
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.className = 'edit-input';
        
        // 2. แทนที่เนื้อหาเดิมด้วยช่อง input
        listItem.innerHTML = '';
        listItem.appendChild(editInput);
        editInput.focus(); 

        // 3. ฟังก์ชันบันทึกการแก้ไข
        const saveEdit = function() {
            const newText = editInput.value.trim();
            if (newText) {
                // สร้างรายการใหม่ด้วยข้อความที่แก้ไขและสถานะเดิม
                const updatedItem = createListItem(newText, isCompleted);
                
                // แทนที่รายการเก่าด้วยรายการที่แก้ไข
                taskList.replaceChild(updatedItem, listItem); 

                saveTasks(); // บันทึกการเปลี่ยนแปลง
            }
        };

        // 4. กำหนด Event เมื่อแก้ไขเสร็จ (คลิกออก/กด Enter)
        editInput.addEventListener('blur', saveEdit);
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    };
}

// --- 5. ฟังก์ชันแสดงรายการที่บันทึกไว้ (เมื่อเปิดหน้าเว็บ) ---
function showTask() {
    // ดึงข้อมูลที่บันทึกไว้
    const savedData = localStorage.getItem('data');
    if (savedData) {
        // ถ้ามีข้อมูล ให้แสดงผล
        taskList.innerHTML = savedData;
        
        // ต้องแนบ Event Listeners ใหม่ทั้งหมด
        taskList.querySelectorAll('li').forEach(item => {
            // Re-attach listeners for existing items
            attachSingleListener(item); 
            
            // Re-attach listener for the delete button inside each li
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

// โบนัส: ทำให้กด Enter ในช่อง input เพื่อเพิ่มรายการได้
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// *เริ่มใช้งาน: เรียกฟังก์ชันโหลดรายการทันทีเมื่อเปิดหน้า*
showTask();