const hasilCalc = document.querySelector("#hasil-calc"); // nangkep elemen dengan id hasil-calc

const currentNumber = new Proxy(
  {
    value: "0",
  },
  {
    // digunakan agar ketika value berubah maka function renderResult akan terpanggil secara otomatis.
    set(target, prop, newValue) {
      if (target[prop] === newValue) return false; // jika state sekarang hasilnya sama dengan newValue maka jangan lakukan apapun agar tidak melakukan rerendering walau datanya sama atau tidak berubah. Istilah nya mubazir oakwkwk.
      target[prop] = newValue;
      renderResult();
      return true;
    },
  },
); // state angka di kalkulator, bisa diisi angka dan operand.

/**
 * Digunakan untuk menambahkan angka ke state currentNumber
 * @param {string} number
 */
function addNumber(number) {
  if (currentNumber.value === "0") {
    currentNumber.value = number;
  } else {
    currentNumber.value = currentNumber.value + number;
  }
}

/**
 * Digunakan untuk menambahkan kurung buka ke state currentNumber
 */
function addKurungBuka() {
  if (currentNumber.value === "0") {
    currentNumber.value = "(";
  } else {
    currentNumber.value = currentNumber.value + "(";
  }
}
/**
 * Digunakan untuk menambahkan kurung tutup ke state currentNumber
 */
function addKurungTutup() {
  if (currentNumber.value === "0") {
    currentNumber.value = ")";
  } else {
    currentNumber.value = currentNumber.value + ")";
  }
}

/**
 * Digunakan untuk menambahkan operand minus ke dalam state currentNumber
 * @returns void
 */
function minus() {
  if (checkSymbol()) return;
  if (currentNumber.value === "0") {
    currentNumber.value = "-";
  } else {
    currentNumber.value = currentNumber.value + "-";
  }
}

/**
 * Digunakan untuk menambahkan operand bagi ke dalam state currentNumber
 * @returns void
 */
function divide() {
  if (currentNumber.value === "0" || checkSymbol()) return;
  currentNumber.value = currentNumber.value + "÷";
}

/**
 * Digunakan untuk menambahkan operand tambah ke dalam state currentNumber
 * @returns void
 */
function plus() {
  if (currentNumber.value === "0" || checkSymbol()) return;
  currentNumber.value = currentNumber.value + "+";
}

/**
 * Digunakan untuk menghapus entah itu angka atau operand di state currentNumber
 * @returns void
 */
function deleteNum() {
  if (currentNumber.value === "0") return;
  currentNumber.value = currentNumber.value.slice(0, -1);
  if (currentNumber.value == "") {
    currentNumber.value = "0";
  }
}

/**
 * Digunakan untuk menambahkan operand kali ke dalam state currentNumber
 * @returns void
 */
function times() {
  if (currentNumber.value === "0" || checkSymbol()) return;
  currentNumber.value = currentNumber.value + "x";
}

/**
 * Digunakan untuk menambahkan titik ke dalam state currentNumber
 */
function titik() {
  if (checkSymbol()) return;
  currentNumber.value = currentNumber.value + ",";
}

/**
 * Digunakan untuk membersihkan number di dalam state currentNumber
 */
function clearNumber() {
  currentNumber.value = "0";
}

/**
 * Format angka agar gampang dibaca
 * @param {string} number
 */
function formatAngka(number) {
  if (number.includes(",")) return number; // jika ada , di number maka return number atau jangan lakukan apapun terhadap number.
  // split angka dan operator
  return number.replace(/\d+/g, (num) => {
    // format tiap angka ribuan
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  });
}

/**
 * Digunakan untuk merender state currentNumber
 */
function renderResult() {
  hasilCalc.innerHTML = ""; // membersihkan isi html div hasil-calc
  const p = document.createElement("p"); // membuat element p baru
  const formattedCurrentNumber = formatAngka(currentNumber.value); // melakukan format angka terlebih dahulu
  const textNode = document.createTextNode(formattedCurrentNumber); // membuat text node dengan isi angka yg sudah di format
  p.appendChild(textNode); // memasukkan text node kedalam elemen p
  hasilCalc.appendChild(p); // memasukkan elemen p ke dalam div hasil-calc
}

/**
 * Fungsi yg mengkalkulasi operasi yg ada di currentNumber lalu hasilnya di masukkan kembali ke currentNumber
 */
function equals() {
  const number = currentNumber.value.replace(/[x÷,]/g, (match) => {
    return match === "x" ? "*" : match === "," ? "." : "/";
  }); // memfilter jika ada simbol x, ÷, dan , maka ganti dengan x = *, ÷ = /, dan , = . agar bisa di eksekusi oleh javascript tanpa error.
  const hasilRaw = number.replace(/\./gm, ""); // memfilter jika ada ... maka hapus aja.
  const hasil = new Function(`return ${hasilRaw}`)()
    .toString()
    .replace(/[.]/g, ","); // mengeksekusi hasilRaw, diubah ke string, lalu di filter jika ada . maka ganti dengan ,

  if (hasil.length > 12) {
    currentNumber.value = hasil.slice(0, 12) + "...";
  } else {
    currentNumber.value = hasil;
  }
}

/**
 * Digunakan untuk mengecek apakah di kata terakhir ada simbol operand
 * @returns boolean
 */
function checkSymbol() {
  const symbol = currentNumber.value.at(-1); // mengambil karakter terakhir dari currentNumber.
  if (
    symbol == "x" ||
    symbol == "-" ||
    symbol == "+" ||
    symbol == "÷" ||
    symbol == ","
  )
    return true;
  return false;
}

// Menjalankan render pertama kali
renderResult();
