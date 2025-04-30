const output = document.getElementById('output');
const targetLang = document.getElementById('targetLang');

function startRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  output.innerText = "Listening...";
  recognition.start();

  recognition.onresult = async (event) => {
    const spokenText = event.results[0][0].transcript;
    output.innerText = `You said: "${spokenText}"`;

    const res = await fetch('/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: spokenText, targetLang: targetLang.value })
    });

    const { translatedText } = await res.json();
    output.innerText += `\n\nTranslated: "${translatedText}"`;

    speak(translatedText, targetLang.value);
  };

  recognition.onerror = (err) => {
    output.innerText = `Error: ${err.error}`;
  };
}

function speak(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}
