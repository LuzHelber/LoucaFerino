const pontuacao = {};
const canvas = document.getElementById('grafico');

function adicionarResultado() {
  const competidor = document.getElementById('competidor').value;
  const rodada = document.getElementById('rodada').value;

  const resultadoExistente = Object.values(pontuacao).find(r => r.rodada === rodada);
  if (resultadoExistente) {
    alert('Já existe um resultado para essa rodada!');
    return;
  }

  if (pontuacao[competidor]) {
    pontuacao[competidor].pontos++;
  } else {
    pontuacao[competidor] = { competidor, rodada, pontos: 1 };
  }

  atualizarResultados();
}

function somarPontuacoes() {
  let totalPontos = 0;
  for (let competidor in pontuacao) {
    totalPontos += pontuacao[competidor].pontos;
  }
  return totalPontos;
}

function atualizarResultados() {
  const pontuacoes = Object.values(pontuacao);
  const resultadoHtml = pontuacoes
    .map(({ competidor, pontos }) => `<li>${competidor}: ${pontos} ponto(s)</li>`)
    .join('');

  document.getElementById('pontuacao').innerHTML = resultadoHtml;

  const labels = pontuacoes.map(({ competidor }) => competidor);
  const data = pontuacoes.map(({ pontos }) => pontos);

  if (window.grafico && typeof window.grafico.destroy === 'function') {
    window.grafico.destroy(); 
  }

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Pontuação (Total: ' + somarPontuacoes() + ')', 
      data: data,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 1
        }
      }]
    }
  };
  if (pontuacoes.length > 0) {
    if (pontuacoes.length === 1) {
      options.scales.xAxes[0].ticks.max = 1;
    }
    window.grafico = new Chart(canvas.getContext('2d'), {
      type: 'horizontalBar',
      data: chartData,
      options: options
    });
  }
}

document.getElementById('cadastro-rodada-form').addEventListener('submit', event => {
  event.preventDefault();
  adicionarResultado();
});
