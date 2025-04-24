import React, { useState, useEffect } from 'react';

type Item = { id: number; text: string; done: boolean };

const TodoList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState('');

  // 1. 组件首次挂载时，从 localStorage 读取
  useEffect(() => {
    try {
      const saved = localStorage.getItem('todo-items');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('读取待办列表失败', e);
    }
  }, []);

  // 2. 每当 items 改变，就写入 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('todo-items', JSON.stringify(items));
    } catch (e) {
      console.error('保存待办列表失败', e);
    }
  }, [items]);

  const add = () => {
    if (!text.trim()) return;
    setItems([...items, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  };
  const toggle = (id: number) =>
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const remove = (id: number) =>
    setItems(items.filter(i => i.id !== id));

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">我的待办</h2>
      <div className="flex mb-4">
        <input
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="新任务…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button
          className="px-4 bg-indigo-500 text-white rounded-r hover:bg-indigo-600 transition"
          onClick={add}
        >
          添加
        </button>
      </div>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggle(item.id)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className={item.done ? 'line-through text-gray-400' : ''}>
                {item.text}
              </span>
            </label>
            <button
              onClick={() => remove(item.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
