class PasswordGenerator {
  constructor() {
    this.length = 10;

    // Initialize the app
    this.init();
  }
  
  init() {
    // DOM Elements
    this.output = document.getElementById("password-output");
    this.copyBtn = document.getElementById("copy-btn");
    this.copyImage = document.getElementById("copy-img");
    this.lengthSlider = document.getElementById("length-slider");
    this.lengthValue = document.getElementById("length-value");
    this.uppercaseCheckbox = document.getElementById("uppercase");
    this.lowercaseCheckbox = document.getElementById("lowercase");
    this.numbersCheckbox = document.getElementById("numbers");
    this.symbolsCheckbox = document.getElementById("symbols");
    this.generateBtn = document.getElementById("generate-btn");
    this.tooWeak = document.querySelector(".too-weak");
    this.weak = document.querySelector(".weak");
    this.medium = document.querySelector(".medium");
    this.strong = document.querySelector(".strong");
    this.strenghtText = document.querySelector(".strength-text");
    this.notifyCopied = document.querySelector(".notify-copy");

    // Event Listeners
    this.lengthSlider.addEventListener("input", (e) => this.updateLength(e.target.value));
    this.generateBtn.addEventListener("click", () => this.generatePassword());
    this.copyBtn.addEventListener("click", () => this.copyToClipboard());
  }

  // Helper function: Generate character set from Unicode range
  generateCharset(start, end) {
    let charset = "";
    for (let i = start; i <= end; i++) {
      charset += String.fromCharCode(i);
    }
    return charset;
  }

  // Helper function: Combine selected character sets
  getAvailableChars() {
    let availableChars = "";

    if (this.uppercaseCheckbox.checked) {
      availableChars += this.generateCharset(65, 90); // A-Z
    }

    if (this.lowercaseCheckbox.checked) {
      availableChars += this.generateCharset(97, 122); // a-z
    }

    if (this.numbersCheckbox.checked) {
      availableChars += this.generateCharset(48, 57); // 0-9
    }

    if (this.symbolsCheckbox.checked) {
      availableChars += this.generateCharset(33, 47); // Symbols: ! to /
      availableChars += this.generateCharset(58, 64); // Symbols: : to @
      availableChars += this.generateCharset(91, 96); // Symbols: [ to `
      availableChars += this.generateCharset(123, 126); // Symbols: { to ~
    }

    return availableChars;
  }

    updateLength(length) {
      
    const value = this.lengthSlider.value;
    const min = this.lengthSlider.min;
    const max = this.lengthSlider.max;
    const percentage = ((value - min) / (max - min)) * 100; // Calculate the percentage of the current value

    // Applying a dynamic background gradient
    this.lengthSlider.style.background = `linear-gradient(to right, #A4FFAF ${percentage}%, #18171F ${percentage}%)`
    this.length = length;
    this.lengthValue.textContent = length;
  }

  generatePassword() {
    const availableChars = this.getAvailableChars();

    if (availableChars.length === 0) {
      alert("Please select at least one character type!");
      return;
    }

    let password = Array.from({ length: this.length }, () =>
      availableChars[Math.floor(Math.random() * availableChars.length)]
    ).join("");

    this.output.value = password;
    this.updateStrength(password);
  }

  updateStrength(password) {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-[\]{};':",.<>?]/.test(password);

    let strength = "weak";
    if (length >= 12 && [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length >= 3) {
      strength = "strong";
    } else if (length >= 8 && [hasUppercase, hasLowercase, hasNumbers].filter(Boolean).length >= 2) {
      strength = "medium";
    }

      if (strength === "strong") {
          this.tooWeak.style.backgroundColor = "#A4FFAF";
          this.weak.style.backgroundColor = "#A4FFAF";
          this.medium.style.backgroundColor = "#A4FFAF";
          this.strong.style.backgroundColor = "#A4FFAF";
      }else if (strength == "medium") { 
          this.tooWeak.style.backgroundColor = "#F8CD65";
          this.weak.style.backgroundColor = "#F8CD65";
          this.medium.style.backgroundColor = "#F8CD65";
          this.strong.style.backgroundColor = "transparent";
      } else {
          this.tooWeak.style.backgroundColor = "#F64A4A";
          this.weak.style.backgroundColor = "transparent";
          this.medium.style.backgroundColor = "transparent";
          this.strong.style.backgroundColor = "transparent";
      }

      this.strenghtText.textContent = strength;
  }

  copyToClipboard() {
    if (!this.output.value) {
      alert("No password to copy!");
      return;
    }

     return navigator.clipboard.writeText(this.output.value).then(() => {
        this.notifyCopied.style.opacity = 1
        setTimeout(() => { 
            this.notifyCopied.style.opacity = 0
        }, 2000)
    });
  }
}

new PasswordGenerator();
