const euCountries = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
];
const ukraine = "UA";

function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("accessBanner");
  const closeBtn = document.getElementById("bannerCloseBtn");
  const homebrew = document.querySelector(".homebrew");

  if (homebrew) {
    const height = homebrew.getBoundingClientRect().height;
    banner.style.top = height + "px";
  }

  if (getCookie("accessBannerDismissed")) return;

  fetch("https://ipapi.co/json/")
    .then(response => response.json())
    .then(data => {
      const countryCode = data.country;


      if (euCountries.includes(countryCode) || countryCode === ukraine) {
        banner.style.display = "flex";
      }
    })

  closeBtn.addEventListener("click", () => {
    banner.style.display = "none";
    setCookie("accessBannerDismissed", "true", 365);
  });
});