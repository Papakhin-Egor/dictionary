const searcForm = document.querySelector(".search");
const body = document.querySelector("body");
const postWrapper = document.querySelector(".wrapper_card");
const searchInput = searcForm.querySelector("input");

searcForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const posts = await fetch("/mainpage", {
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

  posts.forEach((post) => {
    createPostcard(post);
  });
});

postWrapper.addEventListener("click", async (e) => {
  e.preventDefault();
  const target = e.target;

  if (target.tagName === "BUTTON") {
    const id = target.parentElement.getAttribute("data-id");

    const { currCard, currLink } = await fetch(`/mainpage/${id}`).then((res) =>
      res.json()
    );
    const newPost = { ...currCard, ...currLink };

    createModal(newPost);
  }
});

if (document.querySelector(".createPostcardBtn")) {
  const createBtn = document.querySelector(".createPostcardBtn");

  createBtn.addEventListener("click", async (e) => {
    createCard();
  });
}

function sortLettersCreate(arrLetters, language) {
  const letters = arrLetters.split("");
  const div = document.querySelector(language);

  letters.forEach((letter) => {
    const a = document.createElement("a");
    a.setAttribute("href", `/mainpage?letter=${letter}`);
    a.setAttribute("class", "letter");
    a.innerText = `${letter}`;

    a.addEventListener("click", async (e) => {
      e.preventDefault();

      const url = e.target.getAttribute("href");
      const posts = await fetch(url).then((res) => res.json());
      
      postWrapper.innerHTML = "";

      posts.forEach((post) => {
        createPostcard(post);
      });
    });

    div.append(a);
  });
}

function createPostcard(data) {
  const div = document.createElement("div");

  div.classList.add("card");
  div.innerHTML = `
        <div class="title">
            <h2 class="cardTitle">${data.title}</h2>
        </div>
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
        <div class="createModal">
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
        
            <button class="modalPush loginStyle loginBtn">Push</button>
            <div class="closeWrapper">
                <span class="close closeModal"></span>
            </div>
        </div>
  `;

  body.append(div);

  const modalBtn = document.querySelector(".modalPush");
  const closeBtn = document.querySelector(".close");

  closeBtn.addEventListener("click", () => {
    div.remove();
  });

  modalBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    await fetch(`/mainpage/${data.id}`, {
      method: "POST",
      body: data.id,
    })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            div.remove();
          }, 3000);
        }
      })
      .catch((e) => {});
  });
}

function createCard() {
  const div = document.createElement("div");

  div.classList.add("modalWrapper");
  div.innerHTML = `
  <div class="createPostcard">
            <h2 class="createTitle">Create Postcard</h2>

        <form action="/mainpage/createpostcard" method="POST" class="createForm">
            <input
                class="loginStyle"
                type="text"
                placeholder="Title"
                name="title"
            />

            <textarea
                class="textArea"
                type="text"
                placeholder="Description"
                name="discription"
            ></textarea>

            <textarea
                class="textArea"
                type="text"
                placeholder="HowUse"
                name="applying"
            ></textarea>

            <textarea
                class="textArea"
                type="text"
                placeholder="Links"
                name="link"
            ></textarea>

            <button id="createCard" class="createCardButton loginStyle">Create</button>
        </form>
        <div class="closeWrapper">
            <span class="close"></span>
        </div>
      </div>`;

  body.append(div);

  const form = document.querySelector(".createCardButton").parentElement;
  const closeBtn = document.querySelector(".close");

  closeBtn.addEventListener("click", () => {
    div.remove();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    await fetch(`/mainpage/createpostcard`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        createPostcard(res);
        setTimeout(() => {
          div.remove();
        }, 3000);
      })
      .catch((e) => {});
  });
}

const engLet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rusLet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ";
sortLettersCreate(engLet, ".engLang");
sortLettersCreate(rusLet, ".rusLang");
