import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  Share2,
  Tag,
  LayoutList,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import GamificationHeader from '../components/GamificationHeader';
import KanbanBoard from '../components/KanbanBoard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const {
    tasks,
    categories,
    profile,
    loading,
    newTaskTitle,
    setNewTaskTitle,
    newCategoryName,
    setNewCategoryName,
    selectedCategory,
    setSelectedCategory,
    suggesting,
    addingCategory,
    activeTab,
    setActiveTab,
    addCategory,
    addTask,
    suggestTask,
    toggleTask,
    deleteTask,
    onDragEnd,
  } = useDashboard();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-8">
      {/* HEADER */}
      <header className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card px-8 py-4 shadow-sm transition-colors md:flex-row">
        <div className="flex items-center gap-4">
          <h1 className="bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            {t('myToDoList')}
          </h1>
        </div>

        <GamificationHeader profile={profile} />

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

      {/* TABS NAVIGATION */}
      <div className="mb-8 flex justify-center">
        <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <LayoutList size={16} /> {t('quickList')}
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'board'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <LayoutDashboard size={16} /> {t('kanbanBoard')}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <BarChart3 size={16} /> {t('analytics')}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="p-12 text-center text-muted-foreground">
          {t('loadingInterface')}
        </p>
      ) : (
        <>
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {/* LIST/BOARD TABS */}
          {(activeTab === 'list' || activeTab === 'board') && (
            <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 lg:grid-cols-4">
              {/* SIDEBAR CATEGORIES */}
              <aside className="flex h-fit flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors lg:col-span-1">
                <div>
                  <h2 className="mb-4 text-lg font-medium text-foreground">
                    {t('categories')}
                  </h2>
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('noCategories')}
                    </p>
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
                </div>

                <form
                  onSubmit={addCategory}
                  className="flex flex-col gap-2 border-t border-border pt-4"
                >
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                    placeholder={t('newCategory') || 'Nova Categoria...'}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={addingCategory}
                    className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-70"
                  >
                    <Plus size={16} />{' '}
                    {addingCategory
                      ? '...'
                      : t('addCategoryBtn') || 'Adicionar'}
                  </button>
                </form>
              </aside>

              {/* MAIN CONTENT AREA */}
              <section className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors lg:col-span-3">
                <div className="mb-8 flex flex-col gap-4">
                  <form
                    onSubmit={addTask}
                    className="flex flex-col gap-4 sm:flex-row"
                  >
                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:gap-4">
                      <input
                        type="text"
                        className="w-full flex-1 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                        placeholder={t('whatNeedsToBeDone')}
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                      />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 sm:w-48"
                      >
                        <option value="">
                          {t('selectCategory') || 'Sem categoria'}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-[1px] hover:bg-primary/90"
                      >
                        <Plus size={18} /> {t('add')}
                      </button>
                      <button
                        type="button"
                        disabled={suggesting}
                        onClick={suggestTask}
                        className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-70"
                      >
                        💡
                      </button>
                    </div>
                  </form>
                </div>

                {activeTab === 'list' &&
                  (tasks.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      {t('noTasksYet')}
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-4">
                      {tasks.map((task) => (
                        <li
                          key={task.id}
                          className={`flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all ${task.is_completed ? 'bg-transparent opacity-60' : 'hover:border-primary/50'}`}
                        >
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleTask(task)}
                              className={`cursor-pointer border-none bg-transparent transition-colors ${task.is_completed ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'}`}
                            >
                              {task.is_completed ? (
                                <CheckCircle size={22} />
                              ) : (
                                <Circle size={22} />
                              )}
                            </button>
                            <div className="flex flex-col">
                              <span
                                className={`font-medium text-foreground ${task.is_completed ? 'text-muted-foreground line-through' : ''}`}
                              >
                                {task.title}
                              </span>
                              {task.category && (
                                <span className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                                  <Tag size={10} /> {task.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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
                  ))}

                {activeTab === 'board' && (
                  <KanbanBoard
                    tasks={tasks}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                    onDragEnd={onDragEnd}
                  />
                )}
              </section>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
