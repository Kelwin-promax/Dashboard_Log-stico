import { useState, useEffect, useMemo } from 'react';
import { Truck, BarChart3, Package, Trash2, AlertTriangle, CheckCircle2, DollarSign, ArrowDownUp } from 'lucide-react';

function App() {
  // Gerenciamento das cargas com recuperação de dados salvos anteriormente no navegador
  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('scania_logistica_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [filtro, setFiltro] = useState('Todos');

  // Sincroniza a lista de cargas com o armazenamento local sempre que houver uma alteração
  useEffect(() => {
    localStorage.setItem('scania_logistica_v1', JSON.stringify(shipments));
  }, [shipments]);


  // Processamento dos indicadores de desempenho (KPIs) baseados na frota ativa
  const performanceKpis = useMemo(() => {
    if (shipments.length === 0) return { otif: 0, ocupacaoMedia: 0, custoMedio: 0, totalCargas: 0, alertas: 0 };

    const totalCargas = shipments.length;
    let cargasNoPrazo = 0;
    let somaOcupacao = 0;
    let somaCusto = 0;
    let alertasBackhaul = 0;

    shipments.forEach(ship => {
      // Consideramos veículos em rota ou em carregamento como entregas dentro do prazo planejado
      if (ship.status === 'Em Rota' || ship.status === 'Carregando') cargasNoPrazo++;

      // Consolidação da taxa de ocupação para cálculo da média geral
      const ocup = parseInt(ship.ocupacao);
      somaOcupacao += ocup;
      
      // Identificamos veículos com menos de 50% de carga para otimização de retorno (backhaul)
      if (ocup < 50) alertasBackhaul++;

      // Estimativa de custo por KM, aplicando uma taxa adicional para veículos subutilizados
      const custoBase = 4.80; 
      const custoCarga = ocup < 50 ? custoBase * 1.3 : custoBase; 
      somaCusto += custoCarga;
    });

    return {
      totalCargas,
      otif: ((cargasNoPrazo / totalCargas) * 100).toFixed(1),
      ocupacaoMedia: (somaOcupacao / totalCargas).toFixed(0),
      custoMedio: (somaCusto / totalCargas).toFixed(2),
      alertas: alertasBackhaul
    };
  }, [shipments]);


  // Funções responsáveis pela manutenção da lista de veículos
  const adicionarCarga = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ocupacaoVal = formData.get('ocupacao');
    
    // Garantimos que a ocupação informada esteja dentro do limite percentual permitido
    if (ocupacaoVal < 0 || ocupacaoVal > 100) {
      alert("Ocupação deve ser entre 0 e 100%");
      return;
    }

    const novaCarga = {
      id: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
      destino: formData.get('destino'),
      status: formData.get('status'),
      ocupacao: `${ocupacaoVal}%`,
      data: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})
    };

    setShipments([novaCarga, ...shipments]);
    e.target.reset();
  };

  const excluirCarga = (id) => {
    // Solicitação de confirmação para evitar exclusões acidentais
    if (window.confirm("Deseja realmente remover este veículo da lista?")) {
      setShipments(shipments.filter(ship => ship.id !== id));
    }
  };

  const cargasFiltradas = shipments.filter(ship => 
    filtro === 'Todos' ? true : ship.status === filtro
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Seção de cabeçalho com identificação do painel e status do sistema */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Logistics Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring fleet performance and load efficiency</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live System</span>
          </div>
        </div>
      </header>

      {/* Exibição resumida dos principais indicadores de desempenho (KPIs) */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'OTIF Rate', value: `${performanceKpis.otif}%`, trend: 'Target: 95%' },
          { label: 'Avg Occupation', value: `${performanceKpis.ocupacaoMedia}%`, trend: 'Fleet Wide' },
          { label: 'Cost per Km', value: `R$ ${performanceKpis.custoMedio}`, trend: 'Current Avg' },
          { label: 'Active Fleet', value: performanceKpis.totalCargas, trend: 'Units' },
          { label: 'Attention', value: performanceKpis.alertas, trend: 'Low Backhaul', alert: performanceKpis.alertas > 0 },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{kpi.label}</p>
            <p className={`text-2xl font-semibold ${kpi.alert ? 'text-red-500' : 'text-slate-900'}`}>{kpi.value}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{kpi.trend}</p>
          </div>
        ))}
      </section>

      {/* Interface para o registro de novas movimentações de carga */}
      <section className="mb-8 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Package className="size-4 text-slate-400" /> Register New Shipment
        </h2>
        <form onSubmit={adicionarCarga} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <input name="destino" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900/5 outline-none transition-all" placeholder="Destination" />
          </div>
          <div className="w-32">
            <input name="ocupacao" type="number" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="Load %" />
          </div>
          <div className="w-40">
            <select name="status" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer">
              <option>Pendente</option>
              <option>Carregando</option>
              <option>Em Rota</option>
            </select>
          </div>
          <button type="submit" className="px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
            Register
          </button>
        </form>
      </section>

      {/* Listagem detalhada dos veículos em operação e suas respectivas ocupações */}
      <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-sm font-semibold text-slate-800">Active Shipments</h2>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200/50">
            {['Todos', 'Em Rota', 'Carregando', 'Pendente'].map((status) => (
              <button
                key={status}
                onClick={() => setFiltro(status)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filtro === status 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Área de exibição de dados estruturados */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                {['ID Veículo', 'Cadastro', 'Destino', 'Status', 'Ocupação', 'Ações'].map(header => (
                  <th key={header} className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cargasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-24 text-slate-500">
                    <Package className="size-14 mx-auto mb-5 text-slate-200" />
                    <p className="font-semibold text-slate-800">Nenhum veículo na lista</p>
                    <p className="text-sm mt-1">Utilize o formulário acima para cadastrar a primeira viagem.</p>
                  </td>
                </tr>
              ) : (
                cargasFiltradas.map((ship) => {
                  const ocupNum = parseInt(ship.ocupacao);
                  const isLow = ocupNum < 50;
                  
                  return (
                    <tr key={ship.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-slate-950 tracking-tight">{ship.id}</td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium">{ship.data}</td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-800">{ship.destino}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 border ${
                          ship.status === 'Em Rota' ? 'bg-sky-50 text-sky-700 border-sky-100' : 
                          ship.status === 'Carregando' ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {ship.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {/* Representação visual da taxa de ocupação do veículo */}
                          <div className="w-28 bg-slate-100 rounded-full h-2 border border-slate-200/70 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ease-out ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                              style={{ width: ship.ocupacao }}
                            ></div>
                          </div>
                          <span className={`text-sm font-bold font-mono w-10 text-right ${isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {ship.ocupacao}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => excluirCarga(ship.id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Remover Veículo"
                        >
                          <Trash2 className="size-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;