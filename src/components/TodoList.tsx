import React, { useState, useEffect, useMemo } from 'react'

export type Item = {
  id: number  // 为每个 item 添加 id 字段
  text: string
  done: boolean
  time: string
}

export type SubCategory = {
  id: number  // 为子分类添加 id 字段
  subCategory: string
  items: Item[]
}

export type Category = {
  id: number  // 为 category 添加 id 字段
  category: string
  color: keyof typeof colorMap
  sub: SubCategory[]
}

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
    checkboxAccent: 'accent-violet-600',
  },
} as const

interface TodoListProps {
  todos: Category[]
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  // 一级分类排序
  const sortedCategories = useMemo(() => {
    return [...todos].sort((a, b) => a.id - b.id)
  }, [todos])

  const [activeCat, setActiveCat] = useState(sortedCategories[0]?.category ?? '')
  const activeColor = sortedCategories.find(c => c.category === activeCat)?.color ?? 'rose'

  const subsForActive = sortedCategories.find(c => c.category === activeCat)?.sub ?? []
  const sortedSubs = useMemo(() => {
    return [...subsForActive].sort((a, b) => a.id - b.id)
  }, [activeCat, sortedCategories])

  const [activeSub, setActiveSub] = useState(sortedSubs[0]?.subCategory ?? '')
  useEffect(() => {
    const subs = sortedCategories.find(c => c.category === activeCat)?.sub ?? []
    setActiveSub(subs[0]?.subCategory ?? '')
  }, [activeCat, sortedCategories])

  // 对 items 按照 "done" 状态排序，未完成的在前面，再按 id 排序
  const items = useMemo(() => {
    const list = sortedCategories
      .find(c => c.category === activeCat)
      ?.sub.find(s => s.subCategory === activeSub)
      ?.items ?? []
    return [...list].sort((a, b) => {
      // 未完成的排在前面，按 id 排序
      if (a.done !== b.done) return a.done ? 1 : -1
      return a.id - b.id
    })
  }, [sortedCategories, activeCat, activeSub])

  const m = colorMap[activeColor]

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
      {/* 标题区 */}
      <div className="px-10 py-6 flex items-center gap-4 bg-gradient-to-r from-green-400 via-teal-500 to-blue-400">
        <span className="text-5xl select-none">📝</span>
        <h2 className="text-4xl font-extrabold text-base-100">TodoLists</h2>
      </div>

      {/* 一级分类 Tabs */}
      <div className="flex flex-wrap gap-4 p-6 bg-base-200">
        {sortedCategories.map(({ category, color, id }) => {
          const mp = colorMap[color]
          const isActive = category === activeCat
          return (
            <button
              key={id}
              onClick={() => setActiveCat(category)}
              className={`px-6 py-2 rounded-full text-lg font-medium transition
                ${isActive ? mp.tabActiveBg : mp.tabInactiveBg}
                ${isActive ? mp.tabActiveText : mp.tabInactiveText}
                ${isActive ? 'shadow-lg' : mp.tabHoverBg}`}
            >
              {category}
            </button>
          )
        })}
      </div>

      {/* 二级分类 Tabs */}
      <div className="flex flex-wrap gap-3 px-10 pt-4 bg-base-200 mb-4">
        {sortedSubs.map(({ subCategory, id }) => {
          const isActive = subCategory === activeSub
          return (
            <button
              key={id}
              onClick={() => setActiveSub(subCategory)}
              className={`px-4 py-2 rounded-lg text-md transition
                ${isActive ? m.subActiveBg : m.subInactiveBg}
                ${isActive ? 'text-white' : m.subInactiveText}
                ${!isActive ? m.subHoverBg : ''}`}
            >
              {subCategory}
            </button>
          )
        })}
      </div>

      {/* 列表区 */}
      <div className="px-10 py-6 bg-base-100">
        <ul className="space-y-4 overflow-y-auto h-[60vh] pr-2">
          {items.length > 0 ? (
            items.map(item => (
              <li
                key={item.id}
                className="flex justify-between items-center border border-base-300 rounded-2xl px-8 py-4 bg-base-200"
              >
                <label className="flex items-center gap-5">
                  <input
                    type="checkbox"
                    checked={item.done}
                    readOnly
                    className={`w-7 h-7 ${m.checkboxAccent}`}
                  />
                  <span
                    className={`text-xl font-medium text-base-content ${item.done ? 'opacity-60 line-through' : ''}`}
                  >
                    {item.text}
                  </span>
                </label>
                {/* 时间字段显示，如果为空则不显示 */}
                {item.time && (
                  <time className="text-sm text-base-content/60">
                    {new Date(item.time).toISOString().split('T')[0]}
                  </time>
                )}
              </li>
            ))
          ) : (
            <li className="text-center text-base-content/60 py-12">暂无任务</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default TodoList
