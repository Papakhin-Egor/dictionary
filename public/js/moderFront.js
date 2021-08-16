const $moderContainer = document.querySelector("#moderMain");
const $editForm = document.querySelector("#moderEditForm");

if($moderContainer) {
  $moderContainer.addEventListener("click", async (el) => {
  el.preventDefault();
  //кнопка удалить юзера
  if (el.target.getAttribute("class") === "deleteButton") {
    const id = el.target.parentElement.parentElement.id;
    const response = await fetch(`/moder/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json();
    if (result.status === 200) {
      el.target.parentElement.parentElement.remove();
    }
  }
  // для ссылок
  if (el.target.getAttribute("class") === "editButton") {
    window.location = `/moder/edit/${el.target.parentElement.parentElement.id}`
  }
})
}

if($editForm) {
  $editForm.addEventListener("click", async (el) => {
    el.preventDefault();
    //кнопка редактировать юзера
  const formData = Object.fromEntries(new FormData($editForm))
  if(el.target.getAttribute("class") === "btn btn-primary loginBtn loginStyle") {
  const id = el.target.id
  const response = await fetch(`/moder/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: formData.email,
      name: formData.name,
      password: formData.password,
      room: formData.room
    })
  });
  const result1 = await response.json();
  if (result1.status === 200) {
    window.location = `/moder/`;
  }
  if (result1.status !== 200) {
    alert("cant edit user(back горит)")
  }
    }  

  } )
}

