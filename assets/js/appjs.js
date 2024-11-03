
document.querySelector('.burger').addEventListener('click', function() {
  this.classList.toggle('toggle');
  const headerMenu = document.querySelector('.header__menu');
  if (headerMenu.style.transform === 'translateY(0%)') {
    headerMenu.style.transform = 'translateY(-100%)';
  } else {
    headerMenu.style.transform = 'translateY(0%)';
  }
});

// Animation for burger icon lines
document.querySelector('.burger').addEventListener('click', function() {
  const lines = document.querySelectorAll('.burger div');
  lines[0].classList.toggle('rotate1');
  lines[1].classList.toggle('rotate2');
  lines[2].classList.toggle('rotate3');
});

// ----------------

document.getElementById('stakingAmount').addEventListener('input', function () {
  const stakingAmount = this.value;
  document.getElementById('stakingAmountDisplay').textContent = `$${Number(stakingAmount).toLocaleString()}`;
  updateIncome();
});

document.getElementById('paymentPeriod').addEventListener('input', function () {
  const paymentPeriod = this.value;
  document.getElementById('paymentPeriodDisplay').textContent = `${paymentPeriod} Days`;
  updateIncome();
});

function updateIncome() {
  const stakingAmount = document.getElementById('stakingAmount').value;
  const paymentPeriod = document.getElementById('paymentPeriod').value;
  const apr = 4.95 / 365;  // APR divided by days in year for daily rate
  const income = ((stakingAmount * (apr / 100)) * paymentPeriod).toFixed(2);
  document.getElementById('incomeDisplay').textContent = `$${income}`;
}