const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// Pega o nome do arquivo passado no terminal
const inputFile = process.argv[2];

if (!inputFile || !inputFile.endsWith('.tsx')) {
  console.error("❌ Por favor, informe um arquivo .tsx válido.");
  console.log("👉 Uso correto: node converter.js meuComponente.tsx");
  process.exit(1);
}

// Define o nome do arquivo de saída (substitui .tsx por .jsx)
const outputFile = inputFile.replace(/\.tsx$/, '.jsx');

// Configuração do Babel para remover o TypeScript preservando o JSX
babel.transformFileAsync(inputFile, {
  presets: [
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ],
  retainLines: true, // Mantém o máximo possível da formatação original das linhas
  generatorOpts: {
    jsescOption: { minimal: true } // Evita escapar caracteres desnecessariamente
  }
}).then(result => {
  fs.writeFileSync(outputFile, result.code);
  console.log(`✅ Sucesso! Arquivo convertido salvo como: ${outputFile}`);
}).catch(err => {
  console.error("❌ Erro ao tentar converter o arquivo:", err);
});