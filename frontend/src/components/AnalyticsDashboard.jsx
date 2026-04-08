import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/todos/tasks/analytics/');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando Estatísticas...</div>;
  }

  const statusData = [
    { name: 'A Fazer', value: data.todo },
    { name: 'Em Progresso', value: data.in_progress },
    { name: 'Concluídas', value: data.completed },
  ].filter(d => d.value > 0);

  const catData = data.categories.map(c => ({ name: c.name, val: c.count })).filter(c => c.val > 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase">Total de Tarefas</p>
          <p className="text-4xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent mt-2">{data.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase">Taxa de Conclusão</p>
          <p className="text-4xl font-bold text-emerald-500 mt-2">
            {data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase">Trabalhando</p>
          <p className="text-4xl font-bold text-blue-500 mt-2">{data.in_progress}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase">Categorias</p>
          <p className="text-4xl font-bold text-amber-500 mt-2">{data.categories.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border bg-secondary/20 p-6">
          <h3 className="mb-6 font-semibold">Distribuição de Status</h3>
          <div className="h-[300px] w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center mt-10 text-muted-foreground">Sem dados suficientes.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/20 p-6">
          <h3 className="mb-6 font-semibold">Tarefas por Categoria</h3>
          <div className="h-[300px] w-full">
            {catData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                  <Bar dataKey="val" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center mt-10 text-muted-foreground">Crie categorias para visualizar</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
