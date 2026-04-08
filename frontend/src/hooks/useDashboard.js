import { useState, useEffect } from 'react';

import api from '../api/axios';

export const useDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, catRes, meRes] = await Promise.all([
        api.get('/todos/tasks/'),
        api.get('/todos/categories/'),
        api.get('/users/me/'),
      ]);
      setTasks(tasksRes.data.results || tasksRes.data);
      setCategories(catRes.data.results || catRes.data);
      setProfile(meRes.data.profile);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const reFetchProfile = async () => {
    try {
      const meRes = await api.get('/users/me/');
      setProfile(meRes.data.profile);
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await api.post('/todos/categories/', {
        name: newCategoryName,
      });
      setCategories([...categories, res.data]);
      setNewCategoryName('');
      setSelectedCategory(res.data.id);
    } catch (error) {
      console.error('Error adding category', error);
    } finally {
      setAddingCategory(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const payload = { title: newTaskTitle, status: 'TODO' };
    if (selectedCategory) payload.category_id = selectedCategory;

    try {
      const res = await api.post('/todos/tasks/', payload);
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
      setSelectedCategory('');
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
      const isFinishing = !task.is_completed;
      const res = await api.patch(`/todos/tasks/${task.id}/`, {
        is_completed: isFinishing,
        status: isFinishing ? 'DONE' : 'TODO',
      });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));

      if (isFinishing) reFetchProfile();
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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const taskId = parseInt(draggableId, 10);
    const newStatus = destination.droppableId;

    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: newStatus, is_completed: newStatus === 'DONE' };
      }
      return t;
    });
    setTasks(updatedTasks);

    try {
      await api.patch(`/todos/tasks/${taskId}/`, {
        status: newStatus,
        is_completed: newStatus === 'DONE',
      });
      if (newStatus === 'DONE' && source.droppableId !== 'DONE') {
        reFetchProfile();
      }
    } catch (error) {
      console.error('Failed to move task', error);
      fetchData();
    }
  };

  return {
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
  };
};
