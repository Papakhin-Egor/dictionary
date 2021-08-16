const $adminContainer = document.querySelector("#adminMain");
const $userEditForm = document.querySelector("#userEditForm");

if ($adminContainer) {
  $adminContainer.addEventListener("click", async (el) => {
    el.preventDefault();
    //кнопка удалить юзера
    if (el.target.getAttribute("class") === "deleteButton") {
      const id = el.target.parentElement.parentElement.id;
      console.log('--------------------------', id);
      const response = await fetch(`/admin/${id}`, {
        method: "DELETE",
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 200) {
        el.target.parentElement.parentElement.remove();
      }
    }
    // для ссылок
    if (el.target.getAttribute("class") === "editButton") {
      window.location = `/admin/edit/${el.target.parentElement.parentElement.id}`;
    }
  });
}

if ($userEditForm) {
  $userEditForm.addEventListener("click", async (el) => {
    el.preventDefault();

    //кнопка редактировать юзера
    const formData = Object.fromEntries(new FormData($userEditForm))
    // console.log('------------>',formData);
  if(el.target.getAttribute("class") === "btn btn-primary loginBtn loginStyle") {
  const id = el.target.id
  const response = await fetch(`/admin/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: formData.email,
      name: formData.name,
      role: formData.role,
      password: formData.password,
      room: formData.room
    })
  });
  const result = await response.json();
  if (result.editStatus === 200) {
    window.location = `/admin/`;
  }
  if (result.editStatus !== 200) {
    alert("cant edit user(back горит)")
  }
    }
  });
}

