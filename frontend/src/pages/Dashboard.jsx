import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  Share2,
  Tag,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, catRes] = await Promise.all([
        api.get('/todos/tasks/'),
        api.get('/todos/categories/'),
      ]);
      setTasks(tasksRes.data.results || tasksRes.data);
      setCategories(catRes.data.results || catRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await api.post('/todos/tasks/', { title: newTaskTitle });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const suggestTask = async () => {
    setSuggesting(true);
    try {
      const res = await api.post('/todos/tasks/suggest/');
      setTasks([res.data, ...tasks]);
    } catch (error) {
      console.error('Error suggesting task', error);
    } finally {
      setSuggesting(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await api.patch(`/todos/tasks/${task.id}/`, {
        is_completed: !task.is_completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch (error) {
      console.error('Error toggling task', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/todos/tasks/${id}/`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-8">
      <header className="mb-8 flex items-center justify-between rounded-2xl border border-border bg-card px-8 py-4 shadow-sm transition-colors">
        <h1 className="bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
          {t('myToDoList')}
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            onClick={logout}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut size={18} /> {t('logout')}
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors md:col-span-1">
          <h2 className="mb-4 text-lg font-medium text-foreground">
            {t('categories')}
          </h2>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noCategories')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Tag size={16} className="text-primary" /> {cat.name}
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-colors md:col-span-3">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <form onSubmit={addTask} className="flex flex-1 gap-4">
              <input
                type="text"
                className="w-full flex-1 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                placeholder={t('whatNeedsToBeDone')}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-[1px] hover:bg-primary/90"
              >
                <Plus size={18} /> {t('add')}
              </button>
            </form>
            <button
              type="button"
              disabled={suggesting}
              onClick={suggestTask}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-70"
            >
              {suggesting ? t('suggesting') : t('suggestTask')}
            </button>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">
              {t('loadingTasks')}
            </p>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>{t('noTasksYet')}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all ${
                    task.is_completed
                      ? 'bg-transparent opacity-60'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTask(task)}
                      className={`cursor-pointer border-none bg-transparent transition-colors ${
                        task.is_completed
                          ? 'text-emerald-500 hover:text-emerald-600'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {task.is_completed ? (
                        <CheckCircle size={22} />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>
                    <span
                      className={`text-foreground ${task.is_completed ? 'text-muted-foreground line-through' : ''}`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer border-none bg-transparent p-2 text-muted-foreground transition-colors hover:text-foreground"
                      title="Share task"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="cursor-pointer border-none bg-transparent p-2 text-muted-foreground transition-colors hover:text-destructive"
                      title="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
