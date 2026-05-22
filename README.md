# Logistics Control Tower 🚛

Uma torre de controle logístico de alta performance desenvolvida para monitoramento de frota, otimização de ocupação de carga e gestão de custos operacionais. O projeto utiliza uma identidade visual inspirada na Scania, focada em clareza, minimalismo e eficiência de dados.

## 🚀 Funcionalidades Principais

- **Monitoramento de KPIs em Tempo Real**: Cálculos automáticos de OTIF (On-Time In-Full), Ocupação Média da Frota e Custo Médio por Quilômetro.
- **Gestão de Operações (CRUD)**: Interface intuitiva para cadastrar e remover viagens e veículos da malha logística.
- **Inteligência de Backhaul**: Alertas visuais automáticos para veículos com ocupação inferior a 50%, facilitando a identificação de oportunidades de carga de retorno.
- **Filtros Operacionais**: Segmentação instantânea por status (Pendente, Carregando, Em Rota).
- **Persistência de Dados**: Integração com `localStorage` para garantir que as informações não sejam perdidas ao recarregar a página.
- **Design Responsivo**: Interface adaptável para diferentes resoluções, mantendo a senioridade visual e a hierarquia de informações.

## 🛠️ Tecnologias Utilizadas

- **React.js**: Biblioteca principal para construção da interface reativa.
- **Tailwind CSS**: Framework utilitário para estilização avançada e design system.
- **Lucide React**: Conjunto de ícones minimalistas para melhoria da experiência do usuário.
- **Hooks Avançados**: Utilização de `useMemo` para processamento pesado de indicadores e `useEffect` para persistência.
- **Vite**: Ferramenta de build rápida para o desenvolvimento frontend moderno.

## 📦 Instalação e Uso

1. Clone o repositório:
   ```bash
   git clone [url-do-repositorio]
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📊 Estrutura de Dados

O sistema processa objetos de carga com a seguinte estrutura:
- `id`: Identificador único (Padrão SN-0000).
- `destino`: Localidade de entrega.
- `status`: Estado atual da operação.
- `ocupacao`: Percentual de aproveitamento do implemento.
- `data`: Registro cronológico do cadastro.

---

**Nota Técnica**: Este projeto foi desenvolvido com foco em performance visual (Senior Design) e humanização de código, seguindo os mais altos padrões de engenharia de software frontend.

&copy; 2024 Scania Logistics Control Tower.
