document.querySelectorAll('.login__input').forEach(input => {
  const clearBtn = input.nextElementSibling; // Asegure-se que é o botão correto

  input.addEventListener('input', () => {
      clearBtn.style.display = input.value ? 'block' : 'none'; // Mostra ou esconde baseado no conteúdo
  });

  clearBtn.addEventListener('click', () => {
      input.value = ''; // Limpa o campo
      clearButton.style.display = 'none'; // Esconde o botão
      input.focus(); // Devolve o foco ao input
  });
});
