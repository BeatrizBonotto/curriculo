# Planilhas de exemplo no Google Sheets

Material de uso pessoal para montar os prints do portfólio. Não vai para o site. Todos os dados são fictícios.

## 1. Importar sem quebrar colunas
1. Crie uma planilha em branco no Google Sheets.
2. **Arquivo > Configurações > Localidade: Brasil** (assim `480,00` vira número e as fórmulas usam `;`).
3. **Arquivo > Importar > Fazer upload** e escolha o `.csv`.
4. Local de importação: **Substituir planilha atual**. Tipo de separador: **Personalizado** com `;`.
5. Marque **Converter texto em números, datas e fórmulas** e clique em **Importar dados**.
6. Selecione tudo e use **Formatar > Converter em tabela** (ou **Dados > Criar um filtro**).

## 2. Fórmulas (controle_renovacoes_seguros)
Colunas: H = Dias_Para_Vencer, I = Valor_Premio, J = Status_Renovacao.

| Para quê | Fórmula |
|---|---|
| Prioridade (coluna K, a partir de K2) | `=SE(H2<=30;"URGENTE";SE(H2<=60;"ATENÇÃO";"NO PRAZO"))` |
| Prêmio total pendente | `=SOMASE(J:J;"Pendente";I:I)` |
| Apólices vencendo em até 30 dias | `=CONT.SE(H:H;"<=30")` |
| Taxa de renovação | `=CONT.SE(J:J;"Renovada")/CONT.VALORES(J2:J)` |
| Prêmio por imobiliária (tabela pronta) | `=QUERY(A1:J;"select C, sum(I) where C is not null group by C";1)` |

## 3. Fórmulas (controle_suprimentos_chamados)
Colunas: D = Estoque_Atual, E = Estoque_Minimo.

| Para quê | Fórmula |
|---|---|
| Sinalizar reposição (coluna H) | `=SE(D2<=E2;"REPOR";"OK")` |
| Itens abaixo do mínimo | `=CONT.SE(F:F;"Pedido aberto")` |

## 4. Cores e gráfico para o print
1. Selecione a coluna K > **Formatar > Formatação condicional > O texto é exatamente**: URGENTE em vermelho claro, ATENÇÃO em amarelo, NO PRAZO em verde.
2. Selecione as colunas J e I > **Inserir > Gráfico**. Tipo **Coluna**, agregue por soma, título "Prêmio por status", sem linhas de grade.
3. Para o print: **Ver > Mostrar > desmarque Linhas de grade**, zoom 100% e **Win + Shift + S**.
