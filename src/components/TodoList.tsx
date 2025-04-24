// src/components/TodoList.tsx
import React, { useState, useEffect, useMemo } from 'react'

export type Item = {
  text: string
  done: boolean
  time: string
}
export type SubCategory = {
  subCategory: string
  items: Item[]
}
export type Category = {
  category: string
  color: keyof typeof colorMap
  sub: SubCategory[]
}

// 1. 把所有可能用到的色系写到这里
const colorMap = {
  rose: {
    tabActiveBg: 'bg-rose-500',
    tabActiveText: 'text-white',
    tabInactiveBg: 'bg-rose-100',
    tabInactiveText: 'text-rose-700',
    tabHoverBg: 'hover:bg-rose-200',
    subActiveBg: 'bg-rose-600',
    subInactiveBg: 'bg-rose-200',
    subInactiveText: 'text-rose-800',
    subHoverBg: 'hover:bg-rose-300',
    itemBg: 'bg-rose-50',
    checkboxAccent: 'accent-rose-600',
  },
  emerald: {
    tabActiveBg: 'bg-emerald-500',
    tabActiveText: 'text-white',
    tabInactiveBg: 'bg-emerald-100',
    tabInactiveText: 'text-emerald-700',
    tabHoverBg: 'hover:bg-emerald-200',
    subActiveBg: 'bg-emerald-600',
    subInactiveBg: 'bg-emerald-200',
    subInactiveText: 'text-emerald-800',
    subHoverBg: 'hover:bg-emerald-300',
    itemBg: 'bg-emerald-50',
    checkboxAccent: 'accent-emerald-600',
  },
  sky: {
    tabActiveBg: 'bg-sky-500',
    tabActiveText: 'text-white',
    tabInactiveBg: 'bg-sky-100',
    tabInactiveText: 'text-sky-700',
    tabHoverBg: 'hover:bg-sky-200',
    subActiveBg: 'bg-sky-600',
    subInactiveBg: 'bg-sky-200',
    subInactiveText: 'text-sky-800',
    subHoverBg: 'hover:bg-sky-300',
    itemBg: 'bg-sky-50',
    checkboxAccent: 'accent-sky-600',
  },
  indigo: {
    tabActiveBg: 'bg-indigo-500',
    tabActiveText: 'text-white',
    tabInactiveBg: 'bg-indigo-100',
    tabInactiveText: 'text-indigo-700',
    tabHoverBg: 'hover:bg-indigo-200',
    subActiveBg: 'bg-indigo-600',
    subInactiveBg: 'bg-indigo-200',
    subInactiveText: 'text-indigo-800',
    subHoverBg: 'hover:bg-indigo-300',
    itemBg: 'bg-indigo-50',
    checkboxAccent: 'accent-indigo-600',
  },
  violet: {
    tabActiveBg: 'bg-violet-500',
    tabActiveText: 'text-white',
    tabInactiveBg: 'bg-violet-100',
    tabInactiveText: 'text-violet-700',
    tabHoverBg: 'hover:bg-violet-200',
    subActiveBg: 'bg-violet-600',
    subInactiveBg: 'bg-violet-200',
    subInactiveText: 'text-violet-800',
    subHoverBg: 'hover:bg-violet-300',
    itemBg: 'bg-violet-50',
    checkboxAccent: 'accent-violet-600',
  },
} as const

interface TodoListProps {
  todos: Category[]
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  // 1. 一级分类
  const [activeCat, setActiveCat] = useState(todos[0]?.category ?? '')
  const activeColor = todos.find(c => c.category === activeCat)?.color ?? 'rose'
  // 2. 二级分类
  const subsForActive = todos.find(c => c.category === activeCat)?.sub ?? []
  const [activeSub, setActiveSub] = useState(subsForActive[0]?.subCategory ?? '')
  useEffect(() => {
    const subs = todos.find(c => c.category === activeCat)?.sub ?? []
    setActiveSub(subs[0]?.subCategory ?? '')
  }, [activeCat, todos])

  // 3. 排序：未完成→完成 + 时间降序
  const items = useMemo(() => {
    const list = todos
      .find(c => c.category === activeCat)
      ?.sub.find(s => s.subCategory === activeSub)
      ?.items ?? []
    return [...list].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      return new Date(b.time).getTime() - new Date(a.time).getTime()
    })
  }, [todos, activeCat, activeSub])

  // 取映射
  const m = colorMap[activeColor]

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* 美化后的标题区：渐变背景 + Emoji */}
      {/* <div className="px-10 py-6 flex items-center gap-4 bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 rounded-t-3xl"> */}
      <div className="px-10 py-6 flex items-center gap-4 bg-gradient-to-r from-green-400 via-teal-500 to-blue-400 rounded-t-3xl">
         <span className="text-5xl select-none">📝</span>
         <h2 className="text-4xl font-extrabold text-white">我的待办</h2>
       </div>

      {/* 一级分类 Tabs */}
      <div className="flex flex-wrap gap-4 p-6 bg-gray-50">
        {todos.map(({ category, color }) => {
          const mp = colorMap[color]
          const isActive = category === activeCat
          return (
            <button
              key={category}
              onClick={() => setActiveCat(category)}
              className={`
                px-6 py-2 rounded-full text-lg font-medium transition
                ${isActive ? mp.tabActiveBg : mp.tabInactiveBg}
                ${isActive ? mp.tabActiveText : mp.tabInactiveText}
                ${isActive ? 'shadow-lg' : mp.tabHoverBg}
              `}
            >
              {category}
            </button>
          )
        })}
      </div>

      {/* 二级分类 Tabs */}
      <div className="flex flex-wrap gap-3 px-10 pt-6">
        {subsForActive.map(({ subCategory }) => {
          const isActive = subCategory === activeSub
          return (
            <button
              key={subCategory}
              onClick={() => setActiveSub(subCategory)}
              className={`
                px-4 py-1 rounded-lg text-md transition
                ${isActive ? m.subActiveBg : m.subInactiveBg}
                ${isActive ? 'text-white' : m.subInactiveText}
                ${!isActive ? m.subHoverBg : ''}
              `}
            >
              {subCategory}
            </button>
          )
        })}
      </div>

      {/* 固定高度 + 滚动条 */}
      <div className="px-10 py-6">
        <ul className="space-y-4 overflow-y-auto h-[60vh] pr-2">
          {items.length > 0 ? (
            items.map(item => (
              <li
                className={`
                  flex justify-between items-center
                  ${m.itemBg} rounded-2xl px-8 py-4
                `}
              >
                <label className="flex items-center gap-5">
                  <input
                    type="checkbox"
                    checked={item.done}
                    readOnly
                    className={`
                      w-7 h-7 ${m.checkboxAccent}
                      ${item.done ? 'opacity-60' : ''}
                    `}
                  />
                  <span
                    className={`
                      text-xl font-medium
                      ${item.done ? 'line-through text-gray-400' : 'text-gray-900'}
                    `}
                  >
                    {item.text}
                  </span>
                </label>
                <time className="text-sm text-gray-500">
                    {new Date(item.time).toISOString().split('T')[0]}
                </time>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400 py-12">
              暂无任务
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default TodoList
