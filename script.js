const CTF_DATA = {
  "steganography": {
    title: "Steganography",
    description: "Hidden message challenges in images, audio, text, or files.",
    challenges: [
      {
        id: "steg-001",
        title: "Hidden in Plain Sight",
        difficulty: "Easy",
        instruction: "Download the image and check whether there is a hidden message inside it. Look at metadata first, then try common steg methods.",
        files: [
          { name: "steg-hidden-note.txt", path: "files/steg-hidden-note.txt" }
        ],
        flag: "flag{hidden_message_found}"
      },
      {
        id: "steg-002",
        title: "Pixel Whisper",
        difficulty: "Medium",
        instruction: "A clue may be stored in the least expected layer. Try extracting text or strings from the provided file.",
        files: [],
        flag: "flag{pixels_talk}"
      }
    ]
  },
  "cryptography": {
    title: "Cryptography",
    description: "Encoding, hashing, substitution, and classic crypto puzzles.",
    challenges: [
      {
        id: "crypto-001",
        title: "Caesar Again",
        difficulty: "Easy",
        instruction: "A text has been shifted. Identify the rotation and recover the plaintext.",
        files: [
          { name: "crypto-caesar.txt", path: "files/crypto-caesar.txt" }
        ],
        flag: "flag{rotation_13_done}"
      },
      {
        id: "crypto-002",
        title: "Hash Hunt",
        difficulty: "Medium",
        instruction: "You are given a weak password hash. Crack it using a suitable wordlist or logic.",
        files: [],
        flag: "flag{hash_cracked}"
      }
    ]
  },
  "re": {
    title: "Reverse Engineering",
    description: "Static and dynamic analysis of programs or scripts.",
    challenges: [
      {
        id: "re-001",
        title: "Crack Me Mini",
        difficulty: "Easy",
        instruction: "Inspect the script or binary logic and determine the accepted secret.",
        files: [
          { name: "re-crackme.py", path: "files/re-crackme.py" }
        ],
        flag: "flag{reverse_success}"
      }
    ]
  },
  "forensic": {
    title: "Forensic",
    description: "Investigate artifacts, logs, memory, and disk evidence.",
    challenges: [
      {
        id: "forensic-001",
        title: "Case File 01",
        difficulty: "Easy",
        instruction: "Review the evidence file and identify the suspicious username.",
        files: [
          { name: "forensic-evidence.txt", path: "files/forensic-evidence.txt" }
        ],
        flag: "flag{analyst_found_it}"
      }
    ]
  },
  "malware": {
    title: "Malware",
    description: "Safe analysis-style challenges about suspicious scripts and indicators.",
    challenges: [
      {
        id: "malware-001",
        title: "Suspicious Script",
        difficulty: "Medium",
        instruction: "Review the script and identify the hardcoded command-and-control domain or malicious behavior clue.",
        files: [
          { name: "malware-sample.py", path: "files/malware-sample.py" }
        ],
        flag: "flag{c2_domain_spotted}"
      }
    ]
  }
};

const categoryGrid = document.getElementById("category-grid");
const categoryView = document.getElementById("category-view");
const challengeView = document.getElementById("challenge-view");
const categoryTitle = document.getElementById("category-title");
const categoryDesc = document.getElementById("category-desc");
const challengeList = document.getElementById("challenge-list");
const backBtn = document.getElementById("back-btn");

function renderCategories() {
  categoryGrid.innerHTML = "";
  Object.entries(CTF_DATA).forEach(([key, value]) => {
    const card = document.createElement("div");
    card.className = "card clickable";
    card.innerHTML = `
      <h3>${value.title}</h3>
      <p>${value.description}</p>
    `;
    card.addEventListener("click", () => openCategory(key));
    categoryGrid.appendChild(card);
  });
}

function openCategory(key) {
  const category = CTF_DATA[key];
  categoryTitle.textContent = category.title;
  categoryDesc.textContent = category.description;
  challengeList.innerHTML = "";

  category.challenges.forEach((challenge) => {
    const wrapper = document.createElement("div");
    wrapper.className = "challenge-card";

    const fileHtml = challenge.files.length
      ? `<div class="file-list"><strong>Files:</strong><ul>${challenge.files.map(file => `<li><a href="${file.path}" download>${file.name}</a></li>`).join("")}</ul></div>`
      : `<div class="file-list"><strong>Files:</strong> <span class="muted">No file provided</span></div>`;

    wrapper.innerHTML = `
      <span class="badge">${challenge.difficulty}</span>
      <h3>${challenge.title}</h3>
      <div class="challenge-meta">Challenge ID: ${challenge.id}</div>
      <div><strong>Instruction:</strong></div>
      <div class="instruction-box">${challenge.instruction}</div>
      ${fileHtml}
      <div class="verify-area">
        <input type="text" id="input-${challenge.id}" placeholder="Enter flag, example: flag{...}" />
        <button class="btn primary" data-id="${challenge.id}">Verify Flag</button>
      </div>
      <div id="result-${challenge.id}" class="result"></div>
    `;

    challengeList.appendChild(wrapper);
  });

  challengeList.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", () => verifyFlag(button.dataset.id));
  });

  categoryView.classList.add("hidden");
  challengeView.classList.remove("hidden");
}

function verifyFlag(challengeId) {
  const input = document.getElementById(`input-${challengeId}`);
  const result = document.getElementById(`result-${challengeId}`);
  const typed = input.value.trim();

  let expected = null;
  Object.values(CTF_DATA).forEach(category => {
    category.challenges.forEach(challenge => {
      if (challenge.id === challengeId) expected = challenge.flag;
    });
  });

  if (!typed) {
    result.textContent = "Please enter a flag first.";
    result.className = "result bad";
    return;
  }

  if (typed === expected) {
    result.textContent = "Correct flag. Well done.";
    result.className = "result ok";
  } else {
    result.textContent = "Wrong flag. Try again.";
    result.className = "result bad";
  }
}

backBtn.addEventListener("click", () => {
  challengeView.classList.add("hidden");
  categoryView.classList.remove("hidden");
});

renderCategories();
