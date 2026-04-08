import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Circle, Tag, Share2, Trash2 } from 'lucide-react';

const KanbanBoard = ({ tasks, toggleTask, deleteTask, onDragEnd }) => {
  const { t } = useTranslation();

  const columns = {
    'TODO': { id: 'TODO', title: t('toDoStatus'), items: [] },
    'IN_PROGRESS': { id: 'IN_PROGRESS', title: t('inProgressStatus'), items: [] },
    'DONE': { id: 'DONE', title: t('completedStatus'), items: [] },
  };

  tasks.forEach((task) => {
    const status = task.status || 'TODO';
    if (columns[status]) {
      columns[status].items.push(task);
    }
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="flex flex-col rounded-xl bg-secondary/30 p-4 border border-border">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
              {column.title} ({column.items.length})
            </h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 min-h-[300px] flex flex-col gap-3"
                >
                  {column.items.map((task, index) => (
                    <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`rounded-lg border border-border bg-background p-4 shadow-sm transition-all ${snapshot.isDragging ? 'shadow-lg scale-105 border-primary' : ''
                            }`}
                        >
                          <div className="flex flex-col gap-2">
                            <span
                              className={`text-sm font-medium ${task.status === 'DONE' || task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}
                            >
                              {task.title}
                            </span>
                            {task.category && (
                              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                                <Tag size={10} /> {task.category.name}
                              </span>
                            )}
                            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                              <button
                                onClick={() => toggleTask(task)}
                                className={`cursor-pointer border-none bg-transparent ${task.status === 'DONE' || task.is_completed ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'
                                  }`}
                              >
                                {task.status === 'DONE' || task.is_completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                              </button>
                              <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-foreground">
                                  <Share2 size={14} />
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
