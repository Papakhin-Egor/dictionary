const searchForm = document.querySelector(".search");
const body = document.querySelector("body");
const postWrapper = document.querySelector(".wrapper_card");
const searchInput = searchForm.querySelector("input");
let id;

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const posts = await fetch("/roompage", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .catch((e) => {
      searchInput.value = "";
      postWrapper.innerHTML = "";
      console.log("нет таких постов");
    });

  searchInput.value = "";
  postWrapper.innerHTML = "";

  // console.log(posts);
  posts.forEach((post) => {
    createPostcard(post);
  });
});

postWrapper.addEventListener("click", async (e) => {
  e.preventDefault();
  const target = e.target;

  if (target.tagName === "BUTTON") {
    id = target.parentElement.getAttribute("data-id");

    const { cards, findComments, currLink } = await fetch(
      `/roompage/${id}`
    ).then((res) => res.json());
    const link = currLink[0].link;
    const post = { ...cards, link };

    createModal(post);
  }
});

function createPostcard(data) {
  const div = document.createElement("div");

  div.classList.add("card");
  div.innerHTML = `
        <h2 class="cardTitle">${data.title}</h2>
        <div class="descript">
        <p>${data.discription}</p>
        </div>
        <button class="loginStyle cardBtn">Look more</button>
    `;

  postWrapper.append(div);
}

function createModal(data) {
  const div = document.createElement("div");

  div.classList.add("modalWrapper");
  div.innerHTML = `
        <div class="commentsContainer">
          <div class="commentModal">
            <div class="modalTitle">
                <h2>${data.title}</h2>
            </div>

            <div class="descHowUseContainer">
                
                <div class="modalDescriptionHowUse modalText">
                <p class="loginLabel">Description</p>
                <p class="descr">${data.discription}</p>
                
                </div>
                <div class="modalDescriptionHowUse modalText">
                    <p class="loginLabel">Applying</p>
                    <p class="applying">${data.applying}</p>
                    <a class="link">${data.link}</a>
                </div>
            </div>
           

            
            <div class="closeWrapper">
                <span class="close closeModal"></span>
            </div>
          </div>
          <div class="commentTextInput">
            <textarea class='commentArea'></textarea>
             <button class="commentBtnArea commentBtn  modalPush loginStyle  loginBtn">Отправить</button>
          </div>
        </div>
    `;

  body.append(div);

  const commentBtn = document.querySelector(".commentBtnArea");
  const textarea = document.querySelector(".commentArea");
  const commentsContainer = document.querySelector(".commentsContainer");
  const closeBtn = document.querySelector(".close");

  closeBtn.addEventListener("click", () => {
    div.remove();
  });

  commentBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const inputText = textarea.value;

    const post = await fetch(`/roompage/${data.id}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ inputText }),
    }).then((res) => {
      textarea.value = "";
      return res.json();
    });

    const div = document.createElement("div");
    const { comment } = post;

    div.classList.add("commentTextInput");
    div.innerHTML = `<p class="comment">${comment}</p>`;

    commentsContainer.append(div);
  });
}
